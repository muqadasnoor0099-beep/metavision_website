'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import { TESTIMONIALS } from '@/lib/constants'

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader overline="Testimonials" title="What Our" titleGold="Clients Say" />

      <div className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              animate={{ opacity: i === active ? 1 : 0.38, scale: i === active ? 1 : 0.97 }}
              transition={{ duration: 0.4 }}
              onClick={() => setActive(i)}
              className="cursor-pointer"
            >
              <GlassCard className={i === active ? 'border-gold/30' : ''}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs mt-0.5">{t.role}, {t.company}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all ${i === active ? 'w-4 h-2 bg-gold' : 'w-2 h-2 bg-white/20'}`}
            />
          ))}
          <button
            onClick={() => setActive((a) => (a + 1) % TESTIMONIALS.length)}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}
