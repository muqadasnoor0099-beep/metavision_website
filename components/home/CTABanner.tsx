'use client'

import { motion } from 'framer-motion'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'

export default function CTABanner() {
  return (
    <section className="py-20 px-6 lg:px-8 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,175,55,0.08),transparent_60%)]"
        animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(212,175,55,0.05),transparent_60%)]"
        animate={{ x: [0, -20, 0], y: [0, 18, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
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
          Start your free trial today — no credit card required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <GoldButton href="/contact">Start Free Trial</GoldButton>
          <GhostButton href="/demo">Book a Demo</GhostButton>
        </motion.div>
      </div>
    </section>
  )
}
