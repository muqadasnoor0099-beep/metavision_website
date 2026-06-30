'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number; y: number
  ox: number; oy: number
  vx: number; vy: number
  size: number
  color: string
}

interface BgParticle {
  x: number; y: number
  vx: number; vy: number
  size: number; alpha: number; phase: number
}

const DENSITY      = 0.00020
const BG_DENSITY   = 0.00008
const MOUSE_R      = 190
const RETURN_SPEED = 0.08
const DAMPING      = 0.90
const REPULSION    = 1.3
const LINK_DIST    = 100

function rnd(a: number, b: number) { return Math.random() * (b - a) + a }

export default function ParticleEffectForHero({ dark = true }: { dark?: boolean }) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const wrapRef      = useRef<HTMLDivElement>(null)
  const partsRef     = useRef<Particle[]>([])
  const bgRef        = useRef<BgParticle[]>([])
  const mouseRef     = useRef({ x: -9999, y: -9999, active: false })
  const rafRef       = useRef(0)
  const lastTRef     = useRef(0)

  const COLORS = dark
    ? ['#ffffff', '#ffffff', '#ffffff', '#2563eb', '#00bfff', '#93c5fd']
    : ['#1e3a8a', '#1e3a8a', '#2563eb', '#0ea5e9', '#1e40af']

  const init = useCallback((W: number, H: number) => {
    const n = Math.floor(W * H * DENSITY)
    partsRef.current = Array.from({ length: n }, () => {
      const x = Math.random() * W, y = Math.random() * H
      return {
        x, y, ox: x, oy: y,
        vx: (Math.random() - .5) * 1.5,
        vy: (Math.random() - .5) * 1.5,
        size: rnd(.9, 2.5),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }
    })

    const bn = Math.floor(W * H * BG_DENSITY)
    bgRef.current = Array.from({ length: bn }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
      size: rnd(.4, 1.4),
      alpha: rnd(.20, .55),
      phase: Math.random() * Math.PI * 2,
    }))
  }, [dark]) // eslint-disable-line react-hooks/exhaustive-deps

  const animate = useCallback((t: number) => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const W = cv.width / (window.devicePixelRatio || 1)
    const H = cv.height / (window.devicePixelRatio || 1)

    lastTRef.current = t
    ctx.clearRect(0, 0, W, H)

    // 1. Radial glow
    const pulse = Math.sin(t * .0007) * .05 + (dark ? .14 : .10)
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * .72)
    g.addColorStop(0, dark ? `rgba(37,99,235,${pulse})` : `rgba(37,99,235,${pulse * .7})`)
    g.addColorStop(.45, dark ? `rgba(0,80,200,${pulse * .45})` : `rgba(37,99,235,${pulse * .3})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    // 2. Drifting bg stars
    ctx.fillStyle = dark ? '#ffffff' : '#1e3a8a'
    for (const p of bgRef.current) {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
      const tw = Math.sin(t * .0018 + p.phase) * .5 + .5
      ctx.globalAlpha = p.alpha * (.25 + .75 * tw)
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1

    const parts = partsRef.current
    const mouse = mouseRef.current

    // 3. Mouse repulsion + spring
    for (const p of parts) {
      const dx = mouse.x - p.x, dy = mouse.y - p.y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (mouse.active && d < MOUSE_R && d > .01) {
        const f = (MOUSE_R - d) / MOUSE_R
        p.vx -= (dx / d) * f * REPULSION * 5
        p.vy -= (dy / d) * f * REPULSION * 5
      }
      p.vx += (p.ox - p.x) * RETURN_SPEED
      p.vy += (p.oy - p.y) * RETURN_SPEED
    }

    // 4. Collision resolution
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i], b = parts[j]
        const dx = b.x - a.x, dy = b.y - a.y
        const distSq = dx * dx + dy * dy
        const min = a.size + b.size
        if (distSq < min * min) {
          const d = Math.sqrt(distSq)
          if (d > .01) {
            const nx = dx / d, ny = dy / d
            const ov = min - d
            a.x -= nx * ov * .5; a.y -= ny * ov * .5
            b.x += nx * ov * .5; b.y += ny * ov * .5
            const dvx = a.vx - b.vx, dvy = a.vy - b.vy
            const vn = dvx * nx + dvy * ny
            if (vn > 0) {
              const imp = -(1 + .85) * vn / (1 / a.size + 1 / b.size)
              a.vx += imp * nx / a.size; a.vy += imp * ny / a.size
              b.vx -= imp * nx / b.size; b.vy -= imp * ny / b.size
            }
          }
        }
      }
    }

    // 5. Constellation lines
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i], b = parts[j]
        const dx = b.x - a.x, dy = b.y - a.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * (dark ? .32 : .22)
          const hasBlue = a.color !== '#ffffff' || b.color !== '#ffffff'
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = hasBlue
            ? `rgba(100,160,255,${alpha})`
            : dark ? `rgba(200,220,255,${alpha})` : `rgba(30,58,138,${alpha})`
          ctx.lineWidth = .8; ctx.stroke()
        }
      }
    }

    // 6. Integrate + draw particles
    for (const p of parts) {
      p.vx *= DAMPING; p.vy *= DAMPING
      p.x += p.vx;    p.y += p.vy
      const vel   = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
      const alpha = Math.min(.60 + vel * .15, 1)

      // Glow halo for blue particles
      if (p.color !== '#ffffff' && p.color !== '#1e3a8a') {
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5)
        gr.addColorStop(0, `${p.color}${Math.round(alpha * .45 * 255).toString(16).padStart(2, '0')}`)
        gr.addColorStop(1, 'transparent')
        ctx.fillStyle = gr
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2); ctx.fill()
      }

      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color === '#ffffff'
        ? `rgba(255,255,255,${alpha})`
        : p.color
      ctx.fill()
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [dark])

  useEffect(() => {
    const wrap = wrapRef.current
    const cv   = canvasRef.current
    if (!wrap || !cv) return

    const dpr = window.devicePixelRatio || 1
    const setup = () => {
      const { width, height } = wrap.getBoundingClientRect()
      cv.width  = width  * dpr
      cv.height = height * dpr
      cv.style.width  = `${width}px`
      cv.style.height = `${height}px`
      const ctx = cv.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
      init(width, height)
    }

    setup()
    rafRef.current = requestAnimationFrame(animate)

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current)
      const ctx = cv.getContext('2d')
      if (ctx) ctx.setTransform(1, 0, 0, 1, 0, 0)
      setup()
      rafRef.current = requestAnimationFrame(animate)
    })
    ro.observe(wrap)
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current) }
  }, [init, animate])

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = canvasRef.current?.getBoundingClientRect()
    if (!r) return
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true }
  }, [])

  const onLeave = useCallback(() => { mouseRef.current.active = false }, [])

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-0 overflow-hidden cursor-crosshair"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
