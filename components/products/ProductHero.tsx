'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'
import DemoModal from '@/components/ui/DemoModal'
import type { ProductMode } from '@/lib/types'

const BrainCanvas = dynamic(() => import('@/components/three/BrainCanvas'), { ssr: false })
const DashboardCanvas = dynamic(() => import('@/components/three/DashboardCanvas'), { ssr: false })

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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#2563eb]" />
              <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">{overline}</span>
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold font-heading text-white leading-[1.06] tracking-tight">{headline1}</h1>
              <h1 className="text-4xl lg:text-5xl font-extrabold font-heading leading-[1.06] tracking-tight bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{headline2}</h1>
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

        {/* Right 3D */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,rgba(212,175,55,0.1),transparent_65%)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(212,175,55,0.012)_3px,rgba(212,175,55,0.012)_4px)] pointer-events-none" />
          <div className="absolute inset-0">
            {mode === 'medical' ? <BrainCanvas /> : <DashboardCanvas />}
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
