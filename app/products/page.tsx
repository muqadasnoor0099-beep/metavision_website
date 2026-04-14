'use client'

import { motion } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'
import { MEDICAL_FEATURES, ACCOUNTING_FEATURES } from '@/lib/constants'
import {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Feature } from '@/lib/types'

const ICON_MAP: Record<string, LucideIcon> = {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
}

function ProductSection({
  tag, headline1, headline2, description, features, ctaHref, flip,
}: {
  tag: string; headline1: string; headline2: string; description: string
  features: Feature[]; ctaHref: string; flip: boolean
}) {
  return (
    <section className={`py-20 px-6 lg:px-8 relative overflow-hidden ${flip ? 'bg-surface/30' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${flip ? 'lg:flex-row-reverse' : ''}`}>
          <motion.div initial={{ opacity: 0, x: flip ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">{tag}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-heading tracking-tight mb-4">
              <span className="text-white">{headline1} </span>
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{headline2}</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-md">{description}</p>
            <div className="flex gap-3">
              <GoldButton href={ctaHref}>Learn More</GoldButton>
              <GhostButton>View Demo</GhostButton>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.slice(0, 4).map((f, i) => {
              const Icon = ICON_MAP[f.icon]
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <GlassCard hover className="p-4">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-3">
                      <Icon size={15} className="text-gold" />
                    </div>
                    <div className="text-white font-semibold text-sm mb-1">{f.title}</div>
                    <div className="text-white/40 text-xs leading-relaxed">{f.description}</div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ProductsPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.07),transparent_60%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">Our Products</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading tracking-tight mb-5">
            <span className="text-white">Two Products. </span>
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">One Vision.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            MetaVision builds AI-first software for two of India's most demanding professions. Both products share the same commitment: intelligence that works in the background, so you can focus on what matters.
          </p>
        </div>
      </section>

      <ProductSection
        tag="Medical Software"
        headline1="Real-Time Consultation"
        headline2="& AI Prescription"
        description="Seamless live video consultations with intelligent AI prescription suggestions, patient records, and lab integration — all in one platform."
        features={MEDICAL_FEATURES}
        ctaHref="/products/medical"
        flip={false}
      />

      <ProductSection
        tag="CA Workflow Software"
        headline1="Intelligent Accounting"
        headline2="For Modern CAs"
        description="End-to-end workflow automation for chartered accountants — GST, ITR, balance sheets, and client management powered by AI."
        features={ACCOUNTING_FEATURES}
        ctaHref="/products/accounting"
        flip={true}
      />
    </div>
  )
}
