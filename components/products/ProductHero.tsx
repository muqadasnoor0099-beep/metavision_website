'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'
import DemoModal from '@/components/ui/DemoModal'
import type { ProductMode } from '@/lib/types'

const BrainCanvas    = dynamic(() => import('@/components/three/BrainCanvas'),    { ssr: false })
const WorkflowCanvas = dynamic(() => import('@/components/three/WorkflowCanvas'), { ssr: false })

interface Props {
  mode: ProductMode
  overline: string
  headline1: string
  headline2: string
  description: string
  ctaLabel: string
  ctaHref: string
  demoVideoSrc?: string
  demoTitle?: string
}

export default function ProductHero({
  mode, overline, headline1, headline2, description, ctaLabel, ctaHref,
  demoVideoSrc, demoTitle,
}: Props) {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <>
      <section className="relative min-h-[80vh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.06),transparent)]" />

        {/* Left */}
        <div className="flex flex-col justify-center px-8 lg:px-16 py-20 lg:py-0 gap-7 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#2563eb]" />
              <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">{overline}</span>
            </div>
            <div>
              <h1
                className="font-extrabold font-heading text-white leading-[.96] tracking-[-0.01em]"
                style={{ fontSize: 'clamp(38px,5.5vw,70px)' }}
              >
                {headline1}
              </h1>
              <h1
                className="font-extrabold font-heading leading-[.96] tracking-[-0.01em] bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent"
                style={{ fontSize: 'clamp(38px,5.5vw,70px)' }}
              >
                {headline2}
              </h1>
            </div>
            <p className="text-white/55 text-sm leading-relaxed max-w-[380px]">{description}</p>
            <div className="flex gap-3 flex-wrap">
              <GoldButton href={ctaHref}>{ctaLabel}</GoldButton>
              <GhostButton onClick={demoVideoSrc ? () => setDemoOpen(true) : undefined}>
                ▶ Watch Demo
              </GhostButton>
            </div>
          </motion.div>
        </div>

        {/* Right — permanent dark neon stage so the 3D model is vivid in both themes.
            The Three.js canvas uses alpha:true (transparent background), so without
            an explicit dark background the neon lines vanish on light-mode pages. */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
          {/* 1. Deep navy base */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(140deg,#020c1f 0%,#030f28 55%,#041232 100%)' }}
          />
          {/* 2. Electric blue radial glow — centre */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 70% at 55% 50%,rgba(37,99,235,0.65) 0%,rgba(8,20,65,0.4) 40%,transparent 68%)' }}
          />
          {/* 3. Cyan accent — upper-right corner */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 55% 50% at 82% 18%,rgba(6,182,212,0.38) 0%,transparent 56%)' }}
          />
          {/* 4. Violet accent — lower-left corner */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 50% 45% at 18% 82%,rgba(139,92,246,0.28) 0%,transparent 56%)' }}
          />
          {/* 5. Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(96,165,250,0.20) 1px,transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* 6. Edge vignette — darkens corners so model feels centred */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 88% 88% at 50% 50%,transparent 48%,rgba(2,8,28,0.82) 100%)' }}
          />
          {/* 7. Three.js canvas */}
          <div className="absolute inset-0">
            {mode === 'medical' ? <BrainCanvas /> : <WorkflowCanvas />}
          </div>
        </div>
      </section>

      {demoVideoSrc && (
        <DemoModal
          open={demoOpen}
          onClose={() => setDemoOpen(false)}
          videoSrc={demoVideoSrc}
          title={demoTitle}
        />
      )}
    </>
  )
}
