"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

// ── Markers & their user cards ─────────────────────────────────────────────
const MARKERS = [
  { id: "sf",      location: [ 37.78, -122.44] as [number,number], name: "Sarah Johnson", city: "San Francisco 🇺🇸", initials: "SJ", color: "#7c3aed" },
  { id: "nyc",     location: [ 40.71,  -74.01] as [number,number], name: "James Wilson",   city: "New York 🇺🇸",       initials: "JW", color: "#0891b2" },
  { id: "london",  location: [ 51.51,   -0.13] as [number,number], name: "Ahmed Khan",     city: "London 🇵🇰",          initials: "AK", color: "#2563eb" },
  { id: "paris",   location: [ 48.86,    2.35] as [number,number], name: "Zara Sheikh",    city: "Paris 🇵🇰",           initials: "ZS", color: "#d97706" },
  { id: "tokyo",   location: [ 35.68,  139.65] as [number,number], name: "Mike Chen",      city: "Tokyo 🇺🇸",           initials: "MC", color: "#059669" },
  { id: "sydney",  location: [-33.87,  151.21] as [number,number], name: "Emily Davis",    city: "Sydney 🇺🇸",          initials: "ED", color: "#dc2626" },
  { id: "dubai",   location: [ 25.20,   55.27] as [number,number], name: "Hassan Raza",    city: "Dubai 🇵🇰",           initials: "HR", color: "#c026d3" },
  { id: "karachi", location: [ 24.86,   67.01] as [number,number], name: "Ayesha Malik",   city: "Karachi 🇵🇰",         initials: "AM", color: "#ea580c" },
]

// ── 3D → 2D projection matching cobe's coordinate system ─────────────────
function projectMarker(
  lat: number, lon: number,
  phi: number, theta: number
): { x: number; y: number; visible: boolean; depth: number } {
  const la = lat * (Math.PI / 180)
  const lo = lon * (Math.PI / 180)

  // Cartesian on unit sphere (cobe convention: z is forward)
  let px = Math.cos(la) * Math.cos(lo)
  let py = Math.sin(la)
  let pz = Math.cos(la) * Math.sin(lo)

  // Rotate around Y by -phi (horizontal rotation)
  const rx = px * Math.cos(-phi) - pz * Math.sin(-phi)
  const rz = px * Math.sin(-phi) + pz * Math.cos(-phi)
  px = rx; pz = rz

  // Rotate around X by theta (vertical tilt)
  const ry = py * Math.cos(theta) - pz * Math.sin(theta)
  const rz2 = py * Math.sin(theta) + pz * Math.cos(theta)
  py = ry; pz = rz2

  return {
    x: px,
    y: py,
    depth: pz,
    visible: pz > 0.08, // threshold avoids edge flickering
  }
}

// ── Component ──────────────────────────────────────────────────────────────
interface GlobeLiveProps {
  className?: string
  speed?:     number
  darkMode?:  boolean
}

export function GlobeLive({ className = "", speed = 0.003, darkMode = true }: GlobeLiveProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const cardRefs   = useRef<Map<string, HTMLDivElement>>(new Map())

  const dragging   = useRef<{ x: number; y: number } | null>(null)
  const drag       = useRef({ phi: 0, theta: 0 })
  const phiBase    = useRef(0)
  const thetaBase  = useRef(0)
  const paused     = useRef(false)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    paused.current = true
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return
      drag.current = {
        phi:   (e.clientX - dragging.current.x) / 300,
        theta: (e.clientY - dragging.current.y) / 1000,
      }
    }
    const onUp = () => {
      if (dragging.current) {
        phiBase.current   += drag.current.phi
        thetaBase.current += drag.current.theta
        drag.current = { phi: 0, theta: 0 }
      }
      dragging.current = null
      if (canvasRef.current) canvasRef.current.style.cursor = "grab"
      paused.current = false
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerup",   onUp,   { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup",   onUp)
    }
  }, [])

  useEffect(() => {
    const canvas  = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    let globe: ReturnType<typeof createGlobe> | null = null
    let raf: number
    let phi = 0

    canvas.style.opacity = "0"

    const darkCfg  = { dark: 1, diffuse: 1.8, mapBrightness: 5,  baseColor: [0.10, 0.18, 0.45] as [number,number,number], markerColor: [0.28, 0.62, 1.00] as [number,number,number], glowColor: [0.12, 0.28, 0.78] as [number,number,number] }
    const lightCfg = { dark: 0, diffuse: 1.5, mapBrightness: 10, baseColor: [0.88, 0.92, 0.98] as [number,number,number], markerColor: [0.06, 0.28, 0.80] as [number,number,number], glowColor: [0.80, 0.88, 1.00] as [number,number,number] }
    const cfg = darkMode ? darkCfg : lightCfg

    function updateCards(currentPhi: number, currentTheta: number) {
      const w = canvas!.offsetWidth
      if (w === 0) return

      MARKERS.forEach(m => {
        const card = cardRefs.current.get(m.id)
        if (!card) return

        const { x, y, visible, depth } = projectMarker(
          m.location[0], m.location[1], currentPhi, currentTheta
        )

        // Convert normalised coords to px (card centred above dot)
        const sx = ((x + 1) / 2) * w
        const sy = ((1 - y) / 2) * w

        // Depth-based subtle scale (front = larger, back = smaller edge fade)
        const scale = visible ? 0.88 + 0.12 * depth : 0.8

        card.style.transform  = `translate(-50%, calc(-100% - 14px)) scale(${scale.toFixed(3)})`
        card.style.left       = `${sx.toFixed(1)}px`
        card.style.top        = `${sy.toFixed(1)}px`
        card.style.opacity    = visible ? String(Math.min(1, (depth - 0.08) * 8)) : "0"
        card.style.pointerEvents = visible ? "none" : "none"
      })
    }

    function init() {
      const w = canvas!.offsetWidth
      if (!w || globe) return

      globe = createGlobe(canvas!, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: w, height: w,
        phi: 0, theta: 0.25,
        mapSamples: 16000,
        markerElevation: 0.01,
        markers: MARKERS.map(m => ({ location: m.location, size: 0.05 })),
        arcs: [], arcColor: [0.3, 0.6, 1.0] as [number,number,number],
        arcWidth: 0.5, arcHeight: 0.25, opacity: 0.85,
        ...cfg,
      })

      function tick() {
        if (!paused.current) phi += speed

        const currentPhi   = phi + phiBase.current + drag.current.phi
        const currentTheta = 0.25 + thetaBase.current + drag.current.theta

        globe!.update({ phi: currentPhi, theta: currentTheta })
        updateCards(currentPhi, currentTheta)

        raf = requestAnimationFrame(tick)
      }
      tick()
      setTimeout(() => { if (canvas) canvas.style.opacity = "1" })
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver(entries => {
        if (entries[0]?.contentRect.width > 0) { ro.disconnect(); init() }
      })
      ro.observe(canvas)
    }

    return () => {
      if (raf)   cancelAnimationFrame(raf)
      if (globe) globe.destroy()
      globe = null
    }
  }, [speed, darkMode])

  // Card style tokens derived from darkMode
  const cardBg     = darkMode ? "rgba(8,8,20,0.90)"  : "rgba(255,255,255,0.95)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)"
  const cardShadow = darkMode ? "0 8px 28px rgba(0,0,0,0.55)" : "0 8px 28px rgba(0,0,0,0.10)"
  const nameColor  = darkMode ? "#ffffff" : "#111827"
  const metaColor  = darkMode ? "rgba(255,255,255,0.48)" : "#6b7280"

  return (
    <div ref={wrapperRef} className={`relative aspect-square select-none ${className}`}>
      <style>{`
        .mv-card {
          position: absolute;
          pointer-events: none;
          transition: opacity 0.35s ease, filter 0.35s ease, transform 0.35s ease;
          will-change: transform, opacity;
          white-space: nowrap;
        }
      `}</style>

      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        style={{
          width: "100%", height: "100%",
          cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%", touchAction: "none",
          display: "block",
        }}
      />

      {/* User cards — positioned in tick() via DOM refs */}
      {MARKERS.map(m => (
        <div
          key={m.id}
          className="mv-card"
          ref={el => {
            if (el) cardRefs.current.set(m.id, el)
            else cardRefs.current.delete(m.id)
          }}
          style={{ opacity: 0, left: "50%", top: "50%", transform: "translate(-50%,-100%)" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px 6px 6px",
              borderRadius: 12,
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: cardShadow,
              backdropFilter: "blur(14px)",
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: m.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: "#fff",
              flexShrink: 0,
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}>
              {m.initials}
            </div>
            {/* Info */}
            <div>
              <div style={{
                fontSize: 12, fontWeight: 600, lineHeight: 1.3,
                color: nameColor,
                fontFamily: "var(--font-inter), Inter, sans-serif",
              }}>
                {m.name}
              </div>
              <div style={{
                fontSize: 10, lineHeight: 1.3,
                color: metaColor,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <span style={{ color: "#f59e0b" }}>★★★★★</span>
                <span>{m.city}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
