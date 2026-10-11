'use client'

import { useEffect, useRef } from 'react'

export default function ParticleSphereAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const COUNT = 240
    const pts = Array.from({ length: COUNT }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      return {
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
      }
    })

    let angle = 0
    let rafId: number

    const frame = () => {
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2
      const r = Math.min(w, h) * 0.44

      ctx.clearRect(0, 0, w, h)
      angle += 0.004

      const cosA = Math.cos(angle * 0.7)
      const sinA = Math.sin(angle * 0.7)
      const cosB = Math.cos(angle * 0.25)
      const sinB = Math.sin(angle * 0.25)

      const proj = pts.map(p => {
        const x1 = p.x * cosA + p.z * sinA
        const z1 = -p.x * sinA + p.z * cosA
        const y1 = p.y * cosB - z1 * sinB
        const z2 = p.y * sinB + z1 * cosB
        const scale = 1 / (1.9 - z2 * 0.55)
        return { sx: cx + x1 * r * scale, sy: cy + y1 * r * scale, z: z2 }
      })

      proj.sort((a, b) => a.z - b.z)

      proj.forEach(({ sx, sy, z }) => {
        const t = (z + 1) / 2
        const size = 0.7 + t * 2.4
        const alpha = 0.12 + t * 0.72
        ctx.beginPath()
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(96,165,250,${alpha.toFixed(2)})`
        ctx.fill()
      })

      rafId = requestAnimationFrame(frame)
    }

    const sync = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const ro = new ResizeObserver(sync)
    ro.observe(canvas)
    sync()
    frame()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}
