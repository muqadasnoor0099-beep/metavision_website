'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'
import type { PricingTier } from '@/lib/types'

interface Props {
  tiers: PricingTier[]
}

export default function PricingCards({ tiers }: Props) {
  return (
    <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader overline="Pricing" title="Simple," titleGold="Transparent Pricing" subtitle="No hidden fees. Cancel anytime." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 flex flex-col ${
              tier.highlighted ? 'border-gold/35 shadow-[0_0_40px_rgba(212,175,55,0.1)]' : ''
            }`}
          >
            {tier.highlighted && (
              <div className="text-[10px] font-bold text-black bg-gradient-to-r from-gold to-gold-light rounded-full px-3 py-1 w-fit mb-4">
                MOST POPULAR
              </div>
            )}
            <div className="text-white font-heading font-bold text-xl mb-1">{tier.name}</div>
            <div className="mb-2">
              <span className="text-3xl font-extrabold text-gold font-heading">{tier.price}</span>
              <span className="text-white/40 text-sm">{tier.period}</span>
            </div>
            <p className="text-white/40 text-sm mb-6">{tier.description}</p>
            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {tier.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2.5 text-white/60 text-sm">
                  <Check size={14} className="text-gold shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {tier.highlighted ? (
              <GoldButton href="/contact" className="w-full justify-center">{tier.cta}</GoldButton>
            ) : (
              <GhostButton className="w-full">{tier.cta}</GhostButton>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
