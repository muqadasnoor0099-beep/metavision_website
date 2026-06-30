'use client'

import { motion } from 'framer-motion'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'

export default function CTABanner() {
  return (
    <section className="py-20 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,175,55,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(212,175,55,0.05),transparent_60%)]" />
      <div className="absolute inset-0 border-y border-gold/10" />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-5xl font-extrabold font-heading tracking-tight"
        >
          <span className="text-white">Ready to Transform </span>
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">Your Practice?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/50 text-base leading-relaxed max-w-xl"
        >
          Join 1,700+ professionals already using MetaVision. Start your free trial today — no credit card required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <GoldButton href="/contact">Start Free Trial</GoldButton>
          <GhostButton>Book a Demo</GhostButton>
        </motion.div>
      </div>
    </section>
  )
}
