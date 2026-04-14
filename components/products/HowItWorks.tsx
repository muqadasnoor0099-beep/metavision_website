'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import type { Step } from '@/lib/types'

interface Props {
  steps: Step[]
}

export default function HowItWorks({ steps }: Props) {
  return (
    <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader overline="Process" title="How It" titleGold="Works" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 relative">
        <div className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.45 }}
          >
            <GlassCard>
              <div className="text-4xl font-black font-heading bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent mb-4">
                {step.number}
              </div>
              <h3 className="text-white font-heading font-semibold mb-2">{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{step.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
