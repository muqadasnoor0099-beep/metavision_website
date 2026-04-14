'use client'

import { motion } from 'framer-motion'
import {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import type { Feature } from '@/lib/types'

const ICON_MAP: Record<string, LucideIcon> = {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
}

interface Props {
  features: Feature[]
  title: string
  titleGold?: string
}

export default function FeatureGrid({ features, title, titleGold }: Props) {
  return (
    <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader overline="Features" title={title} titleGold={titleGold} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {features.map((feature, i) => {
          const Icon = ICON_MAP[feature.icon]
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.38 }}
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
      </div>
    </section>
  )
}
