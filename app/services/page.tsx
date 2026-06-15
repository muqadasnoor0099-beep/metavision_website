'use client'

import { motion } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import CTABanner from '@/components/home/CTABanner'
import { SERVICES } from '@/lib/constants'
import {
  Network, Users, Code2, BrainCircuit, ShieldCheck, LifeBuoy, DatabaseBackup, Server, Cloud,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Network, Users, Code2, BrainCircuit, ShieldCheck, LifeBuoy, DatabaseBackup, Server, Cloud,
}

export default function ServicesPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.07),transparent_60%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">Our Services</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading tracking-tight mb-5">
            <span className="text-white">Technology Services, </span>
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">End to End.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            From infrastructure design and staff augmentation to machine learning, disaster recovery, and cloud — MetaVision delivers the full technology stack modern organisations need to operate, scale, and innovate.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon]
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.4 }}
                className="h-full"
              >
                <GlassCard hover className="h-full flex flex-col">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <h3 className="font-heading font-semibold text-white text-lg mb-3">{service.title}</h3>
                  {service.tags && (
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/55"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {service.description && (
                    <p className="text-white/45 text-sm leading-relaxed">{service.description}</p>
                  )}
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </section>

      <CTABanner />
    </div>
  )
}
