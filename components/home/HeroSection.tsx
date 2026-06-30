'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import DemoModal from '@/components/ui/DemoModal'
import { PRODUCT_DEMO_BY_MODE } from '@/lib/constants'
import type { ProductMode } from '@/lib/types'

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const SLIDES = [
  {
    video:  '/videos/Medical.mp4',
    badge:  'Healthcare AI',
    accent: '#60a5fa',
    btnBg:  '#2563eb',
    line1:  'Smarter Healthcare',
    prefix: 'Through ',
    words:  ['AI Systems', 'Diagnosis', 'Prescriptions'] as string[],
    suffix: '',
    sub:    'AI-powered prescriptions and clinical tools for modern doctors.',
    tags:   ['Smart Prescriptions', 'AI Workflows', 'Digital Records'],
    cta:    'Explore Healthcare',
    mode:   'medical' as ProductMode,
  },
  {
    video:  '/videos/CA.mp4',
    badge:  'CA Finance Platform',
    accent: '#a78bfa',
    btnBg:  '#7c3aed',
    line1:  'CA Accounting',
    prefix: 'Made ',
    words:  ['Effortless', 'Simplified', 'Automated'] as string[],
    suffix: '',
    sub:    'GST, ITR, and Balance Sheets — automated for chartered accountants.',
    tags:   ['GST & Tax Filing', 'Client Portal', 'Smart Reports'],
    cta:    'Explore Finance',
    mode:   'accounting' as ProductMode,
  },
  {
    video:  '/videos/Oil.mp4',
    badge:  'Industrial Intelligence',
    accent: '#c9b458',
    btnBg:  '#8a7a2e',
    line1:  'Oil & Gas',
    prefix: '',
    words:  ['Intelligence', 'Real-Time', 'Smart'] as string[],
    suffix: ' Dashboards',
    sub:    'Monitor production, operations, and KPIs in real time.',
    tags:   ['Live Monitoring', 'Production Analytics', 'KPI Dashboards'],
    cta:    'Explore Dashboards',
    mode:   null,
  },
]

const DURATION = 5800

/* ─────────────────────────────────────────
   TYPEWRITER
───────────────────────────────────────── */
function Typewriter({ words, color }: { words: string[]; color: string }) {
  const [text, setText] = useState('')
  const st = useRef({ wi: 0, ci: 0, del: false, paused: false })
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    st.current = { wi: 0, ci: 0, del: false, paused: false }
    setText('')
    function tick() {
      const s = st.current
      const w = words[s.wi]
      if (s.paused) { s.paused = false; timer.current = setTimeout(tick, 1500); return }
      if (!s.del) {
        s.ci++; setText(w.slice(0, s.ci))
        if (s.ci === w.length) { s.paused = true; s.del = true }
        timer.current = setTimeout(tick, 70)
      } else {
        s.ci--; setText(w.slice(0, s.ci))
        if (s.ci === 0) { s.del = false; s.wi = (s.wi + 1) % words.length }
        timer.current = setTimeout(tick, 38)
      }
    }
    timer.current = setTimeout(tick, 300)
    return () => clearTimeout(timer.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]) // re-mounts when slide changes

  return (
    <>
      <span style={{ color }}>{text}</span>
      <span
        style={{
          display: 'inline-block', width: 3, height: '0.78em',
          marginLeft: 4, verticalAlign: 'middle',
          background: color,
          animation: 'cblink 0.85s step-end infinite',
        }}
      />
    </>
  )
}

/* ─────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────── */
export default function HeroSection() {
  const [current,  setCurrent]  = useState(0)
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoMode, setDemoMode] = useState<ProductMode>('medical')
  const videoRefs  = useRef<(HTMLVideoElement | null)[]>([null, null, null])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef(0)

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length)
    }, DURATION)
  }, [])

  const [direction, setDirection] = useState(1) // 1 = forward (right→left), -1 = backward (left→right)

  const goTo = useCallback((index: number, dir?: number) => {
    setDirection(dir ?? 1)
    setCurrent(index)
    startAutoPlay()
  }, [startAutoPlay])

  const goPrev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, -1)
  }, [current, goTo])

  const goNext = useCallback(() => {
    goTo((current + 1) % SLIDES.length, 1)
  }, [current, goTo])

  /* auto-advance */
  useEffect(() => {
    startAutoPlay()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [startAutoPlay])

  /* play active video, pause others */
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === current) { v.play().catch(() => {}) }
      else               { v.pause() }
    })
  }, [current])

  function openDemo(mode: ProductMode | null) {
    setDemoMode(mode ?? 'medical')
    setDemoOpen(true)
  }

  const slide = SLIDES[current]

  return (
    <>
      <style>{`
        /* Sora loaded via next/font — no extra import needed */
        @keyframes bdot   { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes cblink { 0%,100%{opacity:1} 50%{opacity:0}  }
      `}</style>

      <section
        className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black"
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const diff = touchStartX.current - e.changedTouches[0].clientX
          if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev()
        }}
      >

        {/* ── VIDEOS: always mounted so they preload, opacity-switched ── */}
        {SLIDES.map((s, i) => (
          <video
            key={s.video}
            ref={el => { videoRefs.current[i] = el }}
            src={s.video}
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: current === i ? 1 : 0, zIndex: current === i ? 1 : 0 }}
          />
        ))}

        {/* ── ANIMATED CONTENT: direction-aware slide ── */}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={current}
            className="absolute inset-0 z-10"
            initial={{ x: direction > 0 ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: direction > 0 ? '-100%' : '100%' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Overlays */}
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.44)' }} />
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 55% 60% at 80% 50%,${slide.accent}22 0%,transparent 70%)` }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg,rgba(0,0,0,0.70) 0%,rgba(0,0,0,0.18) 52%,transparent 100%),linear-gradient(to top,rgba(0,0,0,0.52) 0%,transparent 44%)' }} />

            {/* Slide content */}
            <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: '100px 80px 80px' }}>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45 }}
                className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full mb-4 text-[11px] font-semibold tracking-[.14em] uppercase"
                style={{ border: `1px solid ${slide.accent}44`, background: `${slide.accent}1a`, color: slide.accent }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: slide.accent, animation: 'bdot 1.4s ease-in-out infinite' }}
                />
                {slide.badge}
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.5 }}
                className="font-extrabold leading-[.96] tracking-[-0.01em] mb-3.5"
                style={{ fontSize: 'clamp(38px,5.5vw,70px)', fontFamily: "var(--font-sora), sans-serif", color: '#fff' }}
              >
                {slide.line1}<br />
                <span>
                  {slide.prefix}
                  <Typewriter words={slide.words} color={slide.accent} />
                  {slide.suffix}
                </span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.45 }}
                className="text-[15px] leading-[1.65] font-light mb-5"
                style={{ maxWidth: 430, color: 'rgba(255,255,255,0.65)' }}
              >
                {slide.sub}
              </motion.p>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.33, duration: 0.45 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {slide.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      color: 'rgba(255,255,255,0.65)',
                    }}
                  >
                    <span style={{ color: slide.accent, fontSize: 10, fontWeight: 700 }}>✓</span>
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.40, duration: 0.45 }}
                className="flex gap-3"
              >
                <button
                  onClick={() => openDemo(slide.mode)}
                  className="px-6 py-3 rounded-[8px] text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[.98]"
                  style={{ background: slide.btnBg, boxShadow: `0 4px 20px ${slide.btnBg}66` }}
                >
                  {slide.cta}
                </button>
                <button
                  className="px-5 py-3 rounded-[8px] text-[13px] font-medium transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1.5px solid rgba(255,255,255,0.20)',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  ▶ Watch Demo
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── LEFT ARROW ── */}
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)' }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} color="rgba(255,255,255,0.85)" />
        </button>

        {/* ── RIGHT ARROW ── */}
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)' }}
          aria-label="Next slide"
        >
          <ChevronRight size={20} color="rgba(255,255,255,0.85)" />
        </button>

        {/* ── FOOTER: dots + counter (no progress bar) ── */}
        <div className="absolute bottom-8 inset-x-[80px] z-50 flex items-center gap-4">
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className="h-[3px] rounded-full border-none p-0 cursor-pointer transition-all duration-300"
                style={{
                  width:      current === i ? 40 : 18,
                  background: current === i ? slide.accent : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </div>

          <span className="text-[11px] tracking-[.12em] tabular-nums ml-auto" style={{ color: 'rgba(255,255,255,0.30)' }}>
            0{current + 1}&nbsp;/&nbsp;0{SLIDES.length}
          </span>
        </div>

      </section>

      <DemoModal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        videoSrc={PRODUCT_DEMO_BY_MODE[demoMode].src}
        title={PRODUCT_DEMO_BY_MODE[demoMode].title}
      />
    </>
  )
}
