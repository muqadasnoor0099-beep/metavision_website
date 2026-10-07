'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import { TESTIMONIALS } from '@/lib/constants'

function TiltWrapper({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rx  = useMotionValue(0)
  const ry  = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 300, damping: 22 })
  const sry = useSpring(ry, { stiffness: 300, damping: 22 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ry.set(px * 8)
    rx.set(-py * 8)
  }

  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      animate={{ opacity: active ? 1 : 0.38, scale: active ? 1 : 0.97 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 800 }}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  )
}

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
            <TiltWrapper key={i} active={i === active} onClick={() => setActive(i)}>
              <GlassCard className={i === active ? 'border-gold/30' : ''}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs mt-0.5">{t.role}, {t.company}</div>
                </div>
              </GlassCard>
            </TiltWrapper>
          ))}
        </div>

        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-[width,background-color] duration-300 ${i === active ? 'w-4 h-2 bg-gold' : 'w-2 h-2 bg-white/20'}`}
            />
          ))}
          <button
            onClick={() => setActive((a) => (a + 1) % TESTIMONIALS.length)}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}
