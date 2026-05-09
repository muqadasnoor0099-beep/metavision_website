'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, X, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

declare global {
  interface Window { Hands: any; Camera: any }
}

type Status  = 'idle' | 'loading' | 'ready' | 'error'
type Gesture = 'move' | 'click' | 'scroll' | 'none'

// ── Tuning ────────────────────────────────────────────────────────────────────
const PINCH_DIST     = 0.07   // normalised thumb↔index distance = pinch
const CLICK_COOLDOWN = 700    // ms before next click can fire
const SMOOTH         = 0.20   // cursor EMA — lower = smoother, laggier
const SCROLL_DEAD    = 0.008  // ignore wrist movement smaller than this
const SCROLL_SCALE   = 500    // wrist-y delta × this = scroll pixels

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src; s.crossOrigin = 'anonymous'
    s.onload = () => resolve(); s.onerror = reject
    document.head.appendChild(s)
  })
}

const GESTURES = [
  { emoji: '☝️', name: 'Move Cursor', desc: 'Raise only your index finger — cursor follows the tip' },
  { emoji: '👌', name: 'Click',       desc: 'Pinch thumb + index together once — fires immediately' },
  { emoji: '✌️', name: 'Scroll',      desc: 'Peace sign (index + middle up) then move hand up/down' },
  { emoji: '✊', name: 'Freeze',      desc: 'Make a fist — cursor stops moving' },
]

export default function AirMouse() {
  const [status,    setStatus]    = useState<Status>('idle')
  const [gesture,   setGesture]   = useState<Gesture>('none')
  const [guideOpen, setGuideOpen] = useState(true)
  const [errorMsg,  setErrorMsg]  = useState('')

  // cursor is a plain div — Framer Motion must NOT control opacity/transform
  const cursorRef    = useRef<HTMLDivElement>(null)
  const ringRef      = useRef<HTMLDivElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const handsRef     = useRef<any>(null)
  const cameraRef    = useRef<any>(null)

  const smoothX      = useRef(0)
  const smoothY      = useRef(0)
  const pinching     = useRef(false)
  const lastClick    = useRef(0)
  const prevWristY   = useRef<number | null>(null)
  const smoothWristY = useRef<number | null>(null)
  const gestureRef   = useRef<Gesture>('none')

  const isActive = status === 'ready'

  // ── Cleanup ────────────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    cameraRef.current?.stop()
    handsRef.current?.close()
    cameraRef.current = null
    handsRef.current  = null
    pinching.current  = false
    prevWristY.current    = null
    smoothWristY.current  = null
    gestureRef.current    = 'none'
    if (cursorRef.current) cursorRef.current.style.opacity = '0'
    setStatus('idle')
    setGesture('none')
  }, [])

  useEffect(() => () => cleanup(), [cleanup])

  // ── Per-frame results ──────────────────────────────────────────────────────
  const onResults = useCallback((results: any) => {
    const cursor = cursorRef.current
    const ring   = ringRef.current
    if (!cursor || !ring) return

    if (!results.multiHandLandmarks?.length) {
      cursor.style.opacity = '0'
      prevWristY.current   = null
      smoothWristY.current = null
      return
    }

    const lm = results.multiHandLandmarks[0]

    // ── 1. Cursor position: index fingertip (lm 8), mirror X ────────────────
    const rawX = (1 - lm[8].x) * window.innerWidth
    const rawY = lm[8].y       * window.innerHeight
    smoothX.current += (rawX - smoothX.current) * SMOOTH
    smoothY.current += (rawY - smoothY.current) * SMOOTH

    cursor.style.opacity   = '1'
    cursor.style.transform = `translate(${smoothX.current - 16}px, ${smoothY.current - 16}px)`

    // ── 2. Finger extended: tip.y < pip.y in image space ────────────────────
    const up = (tip: number, pip: number) => lm[tip].y < lm[pip].y

    const indexUp  = up(8,  6)
    const middleUp = up(12, 10)
    const ringDown = !up(16, 14)
    const pinkyDown= !up(20, 18)

    // ── 3. Gesture detection ─────────────────────────────────────────────────
    const dist      = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y)
    const isPinch   = dist < PINCH_DIST
    const isPeace   = indexUp && middleUp && ringDown && pinkyDown && !isPinch

    // ── 4. SCROLL (peace sign) ───────────────────────────────────────────────
    if (isPeace) {
      // smooth the wrist Y to remove jitter
      const wy = lm[0].y
      if (smoothWristY.current === null) {
        smoothWristY.current = wy
      } else {
        smoothWristY.current += (wy - smoothWristY.current) * 0.35
      }

      if (prevWristY.current !== null) {
        const delta = (smoothWristY.current ?? 0) - prevWristY.current
        if (Math.abs(delta) > SCROLL_DEAD) {
          window.scrollBy(0, delta * SCROLL_SCALE)
        }
      }
      prevWristY.current = smoothWristY.current

      if (gestureRef.current !== 'scroll') {
        gestureRef.current = 'scroll'
        setGesture('scroll')
        ring.style.borderColor = '#22d3ee'
        ring.style.width  = '42px'
        ring.style.height = '42px'
        ring.style.marginLeft = '-5px'
        ring.style.marginTop  = '-5px'
      }
      pinching.current = false
      return
    }

    prevWristY.current    = null
    smoothWristY.current  = null

    // ── 5. CLICK (pinch on leading edge + cooldown) ─────────────────────────
    if (isPinch) {
      if (gestureRef.current !== 'click') {
        gestureRef.current = 'click'
        setGesture('click')
        ring.style.borderColor = '#60a5fa'
        ring.style.width  = '20px'
        ring.style.height = '20px'
        ring.style.marginLeft = '3px'
        ring.style.marginTop  = '3px'
      }

      if (!pinching.current) {
        pinching.current = true
        const now = Date.now()
        if (now - lastClick.current > CLICK_COOLDOWN) {
          lastClick.current = now
          const x = smoothX.current
          const y = smoothY.current
          // Find topmost non-cursor element
          cursor.style.pointerEvents = 'none'
          const el = document.elementFromPoint(x, y) as HTMLElement | null
          cursor.style.pointerEvents = 'none'
          if (el) {
            el.dispatchEvent(new MouseEvent('click', {
              bubbles: true, cancelable: true,
              clientX: x, clientY: y,
            }))
            // green flash
            ring.style.borderColor = '#10b981'
            setTimeout(() => {
              if (ring) ring.style.borderColor = '#60a5fa'
            }, 250)
          }
        }
      }
      return
    }

    // ── 6. MOVE ──────────────────────────────────────────────────────────────
    pinching.current = false
    if (gestureRef.current !== 'move') {
      gestureRef.current = 'move'
      setGesture('move')
      ring.style.borderColor = '#2563eb'
      ring.style.width  = '32px'
      ring.style.height = '32px'
      ring.style.marginLeft = '0px'
      ring.style.marginTop  = '0px'
    }
  }, [])

  // ── Activate ───────────────────────────────────────────────────────────────
  const activate = async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js')

      const hands = new window.Hands({
        locateFile: (f: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
      })
      hands.setOptions({
        maxNumHands:            1,
        modelComplexity:        1,
        minDetectionConfidence: 0.75,
        minTrackingConfidence:  0.6,
      })
      hands.onResults(onResults)
      handsRef.current = hands

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current)
            await handsRef.current.send({ image: videoRef.current })
        },
        width: 320, height: 240,
      })
      camera.start()
      cameraRef.current = camera

      smoothX.current = window.innerWidth  / 2
      smoothY.current = window.innerHeight / 2
      setStatus('ready')
    } catch (err: any) {
      setErrorMsg(
        err?.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera and try again.'
          : 'Could not start Air Mouse. Check your camera is connected.',
      )
      setStatus('error')
    }
  }

  const toggle = () => (isActive ? cleanup() : activate())

  const gestureLabel: Record<Gesture, string> = {
    move: 'Moving', click: 'Clicked!', scroll: 'Scrolling', none: '',
  }

  return (
    <>
      {/* ── Navbar button ──────────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        title={isActive ? 'Deactivate Air Mouse' : 'Activate Air Mouse'}
        className={`
          hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]
          font-bold border transition-all duration-300 tracking-wide select-none
          ${isActive
            ? 'bg-gold/10 border-gold/40 text-gold shadow-[0_0_12px_rgba(37,99,235,0.2)]'
            : 'border-white/15 text-white/50 hover:border-gold/30 hover:text-white/80'}
        `}
      >
        {status === 'loading'
          ? <Loader2 size={12} className="animate-spin" />
          : <Hand size={12} />}
        {isActive ? 'Air Mouse ON' : 'Air Mouse'}
        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-0.5" />}
      </button>

      {/* ── Hidden video for MediaPipe ─────────────────────────────────────── */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />

      {/* ── Custom cursor — plain div, NO framer motion controlling it ──────── */}
      {isActive && (
        <div
          ref={cursorRef}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: 32, height: 32,
            zIndex: 9999,
            pointerEvents: 'none',
            opacity: 0,              // starts hidden; onResults sets to 1
            willChange: 'transform',
          }}
        >
          <div
            ref={ringRef}
            style={{
              width: 32, height: 32,
              borderRadius: '50%',
              border: '2px solid #2563eb',
              boxShadow: '0 0 10px rgba(37,99,235,0.55)',
              transition: 'width .12s,height .12s,border-color .12s,margin .12s',
            }}
          />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 5, height: 5, borderRadius: '50%',
            background: '#60a5fa',
            boxShadow: '0 0 6px #60a5fa',
          }} />
        </div>
      )}

      {/* ── Bottom-right HUD ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {(isActive || status === 'error') && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', bottom: 20, right: 20,
              zIndex: 9997,
              display: 'flex', flexDirection: 'column',
              gap: 10, alignItems: 'flex-end',
            }}
          >
            {/* Error */}
            {status === 'error' && (
              <div style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.35)',
                borderRadius: 12, padding: '12px 14px',
                maxWidth: 270,
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{errorMsg}</p>
                <button onClick={() => setStatus('idle')} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                  <X size={13} />
                </button>
              </div>
            )}

            {isActive && (
              <>
                {/* Camera preview */}
                <div style={{
                  position: 'relative', borderRadius: 12, overflow: 'hidden',
                  border: '1px solid rgba(37,99,235,0.35)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  background: '#020c1b', width: 160,
                }}>
                  <video
                    autoPlay playsInline muted
                    style={{ width: 160, height: 120, display: 'block', transform: 'scaleX(-1)', objectFit: 'cover' }}
                    ref={(el) => {
                      if (el && videoRef.current?.srcObject)
                        el.srcObject = videoRef.current.srcObject
                    }}
                  />
                  {/* overlay */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top,rgba(0,0,0,0.7),transparent)',
                    padding: '8px 10px 6px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.1em' }}>LIVE</span>
                    {gesture !== 'none' && (
                      <span style={{ fontSize: 10, color: '#60a5fa', fontWeight: 700 }}>{gestureLabel[gesture]}</span>
                    )}
                  </div>
                  {/* recording dot */}
                  <div style={{
                    position: 'absolute', top: 7, left: 8,
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#ef4444', boxShadow: '0 0 6px #ef4444',
                  }} />
                  {/* close */}
                  <button
                    onClick={cleanup}
                    style={{
                      position: 'absolute', top: 5, right: 6,
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    <X size={9} color="rgba(255,255,255,0.7)" />
                  </button>
                </div>

                {/* Gesture guide */}
                <div style={{
                  background: 'rgba(2,12,27,0.94)',
                  border: '1px solid rgba(37,99,235,0.22)',
                  borderRadius: 12, overflow: 'hidden',
                  backdropFilter: 'blur(12px)', width: 220,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}>
                  <button
                    onClick={() => setGuideOpen(g => !g)}
                    style={{
                      width: '100%', padding: '9px 14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700, letterSpacing: '0.1em' }}>HOW TO USE</span>
                    {guideOpen
                      ? <ChevronDown size={13} color="rgba(255,255,255,0.4)" />
                      : <ChevronUp   size={13} color="rgba(255,255,255,0.4)" />}
                  </button>

                  <AnimatePresence>
                    {guideOpen && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        transition={{ duration: 0.18 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '6px 0 4px' }}>
                          {GESTURES.map((g) => (
                            <div key={g.name} style={{ display: 'flex', gap: 10, padding: '6px 14px', alignItems: 'flex-start' }}>
                              <span style={{ fontSize: 15, flexShrink: 0 }}>{g.emoji}</span>
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{g.name}</div>
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2, lineHeight: 1.5 }}>{g.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
