'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, X, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

// ── MediaPipe loaded via CDN — declare globals ────────────────────────────────
declare global {
  interface Window {
    Hands: any
    Camera: any
  }
}

type Status = 'idle' | 'loading' | 'ready' | 'error'
type Gesture = 'move' | 'click' | 'scroll' | 'none'

const PINCH_THRESHOLD  = 0.07   // normalised distance thumb↔index = click
const PINCH_HOLD_MS    = 280    // hold pinch this long to fire click
const SMOOTH           = 0.22   // EMA factor — lower = smoother but laggier
const SCROLL_SCALE     = 6      // multiplier for wrist-y → scroll pixels

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src
    s.crossOrigin = 'anonymous'
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

// ── Gesture guide data ────────────────────────────────────────────────────────
const GESTURES = [
  { emoji: '☝️', name: 'Move Cursor',  desc: 'Raise index finger — cursor follows your fingertip' },
  { emoji: '👌', name: 'Click',        desc: 'Pinch thumb + index together and hold 0.3 s' },
  { emoji: '✌️', name: 'Scroll',       desc: 'Raise index + middle (peace sign), move hand up/down' },
  { emoji: '✊', name: 'Pause',        desc: 'Close your fist to freeze the cursor' },
]

// ── Main component ────────────────────────────────────────────────────────────
export default function AirMouse() {
  const [status, setStatus]       = useState<Status>('idle')
  const [gesture, setGesture]     = useState<Gesture>('none')
  const [guideOpen, setGuideOpen] = useState(true)
  const [errorMsg, setErrorMsg]   = useState('')

  // DOM refs — manipulated directly for 60fps performance (no React state)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const cursorRef    = useRef<HTMLDivElement>(null)
  const ringRef      = useRef<HTMLDivElement>(null)

  // Logic refs
  const handsRef     = useRef<any>(null)
  const cameraRef    = useRef<any>(null)
  const smoothX      = useRef(0)
  const smoothY      = useRef(0)
  const pinching     = useRef(false)
  const pinchTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevWristY   = useRef<number | null>(null)
  const gestureRef   = useRef<Gesture>('none')

  const isActive = status === 'ready'

  // ── Cleanup ──────────────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    cameraRef.current?.stop()
    handsRef.current?.close()
    if (pinchTimer.current) clearTimeout(pinchTimer.current)
    cameraRef.current = null
    handsRef.current  = null
    setStatus('idle')
    setGesture('none')
    gestureRef.current = 'none'
    pinching.current   = false
    prevWristY.current = null
  }, [])

  useEffect(() => () => cleanup(), [cleanup])

  // ── MediaPipe results handler ─────────────────────────────────────────────
  const onResults = useCallback((results: any) => {
    const cursor = cursorRef.current
    const ring   = ringRef.current
    if (!cursor || !ring) return

    if (!results.multiHandLandmarks?.length) {
      cursor.style.opacity = '0'
      prevWristY.current = null
      return
    }

    const lm = results.multiHandLandmarks[0]

    // ── 1. Move cursor (index fingertip = landmark 8, mirrored X) ──────────
    const rawX = (1 - lm[8].x) * window.innerWidth
    const rawY = lm[8].y * window.innerHeight
    smoothX.current += (rawX - smoothX.current) * SMOOTH
    smoothY.current += (rawY - smoothY.current) * SMOOTH

    cursor.style.transform = `translate(${smoothX.current - 16}px, ${smoothY.current - 16}px)`
    cursor.style.opacity   = '1'

    // ── 2. Finger extended helpers ──────────────────────────────────────────
    const extended = (tip: number, pip: number) => lm[tip].y < lm[pip].y

    const indexUp  = extended(8,  6)
    const middleUp = extended(12, 10)
    const ringDown = !extended(16, 14)
    const pinkyDown= !extended(20, 18)

    // ── 3. Pinch detection (thumb tip 4 ↔ index tip 8) ─────────────────────
    const dist      = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y)
    const isPinching= dist < PINCH_THRESHOLD

    // ── 4. Scroll mode = peace sign (index + middle up, ring + pinky down) ──
    const isScroll  = indexUp && middleUp && ringDown && pinkyDown && !isPinching

    // ── 5. Handle scroll ────────────────────────────────────────────────────
    if (isScroll) {
      if (prevWristY.current !== null) {
        const delta = (lm[0].y - prevWristY.current) * window.innerHeight * SCROLL_SCALE
        window.scrollBy({ top: delta })
      }
      prevWristY.current = lm[0].y

      if (gestureRef.current !== 'scroll') {
        gestureRef.current = 'scroll'
        setGesture('scroll')
        ring.style.borderColor = '#22d3ee'
        ring.style.transform   = 'scale(1.6)'
      }
    } else {
      prevWristY.current = null
    }

    // ── 6. Handle click (pinch) ─────────────────────────────────────────────
    if (isPinching && !isScroll) {
      if (gestureRef.current !== 'click') {
        gestureRef.current = 'click'
        setGesture('click')
        ring.style.borderColor = '#60a5fa'
        ring.style.transform   = 'scale(0.6)'
      }

      if (!pinching.current) {
        pinching.current = true
        pinchTimer.current = setTimeout(() => {
          const x  = smoothX.current
          const y  = smoothY.current
          const el = document.elementFromPoint(x, y) as HTMLElement | null
          if (el) {
            el.dispatchEvent(new MouseEvent('click', {
              bubbles: true, cancelable: true, clientX: x, clientY: y,
            }))
            // Visual flash
            ring.style.borderColor = '#10b981'
            setTimeout(() => { ring.style.borderColor = '#60a5fa' }, 200)
          }
        }, PINCH_HOLD_MS)
      }
    } else {
      if (pinching.current) {
        pinching.current = false
        if (pinchTimer.current) { clearTimeout(pinchTimer.current); pinchTimer.current = null }
      }

      if (!isScroll) {
        if (gestureRef.current !== 'move') {
          gestureRef.current = 'move'
          setGesture('move')
          ring.style.borderColor = '#2563eb'
          ring.style.transform   = 'scale(1)'
        }
      }
    }
  }, [])

  // ── Activate ─────────────────────────────────────────────────────────────
  const activate = async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js')

      const hands = new window.Hands({
        locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
      })
      hands.setOptions({
        maxNumHands:           1,
        modelComplexity:       1,
        minDetectionConfidence: 0.72,
        minTrackingConfidence:  0.55,
      })
      hands.onResults(onResults)
      handsRef.current = hands

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current })
          }
        },
        width: 320, height: 240,
      })
      camera.start()
      cameraRef.current = camera

      // Init smooth pos to centre of screen
      smoothX.current = window.innerWidth  / 2
      smoothY.current = window.innerHeight / 2

      setStatus('ready')
    } catch (err: any) {
      const msg = err?.name === 'NotAllowedError'
        ? 'Camera permission denied. Allow camera access and try again.'
        : 'Could not start Air Mouse. Make sure your camera is connected.'
      setErrorMsg(msg)
      setStatus('error')
    }
  }

  const toggle = () => isActive ? cleanup() : activate()

  // ── Cursor ring colour label ──────────────────────────────────────────────
  const gestureLabel: Record<Gesture, string> = {
    move:   'Moving',
    click:  'Clicking…',
    scroll: 'Scrolling',
    none:   '',
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Navbar button ──────────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        title={isActive ? 'Deactivate Air Mouse' : 'Activate Air Mouse'}
        className={`
          hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold
          border transition-all duration-300 tracking-wide
          ${isActive
            ? 'bg-gold/10 border-gold/40 text-gold shadow-[0_0_12px_rgba(37,99,235,0.25)]'
            : 'border-white/15 text-white/50 hover:border-gold/30 hover:text-white/80'}
        `}
      >
        {status === 'loading'
          ? <Loader2 size={12} className="animate-spin" />
          : <Hand size={12} className={isActive ? 'text-gold' : ''} />
        }
        {isActive ? 'Air Mouse ON' : 'Air Mouse'}
        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        )}
      </button>

      {/* ── Hidden video element used by MediaPipe ──────────────────────────── */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
      />

      {/* ── Custom cursor ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            ref={cursorRef}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: 32, height: 32,
              zIndex: 9998,
              pointerEvents: 'none',
              opacity: 0,
            }}
          >
            {/* Outer ring */}
            <div
              ref={ringRef}
              style={{
                width: '100%', height: '100%',
                borderRadius: '50%',
                border: '2px solid #2563eb',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
                boxShadow: '0 0 12px rgba(37,99,235,0.5)',
              }}
            />
            {/* Centre dot */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 5, height: 5,
              borderRadius: '50%',
              background: '#60a5fa',
              boxShadow: '0 0 6px #60a5fa',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom-right HUD (camera preview + guide) ───────────────────────── */}
      <AnimatePresence>
        {(isActive || status === 'error') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 20, right: 20,
              zIndex: 9997,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              alignItems: 'flex-end',
            }}
          >
            {/* Error state */}
            {status === 'error' && (
              <div style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.35)',
                borderRadius: 12,
                padding: '12px 16px',
                maxWidth: 280,
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}>
                <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  {errorMsg}
                </p>
                <button onClick={() => setStatus('idle')} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                  <X size={13} />
                </button>
              </div>
            )}

            {isActive && (
              <>
                {/* Camera feed */}
                <div style={{
                  position: 'relative',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid rgba(37,99,235,0.35)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  background: '#020c1b',
                }}>
                  {/* Mirrored preview */}
                  <canvas
                    id="air-mouse-preview"
                    width={160} height={120}
                    style={{ display: 'block', transform: 'scaleX(-1)' }}
                  />
                  {/* Gesture label overlay */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    padding: '8px 10px 6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.1em' }}>
                      LIVE
                    </span>
                    {gesture !== 'none' && (
                      <span style={{ fontSize: 10, color: '#60a5fa', fontWeight: 700 }}>
                        {gestureLabel[gesture]}
                      </span>
                    )}
                  </div>
                  {/* Red dot */}
                  <div style={{
                    position: 'absolute', top: 7, left: 8,
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#ef4444', boxShadow: '0 0 6px #ef4444',
                  }} />
                  {/* Close */}
                  <button
                    onClick={cleanup}
                    style={{
                      position: 'absolute', top: 5, right: 6,
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.55)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    <X size={9} color="rgba(255,255,255,0.7)" />
                  </button>
                </div>

                {/* Gesture guide panel */}
                <div style={{
                  background: 'rgba(2,12,27,0.92)',
                  border: '1px solid rgba(37,99,235,0.25)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  backdropFilter: 'blur(12px)',
                  width: 220,
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
                    <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700, letterSpacing: '0.1em' }}>
                      HOW TO USE
                    </span>
                    {guideOpen
                      ? <ChevronDown size={13} color="rgba(255,255,255,0.4)" />
                      : <ChevronUp   size={13} color="rgba(255,255,255,0.4)" />}
                  </button>

                  <AnimatePresence>
                    {guideOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 0 4px' }}>
                          {GESTURES.map((g) => (
                            <div key={g.name} style={{
                              display: 'flex', gap: 10, padding: '7px 14px',
                              alignItems: 'flex-start',
                            }}>
                              <span style={{ fontSize: 16, flexShrink: 0 }}>{g.emoji}</span>
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                                  {g.name}
                                </div>
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2, lineHeight: 1.5 }}>
                                  {g.desc}
                                </div>
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
