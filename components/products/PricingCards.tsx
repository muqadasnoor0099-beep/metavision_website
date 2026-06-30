'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import GoldButton from '@/components/ui/GoldButton'
import type { PricingPlan } from '@/lib/types'

interface Props {
  plan: PricingPlan
}

export default function PricingCards({ plan }: Props) {
  return (
    <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader
        overline="Pricing"
        title="Custom"
        titleGold="Pricing"
        subtitle="Every plan is tailored to your team's size and workflow — talk to us and we'll build a quote around your needs."
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-8 lg:p-10 mt-14 max-w-3xl mx-auto border-gold/35 shadow-[0_0_40px_rgba(37,99,235,0.12)]"
      >
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="text-white font-heading font-bold text-2xl">{plan.name}</div>
          <p className="text-white/50 text-sm leading-relaxed max-w-md">{plan.description}</p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-white/60 text-sm">
              <Check size={14} className="text-gold shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <GoldButton href="/contact" className="justify-center px-10">{plan.cta}</GoldButton>
        </div>
      </motion.div>
    </section>
  )
}
