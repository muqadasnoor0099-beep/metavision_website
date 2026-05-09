'use client'

import { useEffect, useRef, useState } from 'react'

declare global { interface Window { Hands: any } }

// ── Brand ────────────────────────────────────────────────────────────────────
const C0 = '#2563eb'   // blue
const C1 = '#60a5fa'   // light blue
const C2 = '#22d3ee'   // cyan

const WORDS    = ['MEDICAL', 'VISION', 'AI', 'DIAGNOSE', 'FINANCE', 'INSIGHT']
const WORD_LABELS = WORDS

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src; s.crossOrigin = 'anonymous'
    s.onload = () => resolve(); s.onerror = reject
    document.head.appendChild(s)
  })
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function GestureFXSection() {
  const containerRef   = useRef<HTMLDivElement>(null)
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const videoRef       = useRef<HTMLVideoElement>(null)
  const [activeIdx,    setActiveIdx]    = useState(0)
  const [handCount,    setHandCount]    = useState(0)
  const [ptCount,      setPtCount]      = useState(0)
  const [camStatus,    setCamStatus]    = useState<'idle'|'asking'|'active'|'denied'>('idle')
  const [tip,          setTip]          = useState('')
  const [tipVisible,   setTipVisible]   = useState(false)

  // Active word ref so the canvas closure can read latest without re-creating loop
  const activeWordRef  = useRef(WORDS[0])
  const startCamRef    = useRef<() => void>(() => {})

  useEffect(() => {
    const container = containerRef.current
    const canvas    = canvasRef.current
    const video     = videoRef.current
    if (!canvas || !container || !video) return

    const ctx = canvas.getContext('2d')!
    let W = container.offsetWidth
    let H = container.offsetHeight
    let t = 0
    let rafId = 0
    let stopped = false

    // ── resize ────────────────────────────────────────────────────────────
    function resize() {
      W = container!.offsetWidth
      H = container!.offsetHeight
      canvas!.width  = W
      canvas!.height = H
      buildTargets(activeWordRef.current)
      rebuildParticles()
    }
    window.addEventListener('resize', resize)
    resize()

    // ── Particle types ────────────────────────────────────────────────────
    interface Pt { x: number; y: number; tx: number; ty: number
                   vx: number; vy: number; size: number; alpha: number
                   noise: number; ns: number; colorIdx: number }

    let particles: Pt[]  = []
    let targets: {x:number;y:number}[] = []
    let handLandmarks: any[] = []
    let transitioning = false
    let lastHandTime  = 0

    // ── buildTargets ──────────────────────────────────────────────────────
    function buildTargets(word: string) {
      const off = document.createElement('canvas')
      off.width = W; off.height = H
      const oc  = off.getContext('2d')!
      const fs  = Math.min(W * 0.26, H * 0.36, 260)
      oc.font        = `900 ${fs}px "Space Grotesk","Arial Black",sans-serif`
      oc.fillStyle   = '#fff'
      oc.textAlign   = 'center'
      oc.textBaseline= 'middle'
      oc.fillText(word, W / 2, H / 2)
      const step = Math.max(5, Math.floor(W / 210))
      const raw: {x:number;y:number}[] = []
      const img = oc.getImageData(0, 0, W, H)
      for (let y = 0; y < H; y += step)
        for (let x = 0; x < W; x += step)
          if (img.data[(y * W + x) * 4 + 3] > 100) raw.push({ x, y })
      // Fisher-Yates shuffle
      for (let i = raw.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[raw[i], raw[j]] = [raw[j], raw[i]]
      }
      targets = raw
    }

    // ── rebuildParticles ──────────────────────────────────────────────────
    function rebuildParticles() {
      const count = Math.min(1800, Math.max(targets.length || 600, 600))
      if (!particles.length) {
        particles = Array.from({ length: count }, (_, i) => ({
          x: Math.random() * W, y: Math.random() * H,
          tx: targets[i % targets.length]?.x ?? W/2,
          ty: targets[i % targets.length]?.y ?? H/2,
          vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4,
          size: 1.4 + Math.random()*1.8,
          alpha: 0.6 + Math.random()*0.4,
          noise: Math.random()*Math.PI*2,
          ns: 0.012 + Math.random()*0.016,
          colorIdx: Math.random() < 0.6 ? 0 : Math.random() < 0.5 ? 1 : 2,
        }))
      } else {
        while (particles.length > count) particles.pop()
        while (particles.length < count) particles.push({
          x: Math.random()*W, y: Math.random()*H,
          tx: W/2, ty: H/2,
          vx: 0, vy: 0, size: 1.4+Math.random()*1.8,
          alpha: 0.6+Math.random()*0.4,
          noise: Math.random()*Math.PI*2,
          ns: 0.012+Math.random()*0.016,
          colorIdx: Math.random()<0.6?0:Math.random()<0.5?1:2,
        })
        particles.forEach((p, i) => {
          p.tx = targets[i % targets.length]?.x ?? W/2
          p.ty = targets[i % targets.length]?.y ?? H/2
        })
      }
      setPtCount(count)
    }

    // ── updateParticle ────────────────────────────────────────────────────
    function updateParticle(p: Pt) {
      const dx = p.tx - p.x, dy = p.ty - p.y
      p.vx += dx * 0.055; p.vy += dy * 0.055
      p.noise += p.ns
      p.vx += Math.cos(p.noise) * 0.28
      p.vy += Math.sin(p.noise) * 0.28
      // hand repulsion
      for (let h = 0; h < handLandmarks.length; h++) {
        const hand = handLandmarks[h]
        for (let l = 0; l < hand.length; l += 2) {
          const lm = hand[l]
          const hx = (1 - lm.x) * W, hy = lm.y * H
          const ddx = p.x - hx, ddy = p.y - hy
          const dist = Math.sqrt(ddx*ddx + ddy*ddy)
          const R = 140
          if (dist < R && dist > 0.001) {
            const f = ((R - dist) / R) * 15
            p.vx += (ddx / dist) * f; p.vy += (ddy / dist) * f
          }
        }
      }
      p.vx *= 0.86; p.vy *= 0.86
      p.x = Math.max(0, Math.min(W, p.x + p.vx))
      p.y = Math.max(0, Math.min(H, p.y + p.vy))
    }

    // ── drawParticle ──────────────────────────────────────────────────────
    function drawParticle(p: Pt) {
      const spd = Math.sqrt(p.vx*p.vx + p.vy*p.vy)
      const fast = spd > 3.5
      const sz   = p.size * (fast ? 1.4 : 1)
      const colors = [C0, C1, C2]
      const col = colors[p.colorIdx]
      if (fast) {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5)
        ctx.strokeStyle = col.replace(')', `,${Math.min(p.alpha * 0.38, 0.38)})`
          .replace('rgb', 'rgba').replace('#', '')
        // simple trail with globalAlpha
        ctx.globalAlpha = Math.min(p.alpha * 0.38, 0.38)
        ctx.lineWidth   = sz * 0.6
        ctx.stroke()
      }
      ctx.globalAlpha = p.alpha
      ctx.fillStyle   = col
      ctx.beginPath()
      ctx.arc(p.x, p.y, sz, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    // ── switchWord ────────────────────────────────────────────────────────
    function switchWord(word: string, idx: number) {
      if (transitioning || word === activeWordRef.current) return
      transitioning = true
      activeWordRef.current = word
      setActiveIdx(idx)
      particles.forEach(p => {
        p.vx += (Math.random()-0.5)*10
        p.vy += (Math.random()-0.5)*10
      })
      setTimeout(() => {
        buildTargets(word)
        rebuildParticles()
        transitioning = false
      }, 350)
    }

    // ── drawHands ─────────────────────────────────────────────────────────
    const CONNECTIONS = [
      [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],
      [5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],
      [13,17],[17,18],[18,19],[19,20],[0,17],
    ]
    function drawHands() {
      if (!handLandmarks.length) return
      handLandmarks.forEach(hand => {
        // lines
        ctx.strokeStyle = `rgba(37,99,235,0.3)`
        ctx.lineWidth = 1
        CONNECTIONS.forEach(([a,b]) => {
          const la = hand[a], lb = hand[b]
          ctx.beginPath()
          ctx.moveTo((1-la.x)*W, la.y*H)
          ctx.lineTo((1-lb.x)*W, lb.y*H)
          ctx.stroke()
        })
        // joint dots
        ;[0,4,8,12,16,20].forEach((idx, i) => {
          const lm = hand[idx]
          const hx = (1-lm.x)*W, hy = lm.y*H
          const pulse = 1 + 0.12 * Math.sin(t * 0.07 + i * 0.9)
          const r = 5 * pulse
          // glow ring
          ctx.globalAlpha = 0.12
          ctx.strokeStyle = C0; ctx.lineWidth = 7
          ctx.beginPath(); ctx.arc(hx, hy, r+5, 0, Math.PI*2); ctx.stroke()
          // inner ring
          ctx.globalAlpha = 0.9
          ctx.strokeStyle = idx===0 ? C2 : C0; ctx.lineWidth = 1.5
          ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI*2); ctx.stroke()
          // dot
          ctx.globalAlpha = 1
          ctx.fillStyle = idx===0 ? C2 : C1
          ctx.beginPath(); ctx.arc(hx, hy, 3, 0, Math.PI*2); ctx.fill()
        })
        ctx.globalAlpha = 1
      })
    }

    // ── ambient dots ──────────────────────────────────────────────────────
    const ambient = Array.from({ length: 40 }, () => ({
      x: Math.random()*1920, y: Math.random()*1080,
      vx: (Math.random()-0.5)*0.0007*1920,
      vy: (Math.random()-0.5)*0.0007*1080,
      r: 0.3+Math.random()*1.1,
      a: 0.02+Math.random()*0.07,
    }))
    function drawAmbient() {
      ambient.forEach(d => {
        d.x = ((d.x + d.vx) + W) % W
        d.y = ((d.y + d.vy) + H) % H
        ctx.globalAlpha = d.a
        ctx.fillStyle   = C0
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI*2); ctx.fill()
      })
      ctx.globalAlpha = 1
    }

    // ── scanline corners ──────────────────────────────────────────────────
    function drawCorners() {
      const arm = 50, lw = 1.5, col = `rgba(37,99,235,0.18)`
      ctx.strokeStyle = col; ctx.lineWidth = lw
      ;[[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(([cx,cy,sx,sy]) => {
        ctx.beginPath()
        ctx.moveTo(cx as number + (sx as number)*arm, cy as number)
        ctx.lineTo(cx as number, cy as number)
        ctx.lineTo(cx as number, cy as number + (sy as number)*arm)
        ctx.stroke()
      })
    }

    // ── render loop ───────────────────────────────────────────────────────
    function render() {
      if (stopped) return
      t++

      // bg
      ctx.fillStyle = 'rgba(0,0,0,0.06)'
      ctx.fillRect(0, 0, W, H)

      drawAmbient()
      drawCorners()

      // particles
      particles.forEach(p => { updateParticle(p); drawParticle(p) })

      drawHands()
      ctx.globalAlpha = 1

      rafId = requestAnimationFrame(render)
    }

    // ── Camera ────────────────────────────────────────────────────────────
    let mpReady   = false
    let mpHands: any = null
    let statusHidden = false

    async function startCamera() {
      setCamStatus('asking')
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        video.muted = true
        video.playsInline = true
        video.setAttribute('playsinline', '')
        video.setAttribute('webkit-playsinline', '')
        video.setAttribute('autoplay', '')
        video.srcObject = stream
        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => resolve()
          setTimeout(resolve, 3000)
        })
        try { await video.play() } catch(_) {}
        setCamStatus('active')
        initMP()
      } catch (e: any) {
        setCamStatus('denied')
      }
    }

    startCamRef.current = startCamera

    // ── MediaPipe ─────────────────────────────────────────────────────────
    async function initMP() {
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')
        const h = new window.Hands({
          locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
        })
        h.setOptions({
          maxNumHands: 2, modelComplexity: 0,
          minDetectionConfidence: 0.65, minTrackingConfidence: 0.55,
        })
        h.onResults((r: any) => {
          handLandmarks = r.multiHandLandmarks || []
          setHandCount(handLandmarks.length)
          if (handLandmarks.length) lastHandTime = Date.now()
        })
        await h.initialize()
        mpHands = h; mpReady = true
        pumpFrames()
      } catch(_) {}
    }

    let pumping = false
    function pumpFrames() {
      if (!mpReady || pumping) return
      pumping = true
      const loop = async () => {
        if (stopped) return
        if (video.readyState >= 2 && !video.paused && mpHands) {
          try { await mpHands.send({ image: video }) } catch(_) {}
        }
        setTimeout(loop, 50)
      }
      loop()
    }

    // ── Auto-cycle words ──────────────────────────────────────────────────
    let wIdx = 0
    const autoCycle = setInterval(() => {
      if (Date.now() - lastHandTime < 5000) return
      wIdx = (wIdx + 1) % WORDS.length
      switchWord(WORDS[wIdx], wIdx)
    }, 4000)

    // ── boot ──────────────────────────────────────────────────────────────
    render()

    // ── tips ──────────────────────────────────────────────────────────────
    const TIPS = [
      '✋ Raise both hands to scatter particles',
      '👌 Push slowly — particles resist your hands',
      '🎯 Switch words using the buttons below',
      '🤖 Air Mouse: powered by MediaPipe AI',
    ]
    let tipIdx = 0
    const showTip = () => {
      setTip(TIPS[tipIdx % TIPS.length])
      setTipVisible(true)
      tipIdx++
      setTimeout(() => setTipVisible(false), 3000)
    }
    const tipTimer = setInterval(showTip, 6000)
    const tipStart  = setTimeout(showTip, 5000)

    // ── expose switchWord to React ────────────────────────────────────────
    ;(window as any).__gfxSwitch = (word: string, idx: number) => switchWord(word, idx)

    return () => {
      stopped = true
      cancelAnimationFrame(rafId)
      clearInterval(autoCycle)
      clearInterval(tipTimer)
      clearTimeout(tipStart)
      window.removeEventListener('resize', resize)
      if (video.srcObject) (video.srcObject as MediaStream).getTracks().forEach(t => t.stop())
      delete (window as any).__gfxSwitch
    }
  }, [])

  const handleWordClick = (word: string, idx: number) => {
    ;(window as any).__gfxSwitch?.(word, idx)
  }

  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
        cursor: 'none',
      }}
    >
      {/* Hidden video for MediaPipe */}
      <video
        ref={videoRef}
        autoPlay muted playsInline
        style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.82) 100%)',
      }} />

      {/* Color grade */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', mixBlendMode: 'screen',
        background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(0,0,0,0) 50%, rgba(34,211,238,0.05) 100%)',
      }} />

      {/* ── UI Layer ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>

        {/* Top-left: MetaVision badge */}
        <div style={{
          position: 'absolute', top: 22, left: 24,
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'gfx-fade 1s ease 0.5s both',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#2563eb,#60a5fa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 900, color: '#fff', fontFamily: 'Space Grotesk',
            boxShadow: '0 0 20px rgba(37,99,235,0.5)',
          }}>MV</div>
          <span style={{
            fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 13,
            letterSpacing: '2.5px', textTransform: 'uppercase',
            background: 'linear-gradient(90deg,#60a5fa,#22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>MetaVision</span>
        </div>

        {/* Top-right: badge */}
        <div style={{
          position: 'absolute', top: 22, right: 24,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(37,99,235,0.45)', borderRadius: 8,
          padding: '6px 14px',
          fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 700,
          color: '#60a5fa', letterSpacing: '1.5px', textTransform: 'uppercase',
          animation: 'gfx-fade 1s ease 0.8s both',
        }}>
          AI · Healthcare · Finance
        </div>

        {/* Top-center: mode pill */}
        <div style={{
          position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(37,99,235,0.35)', borderRadius: 999,
          padding: '5px 16px',
          fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 700,
          color: 'rgba(96,165,250,0.9)', letterSpacing: '2px',
          animation: 'gfx-fade 1s ease 1s both',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee', display: 'inline-block' }} />
          GESTURE ACTIVE
        </div>

        {/* Camera start button (visible before active) */}
        {camStatus === 'idle' && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
            pointerEvents: 'all',
          }}>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Enable hand tracking to interact
            </p>
            <button
              onClick={() => startCamRef.current()}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg,#2563eb,#60a5fa)',
                border: 'none', borderRadius: 999,
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14,
                color: '#fff', cursor: 'pointer',
                boxShadow: '0 0 30px rgba(37,99,235,0.5)',
                letterSpacing: '1px',
              }}
            >
              ✋ Enable Camera
            </button>
          </div>
        )}

        {camStatus === 'asking' && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)', textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: '#60a5fa', letterSpacing: '2px', animation: 'gfx-pulse 1.4s infinite' }}>
              Initializing camera...
            </p>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
              Allow camera access when prompted
            </p>
          </div>
        )}

        {camStatus === 'denied' && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)', textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: '#ef4444', letterSpacing: '2px' }}>⚠ Camera access denied</p>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
              Particles still move — enable camera for hand control
            </p>
          </div>
        )}

        {/* Tip toast */}
        <div style={{
          position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(37,99,235,0.25)', borderRadius: 999,
          padding: '7px 18px',
          fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(255,255,255,0.65)',
          opacity: tipVisible ? 1 : 0,
          transition: 'opacity 0.6s',
          whiteSpace: 'nowrap',
        }}>
          {tip}
        </div>

        {/* HUD bottom-left */}
        <div style={{
          position: 'absolute', bottom: 110, left: 24,
          fontFamily: 'Space Grotesk', fontSize: 11,
          color: 'rgba(255,255,255,0.35)', lineHeight: 1.9,
          letterSpacing: '1px',
          animation: 'gfx-fade 1s ease 1.5s both',
        }}>
          <div>PARTICLES <span style={{ color: '#60a5fa' }}>{ptCount}</span></div>
          <div>HANDS <span style={{ color: '#22d3ee' }}>{handCount}</span></div>
          <div>ACCURACY <span style={{ color: '#60a5fa' }}>97.4%</span></div>
          <div>AI MODEL <span style={{ color: '#60a5fa' }}>MediaPipe</span></div>
        </div>

        {/* Stats bottom-right */}
        <div style={{
          position: 'absolute', bottom: 110, right: 24,
          display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end',
          animation: 'gfx-fade 1s ease 1.5s both',
        }}>
          {[
            ['500+', 'Clinics Onboarded'],
            ['2M+',  'Consultations'],
            ['98%',  'Uptime SLA'],
          ].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 20,
                background: 'linear-gradient(90deg,#60a5fa,#22d3ee)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{n}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '1px' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Tagline bottom-center */}
        <div style={{
          position: 'absolute', bottom: 72, left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center',
          animation: 'gfx-fade 1s ease 1.8s both',
        }}>
          <div style={{
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13,
            letterSpacing: '5px', color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
          }}>
            See · Diagnose · Transform
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'rgba(96,165,250,0.5)', marginTop: 4, letterSpacing: '2px' }}>
            metavision.pk · AI for Healthcare & Finance
          </div>
        </div>

        {/* Word switcher */}
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 8, pointerEvents: 'all',
          animation: 'gfx-fade 1s ease 2s both',
        }}>
          {WORD_LABELS.map((w, i) => (
            <button
              key={w}
              onClick={() => handleWordClick(w, i)}
              style={{
                padding: '6px 12px',
                background: activeIdx === i ? 'rgba(37,99,235,0.25)' : 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(10px)',
                border: activeIdx === i ? '1px solid rgba(96,165,250,0.9)' : '1px solid rgba(37,99,235,0.3)',
                borderRadius: 3,
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 10,
                color: activeIdx === i ? '#60a5fa' : 'rgba(96,165,250,0.6)',
                letterSpacing: '2px', textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: activeIdx === i ? '0 0 16px rgba(37,99,235,0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* keyframes injected */}
      <style>{`
        @keyframes gfx-fade { from { opacity:0 } to { opacity:1 } }
        @keyframes gfx-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>
    </section>
  )
}
