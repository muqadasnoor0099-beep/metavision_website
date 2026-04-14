'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'
import { HERO_CONTENT } from '@/lib/constants'
import type { ProductMode } from '@/lib/types'

const BrainCanvas = dynamic(() => import('@/components/three/BrainCanvas'), { ssr: false })
const DashboardCanvas = dynamic(() => import('@/components/three/DashboardCanvas'), { ssr: false })

const MODES: ProductMode[] = ['medical', 'accounting']
const MODE_LABELS: Record<ProductMode, string> = {
  medical: 'Medical Software',
  accounting: 'Accounting Software',
}

export default function HeroSection() {
  const [mode, setMode] = useState<ProductMode>('medical')

  useEffect(() => {
    const id = setInterval(() => {
      setMode((m) => (m === 'medical' ? 'accounting' : 'medical'))
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const content = HERO_CONTENT[mode]

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Global background radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.06),transparent)]" />

      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen pt-16">
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col justify-center px-8 lg:px-16 py-20 lg:py-0 gap-7">
          {/* Pill toggle */}
          <div className="inline-flex bg-white/[0.05] border border-gold/20 rounded-full p-1 gap-1 w-fit">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all duration-300 ${
                  mode === m
                    ? 'bg-gradient-to-r from-gold to-gold-light text-black'
                    : 'text-white/40 hover:text-white/65'
                }`}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Animated content block */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-5"
            >
              {/* Overline */}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#d4af37]" />
                <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">
                  {content.overline}
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold font-heading text-white leading-[1.06] tracking-tight">
                  {content.headline1}
                </h1>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold font-heading leading-[1.06] tracking-tight bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                  {content.headline2}
                </h1>
              </div>

              {/* Description */}
              <p className="text-white/55 text-sm leading-relaxed max-w-[380px]">
                {content.description}
              </p>

              {/* CTAs */}
              <div className="flex gap-3 flex-wrap">
                <GoldButton href={content.ctaHref}>{content.ctaLabel}</GoldButton>
                <GhostButton>▶ Watch Demo</GhostButton>
              </div>

              {/* Stats */}
              <div className="flex gap-7 pt-5 border-t border-white/[0.07]">
                {content.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-gold font-extrabold text-xl font-heading">{stat.value}</div>
                    <div className="text-white/35 text-[11px] mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── RIGHT COLUMN: 3D ── */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
          {/* Stage glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,rgba(212,175,55,0.1)_0%,transparent_65%)]" />
          {/* Scan lines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(212,175,55,0.012)_3px,rgba(212,175,55,0.012)_4px)] pointer-events-none" />

          {/* 3D canvas */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.55 }}
              className="absolute inset-0"
            >
              {mode === 'medical' ? <BrainCanvas /> : <DashboardCanvas />}
            </motion.div>
          </AnimatePresence>

          {/* Floating status card — bottom right */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`card-br-${mode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="absolute bottom-8 right-6 glass-card p-3 min-w-[155px] z-10"
            >
              <div className="text-gold text-[9px] font-bold tracking-widest mb-1.5">
                {mode === 'medical' ? 'AI ANALYSIS' : 'REVENUE REPORT'}
              </div>
              <div className="text-white text-sm font-semibold mb-0.5">
                {mode === 'medical' ? 'Diagnosis Ready' : '+24% Growth'}
              </div>
              <div className="text-white/40 text-[11px]">
                {mode === 'medical' ? 'Confidence: 97.4%' : 'vs last quarter'}
              </div>
              <div className="mt-2 h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-700"
                  style={{ width: mode === 'medical' ? '97%' : '76%' }}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating status card — top left */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`card-tl-${mode}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45, duration: 0.3 }}
              className="absolute top-10 left-6 glass-card p-3 z-10"
            >
              <div className="text-white/35 text-[9px] font-semibold tracking-widest mb-2 uppercase">
                {mode === 'medical' ? 'Neural Activity' : 'Reports Filed'}
              </div>
              <div className="flex items-end gap-1 h-6">
                {[10, 20, 13, 24, 16, 8, 18].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gold rounded-sm transition-all duration-500"
                    style={{ height: `${(h / 24) * 100}%`, opacity: 0.5 + (h / 24) * 0.5 }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-white/25 text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-0.5 h-5 bg-gradient-to-b from-gold/40 to-transparent rounded-full"
        />
      </div>
    </section>
  )
}
