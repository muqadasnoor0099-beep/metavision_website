'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import { MEDICAL_FEATURES, ACCOUNTING_FEATURES } from '@/lib/constants'
import type { Feature, ProductMode } from '@/lib/types'

const ICON_MAP: Record<string, LucideIcon> = {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
}

interface Props {
  fixedMode?: ProductMode
}

export default function FeaturesSection({ fixedMode }: Props) {
  const [mode, setMode] = useState<ProductMode>(fixedMode ?? 'medical')
  const features: Feature[] = mode === 'medical' ? MEDICAL_FEATURES : ACCOUNTING_FEATURES

  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader
        overline="Capabilities"
        title="Everything You Need."
        titleGold="Nothing You Don't."
        subtitle="Purpose-built features for healthcare and financial professionals."
      />

      {!fixedMode && (
        <div className="flex justify-center mt-8 mb-4">
          <div className="inline-flex bg-white/[0.05] border border-gold/20 rounded-full p-1 gap-1">
            {(['medical', 'accounting'] as ProductMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all duration-300 ${
                  mode === m ? 'bg-gradient-to-r from-gold to-gold-light text-black' : 'text-white/40 hover:text-white/65'
                }`}
              >
                {m === 'medical' ? 'Medical' : 'Accounting'}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10"
        >
          {features.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon]
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.055, duration: 0.38 }}
              >
                <GlassCard hover>
                  <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <h3 className="font-heading font-semibold text-white mb-1.5">{feature.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
