'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import CTABanner from '@/components/home/CTABanner'
import { useTheme } from '@/components/providers/ThemeProvider'
import { SERVICES } from '@/lib/constants'
import {
  Network, Users, Code2, BrainCircuit, ShieldCheck, LifeBuoy, DatabaseBackup, Server, Cloud,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Network, Users, Code2, BrainCircuit, ShieldCheck, LifeBuoy, DatabaseBackup, Server, Cloud,
}

// One distinct accent per service, in data order
const ACCENTS = ['#3b82f6', '#a78bfa', '#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#818cf8', '#fb923c', '#2dd4bf']

// Group services into categories for the page (titles must match lib/constants.ts SERVICES)
const CATEGORIES = [
  { label: 'Consulting & Talent',    titles: ['IT Consultant Services', 'Staff Augmentation'] },
  { label: 'Engineering & AI',       titles: ['Software Development', 'Machine Learning & Data Analytics'] },
  { label: 'Security & Resilience',  titles: ['Technical Audits', 'Disaster Recovery & Business Continuity Planning', 'Backup Strategies'] },
  { label: 'Infrastructure & Cloud', titles: ['Data Centre Design', 'Cloud Services'] },
]

const FLOATING_ICON_LIST = [Network, BrainCircuit, Cloud, ShieldCheck, Server, Code2]
const FLOATING_ICONS = [
  { top: '8%',  left: '4%',  size: 38, duration: 9,   delay: 0 },
  { top: '70%', left: '3%',  size: 30, duration: 11,  delay: 0.6 },
  { top: '20%', left: '92%', size: 34, duration: 10,  delay: 0.3 },
  { top: '80%', left: '90%', size: 28, duration: 8.5, delay: 1.2 },
  { top: '45%', left: '7%',  size: 24, duration: 9.5, delay: 1.8 },
  { top: '55%', left: '95%', size: 26, duration: 7.5, delay: 0.9 },
]

const SPRING = { type: 'spring', stiffness: 260, damping: 24 } as const
const EASE_OUT = [0.16, 1, 0.3, 1] as const

export default function ServicesPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const sectionRef = useRef<HTMLDivElement>(null)

  // Build the indexed service list once (preserves global index → accent/icon mapping)
  const indexed = SERVICES.map((s, i) => ({
    ...s,
    accent: ACCENTS[i % ACCENTS.length],
    Icon: ICON_MAP[s.icon],
    globalIndex: i,
  }))

  const tok = {
    pageBg:       isDark ? '#06060f' : '#f3f8ff',
    blobA:        isDark ? 'rgba(59,130,246,0.18)'  : 'rgba(59,130,246,0.08)',
    blobB:        isDark ? 'rgba(167,139,250,0.14)' : 'rgba(167,139,250,0.06)',
    blobC:        isDark ? 'rgba(34,211,238,0.12)'  : 'rgba(34,211,238,0.05)',
    heading:      isDark ? '#ffffff' : '#0f172a',
    body:         isDark ? 'rgba(255,255,255,0.55)' : '#475569',
    statNum:      isDark ? '#ffffff' : '#0f172a',
    statLabel:    isDark ? 'rgba(255,255,255,0.40)' : '#64748b',
    catLabel:     isDark ? 'rgba(255,255,255,0.85)' : '#0f172a',
    catLine:      isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.10)',
    cardBg:       isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.85)',
    cardBorder:   isDark ? 'rgba(255,255,255,0.08)'  : 'rgba(15,23,42,0.08)',
    cardShadow:   isDark ? 'none' : '0 4px 18px rgba(0,0,0,0.05)',
    cardTitle:    isDark ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.90)',
    cardBody:     isDark ? 'rgba(255,255,255,0.42)' : 'rgba(15,23,42,0.55)',
    tagBg:        isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
    tagBorder:    isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.08)',
    tagText:      isDark ? 'rgba(255,255,255,0.55)' : '#475569',
    numColor:     isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
  }

  return (
    <div className="pt-16" style={{ backgroundColor: tok.pageBg }}>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section ref={sectionRef} className="relative py-28 px-6 lg:px-8 text-center overflow-hidden">

        {/* Floating gradient blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <motion.div
            className="absolute rounded-full"
            style={{ width: 520, height: 520, top: '-18%', left: '-10%', background: `radial-gradient(circle, ${tok.blobA} 0%, transparent 70%)`, filter: 'blur(80px)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{ width: 460, height: 460, bottom: '-20%', right: '-8%', background: `radial-gradient(circle, ${tok.blobB} 0%, transparent 70%)`, filter: 'blur(80px)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{ width: 300, height: 300, top: '30%', left: '45%', background: `radial-gradient(circle, ${tok.blobC} 0%, transparent 70%)`, filter: 'blur(60px)' }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </div>

        {/* Floating service icons */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          {FLOATING_ICONS.map(({ top, left, size, duration, delay }, i) => {
            const Icon = FLOATING_ICON_LIST[i % FLOATING_ICON_LIST.length]
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{ top, left, opacity: isDark ? 0.10 : 0.14, color: ACCENTS[i % ACCENTS.length] }}
                animate={{ y: [0, -18, 0], rotate: [0, i % 2 === 0 ? 10 : -10, 0] }}
                transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon size={size} strokeWidth={1.5} />
              </motion.div>
            )
          })}
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-5"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-gold"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">Our Services</span>
          </motion.div>

          <h1
            className="text-4xl lg:text-6xl font-extrabold font-heading tracking-tight mb-5"
            style={{ color: tok.heading }}
          >
            {['Technology', 'Services,'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: EASE_OUT }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE_OUT }}
              className="inline-block bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent"
            >
              End to End.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-base leading-relaxed mb-12"
            style={{ color: tok.body }}
          >
            From infrastructure design and staff augmentation to machine learning, disaster recovery, and cloud — MetaVision delivers the full technology stack modern organisations need to operate, scale, and innovate.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center gap-10 lg:gap-14"
          >
            {([['9', 'Service Lines'], ['4', 'Practice Areas'], ['24/7', 'Support']] as const).map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-xl lg:text-2xl font-extrabold leading-none" style={{ fontFamily: 'var(--font-sora), sans-serif', color: tok.statNum }}>
                  {n}
                </div>
                <div className="text-[10px] lg:text-[11px] mt-1.5" style={{ color: tok.statLabel }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════ SERVICE CATEGORIES ══════════════════════ */}
      <section className="pb-28 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {CATEGORIES.map((cat, catIndex) => {
          const items = indexed.filter(s => cat.titles.includes(s.title))
          return (
            <div key={cat.label} className={catIndex > 0 ? 'mt-16' : ''}>
              {/* Category header */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="flex items-center gap-4 mb-6"
              >
                <span className="text-sm font-bold tracking-wide whitespace-nowrap" style={{ color: tok.catLabel }}>
                  {cat.label}
                </span>
                <motion.div
                  className="h-px flex-1 origin-left"
                  style={{ background: tok.catLine }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
                />
              </motion.div>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((service, i) => {
                  const Icon = service.Icon
                  return (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, y: 28, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ delay: i * 0.08, duration: 0.5, ease: EASE_OUT }}
                      whileHover={{ y: -6 }}
                      className="group relative flex flex-col gap-4 p-6 overflow-hidden cursor-default"
                      style={{
                        background: tok.cardBg,
                        border: `1px solid ${tok.cardBorder}`,
                        boxShadow: tok.cardShadow,
                        borderRadius: '1rem',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {/* Hover top line */}
                      <div
                        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: `linear-gradient(90deg,transparent,${service.accent}90,transparent)` }}
                      />
                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${service.accent}14 0%, transparent 70%)` }}
                      />

                      {/* Index number */}
                      <span
                        className="absolute top-5 right-5 text-[11px] font-bold tabular-nums pointer-events-none"
                        style={{ color: tok.numColor }}
                      >
                        {String(service.globalIndex + 1).padStart(2, '0')}
                      </span>

                      {/* Icon */}
                      <motion.div
                        className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: `${service.accent}16`,
                          border: `1px solid ${service.accent}38`,
                          boxShadow: `0 0 18px ${service.accent}18`,
                        }}
                        initial={{ scale: 0, rotate: -20 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + i * 0.08, ...SPRING }}
                        whileHover={{ scale: 1.12, rotate: 6 }}
                      >
                        <Icon size={20} style={{ color: service.accent }} />
                      </motion.div>

                      <h3 className="relative z-10 font-heading font-bold text-lg leading-snug" style={{ color: tok.cardTitle }}>
                        {service.title}
                      </h3>

                      {service.tags && (
                        <div className="relative z-10 flex flex-wrap gap-2">
                          {service.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                              style={{ background: tok.tagBg, border: `1px solid ${tok.tagBorder}`, color: tok.tagText }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {service.description && (
                        <p className="relative z-10 text-sm leading-relaxed" style={{ color: tok.cardBody }}>
                          {service.description}
                        </p>
                      )}

                      {/* Learn more (hover reveal) */}
                      <div
                        className="relative z-10 mt-auto pt-1 flex items-center gap-1.5 text-[12px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ color: service.accent }}
                      >
                        Learn more
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>

      <CTABanner />
    </div>
  )
}
