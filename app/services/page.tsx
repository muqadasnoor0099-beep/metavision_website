'use client'

import { motion } from 'framer-motion'
import CTABanner from '@/components/home/CTABanner'
import { ImageStreamHero } from '@/components/ui/image-stream-hero'
import { useTheme } from '@/components/providers/ThemeProvider'
import { SERVICES } from '@/lib/constants'
import {
  Network, Users, Code2, BrainCircuit, ShieldCheck, LifeBuoy, DatabaseBackup, Server, Cloud,
  Stethoscope, Calculator, Gauge,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Network, Users, Code2, BrainCircuit, ShieldCheck, LifeBuoy, DatabaseBackup, Server, Cloud,
}

// One distinct accent per service, in data order
const ACCENTS = ['#3b82f6', '#a78bfa', '#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#818cf8', '#fb923c', '#2dd4bf']

// The 3 flagship products shown in the Home page hero carousel —
// accents and copy match components/home/HeroSection.tsx SLIDES / lib/constants.ts HERO_CONTENT
const PRODUCTS = [
  {
    icon: Stethoscope,
    badge: 'Healthcare AI',
    name: 'NexLink MedAI',
    accent: '#60a5fa',
    description: 'Seamless live video consultations with intelligent AI prescription suggestions — built for modern healthcare workflows.',
    tags: ['Smart Prescriptions', 'AI Workflows', 'Digital Records'],
    cta: 'Explore NexLink MedAI',
    href: '/products/medical',
  },
  {
    icon: Calculator,
    badge: 'CA Finance Platform',
    name: 'Workflow Management System',
    accent: '#a78bfa',
    description: 'End-to-end workflow platform for chartered accountants — GST filing, ITR preparation, balance sheets, and client management all in one place.',
    tags: ['GST & Tax Filing', 'Client Portal', 'Smart Reports'],
    cta: 'Explore Workflow Management System',
    href: '/products/accounting',
  },
  {
    icon: Gauge,
    badge: 'Industrial Intelligence',
    name: 'Oil & Gas Intelligence Dashboards',
    accent: '#c9b458',
    description: "Real-time industrial dashboards for monitoring production, operations, and KPIs — built for enterprises that can't afford blind spots.",
    tags: ['Live Monitoring', 'Production Analytics', 'KPI Dashboards'],
    cta: 'Request a Demo',
    href: '/demo',
  },
] as const

// Group services into categories for the page (titles must match lib/constants.ts SERVICES)
const CATEGORIES = [
  { label: 'Consulting & Talent',    titles: ['IT Consultant Services', 'Staff Augmentation'] },
  { label: 'Engineering & AI',       titles: ['Software Development', 'Machine Learning & Data Analytics'] },
  { label: 'Security & Resilience',  titles: ['Technical Audits', 'Disaster Recovery & Business Continuity Planning', 'Backup Strategies'] },
  { label: 'Infrastructure & Cloud', titles: ['Data Centre Design', 'Cloud Services'] },
]

// Hero image corridor — real photography, one per service area. Each photo
// was verified individually (free Unsplash License, not Unsplash+ premium)
// before being used here.
const SERVICE_IMAGES = [
  { id: '1666886573421-d19e546cfc4e', alt: 'Doctor reviewing patient data on a tablet — Healthcare AI' },
  { id: '1707157284454-553ef0a4ed0d', alt: 'Office desk with financial charts — CA Finance' },
  { id: '1516199423456-1f1e91b06f25', alt: 'Oil pump jack silhouette at sunset — Oil & Gas' },
  { id: '1754039984985-ef607d80113a', alt: 'Code displayed on computer screens — Software Development' },
  { id: '1750365919971-7dd273e7b317', alt: 'AI concept inside a lightbulb — Machine Learning' },
  { id: '1667984390538-3dea7a3fe33d', alt: '3D render of a cloud computing concept — Cloud Services' },
  { id: '1768839720936-87ce3adf2d08', alt: 'Combination lock on a keyboard — Security Audits' },
  { id: '1695668548342-c0c1ad479aee', alt: 'Server racks in a data center — Data Centre' },
  { id: '1690627931320-16ac56eb2588', alt: 'Cloud icon with floating data charts — Disaster Recovery' },
  { id: '1758873269276-9518d0cb4a0b', alt: 'Diverse team collaborating in an office — Staff Augmentation' },
].map(({ id, alt }) => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=1100&q=80`,
  alt,
}))

const SPRING = { type: 'spring', stiffness: 260, damping: 24 } as const
const EASE_OUT = [0.16, 1, 0.3, 1] as const

export default function ServicesPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

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
      <ImageStreamHero
        images={SERVICE_IMAGES}
        cards={9}
        speed={20}
        axis={58}
        className="h-[640px] lg:h-[720px] w-full"
        style={{ backgroundColor: tok.pageBg }}
      >
        {/* Legibility scrim over the corridor — strong radial behind the text
            block, plus a top/bottom fade so the frame edges still read clean */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 62% 78% at 50% 50%, rgba(6,6,15,0.97) 0%, rgba(6,6,15,0.90) 45%, rgba(6,6,15,0.55) 72%, transparent 100%), linear-gradient(to bottom, rgba(6,6,15,0.85) 0%, transparent 22%, transparent 78%, rgba(6,6,15,0.9) 100%)'
              : 'radial-gradient(ellipse 62% 78% at 50% 50%, rgba(243,248,255,0.97) 0%, rgba(243,248,255,0.90) 45%, rgba(243,248,255,0.55) 72%, transparent 100%), linear-gradient(to bottom, rgba(243,248,255,0.88) 0%, transparent 22%, transparent 78%, rgba(243,248,255,0.92) 100%)',
          }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
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
              MetaVision builds three flagship AI-powered products — for healthcare, finance, and industrial operations — backed by a full technology practice that keeps them running: infrastructure design, staff augmentation, machine learning, disaster recovery, and cloud.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex justify-center gap-10 lg:gap-14"
            >
              {([['3', 'Core Products'], ['9', 'Service Lines'], ['4', 'Practice Areas'], ['24/7', 'Support']] as const).map(([n, l]) => (
                <div key={l} className="text-center">
                  <div className="text-xl lg:text-2xl font-extrabold leading-none" style={{ fontFamily: 'var(--font-sora), sans-serif', color: tok.statNum }}>
                    {n}
                  </div>
                  <div className="text-[10px] lg:text-[11px] mt-1.5" style={{ color: tok.statLabel }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </ImageStreamHero>

      {/* ══════════════════════ OUR PRODUCTS ══════════════════════ */}
      <section className="pb-24 px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">Our Products</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold font-heading tracking-tight" style={{ color: tok.heading }}>
            Three Products. <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">One Platform.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          {PRODUCTS.map((product, i) => {
            const Icon = product.icon
            return (
              <motion.a
                key={product.name}
                href={product.href}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: EASE_OUT }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-7 lg:p-8 overflow-hidden"
                style={{
                  background: tok.cardBg,
                  border: `1px solid ${tok.cardBorder}`,
                  boxShadow: tok.cardShadow,
                  borderRadius: '1.25rem',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 70% 60% at 0% 50%, ${product.accent}12 0%, transparent 70%)` }}
                />

                <motion.div
                  className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: `${product.accent}16`,
                    border: `1px solid ${product.accent}38`,
                    boxShadow: `0 0 24px ${product.accent}20`,
                  }}
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  transition={SPRING}
                >
                  <Icon size={28} style={{ color: product.accent }} />
                </motion.div>

                <div className="relative z-10 flex-1">
                  <span
                    className="inline-block text-[10px] font-bold tracking-[0.18em] uppercase mb-2 px-2.5 py-1 rounded-full"
                    style={{ color: product.accent, background: `${product.accent}12`, border: `1px solid ${product.accent}28` }}
                  >
                    {product.badge}
                  </span>
                  <h3 className="font-heading font-bold text-xl lg:text-2xl mb-2" style={{ color: tok.cardTitle }}>
                    {product.name}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 max-w-xl" style={{ color: tok.cardBody }}>
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                        style={{ background: tok.tagBg, border: `1px solid ${tok.tagBorder}`, color: tok.tagText }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="relative z-10 flex items-center gap-1.5 text-[13px] font-semibold shrink-0 self-start sm:self-center"
                  style={{ color: product.accent }}
                >
                  {product.cta}
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.a>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════ OTHER SERVICES ══════════════════════ */}
      <section className="pb-28 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">Other Services</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold font-heading tracking-tight mb-4" style={{ color: tok.heading }}>
            The Practice Behind the Products
          </h2>
          <p className="text-sm lg:text-base leading-relaxed max-w-xl mx-auto" style={{ color: tok.body }}>
            Beyond our three core products, our full technology practice keeps everything else running — from infrastructure to incident response.
          </p>
        </motion.div>

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
