'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import StatCounter from '@/components/ui/StatCounter'
import { WHY_US } from '@/lib/constants'

export default function WhyUsSection() {
  return (
    <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(212,175,55,0.04)_0%,transparent_70%)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          overline="Why MetaVision"
          title="Trusted by"
          titleGold="Industry Leaders"
          subtitle="From solo practitioners to hospital chains, professionals across India rely on MetaVision."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          {WHY_US.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <StatCounter value={item.value} label={item.label} />
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
