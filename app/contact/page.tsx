'use client'

import { motion } from 'framer-motion'
import {
  Mail, MapPin, Clock, ExternalLink,
  Sparkles, Target, ShieldCheck, Cloud, Headset, TrendingUp,
} from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'
import { useTheme } from '@/components/providers/ThemeProvider'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const OFFICE_ADDRESS = 'DHA Phase 5, Islamabad, Pakistan'
const OFFICE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_ADDRESS)}`

const HERO_INFO = [
  { Icon: Mail,   label: 'Email Us',        value: 'admin@metavision.world' },
  { Icon: MapPin, label: 'Visit Our Office', value: OFFICE_ADDRESS },
  { Icon: Clock,  label: 'Business Hours',   value: 'Mon - Fri: 9:00 AM - 6:00 PM' },
]

const WHY_PARTNER = [
  { Icon: Sparkles,    title: 'AI-First Approach',         desc: 'Intelligent solutions designed to solve real-world challenges.' },
  { Icon: Target,      title: 'Industry-Specific Expertise', desc: 'Deep understanding of healthcare & accounting domains.' },
  { Icon: ShieldCheck, title: 'Enterprise-Grade Security',  desc: 'Robust security frameworks to protect what matters most.' },
  { Icon: Cloud,       title: 'Scalable Cloud Solutions',   desc: 'Built for scalability, performance, and reliability.' },
  { Icon: Headset,     title: 'Dedicated Support Team',     desc: "We're with you every step of the way." },
  { Icon: TrendingUp,  title: 'Proven Business Impact',     desc: 'Delivering measurable results that drive growth.' },
]

// Decorative network nodes for the hero background (approximate world-map / global-reach motif)
const NODES = [
  { x: 62, y: 18 }, { x: 78, y: 12 }, { x: 88, y: 28 }, { x: 70, y: 38 },
  { x: 84, y: 50 }, { x: 95, y: 20 }, { x: 55, y: 30 }, { x: 92, y: 62 },
]
const LINKS = [[0, 1], [1, 2], [0, 3], [3, 4], [1, 5], [2, 5], [3, 6], [4, 7]]

export default function ContactPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const tok = {
    heroBg:     isDark ? '#060b1f' : '#0a1238',
    heroFade:   isDark ? '#06060f' : '#0a1238',
    bodyBg:     isDark ? '#06060f' : '#f3f8ff',
    cardBg:     isDark ? 'rgba(255,255,255,0.035)' : '#ffffff',
    cardBorder: isDark ? 'rgba(255,255,255,0.08)'  : 'rgba(15,23,42,0.07)',
    cardShadow: isDark ? 'none' : '0 4px 24px rgba(15,23,42,0.05)',
    heading:    isDark ? '#ffffff' : '#0f172a',
    body:       isDark ? 'rgba(255,255,255,0.45)' : '#64748b',
  }

  return (
    <div>
      {/* ══════════════════════ HERO ══════════════════════ */}
      <section
        className="relative pt-32 pb-16 px-6 lg:px-8 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${tok.heroBg} 0%, ${tok.heroFade} 100%)` }}
      >
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            opacity: 0.06,
          }}
          aria-hidden="true"
        />

        {/* Network / world-map motif, right side */}
        <svg
          className="absolute right-0 top-0 w-[60%] h-full pointer-events-none hidden md:block"
          viewBox="0 0 100 70"
          preserveAspectRatio="xMaxYMid meet"
          aria-hidden="true"
        >
          {LINKS.map(([a, b], i) => (
            <motion.line
              key={i}
              x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
              stroke="#3b82f6" strokeWidth="0.15" strokeOpacity="0.35"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.35 }}
              transition={{ duration: 1.5, delay: 0.3 + i * 0.1, ease: EASE_OUT }}
            />
          ))}
          {NODES.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x} cy={n.y} r="0.9"
              fill="#60a5fa"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.08 }}
            />
          ))}
          {NODES.map((n, i) => (
            <motion.circle
              key={`pulse-${i}`}
              cx={n.x} cy={n.y} r="0.9"
              fill="none" stroke="#60a5fa" strokeWidth="0.2"
              animate={{ r: [0.9, 3.2], opacity: [0.6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
            />
          ))}
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-[#60a5fa] text-[11px] font-semibold tracking-[0.2em] uppercase">Contact Us</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: EASE_OUT }}
            className="font-heading font-extrabold tracking-tight mt-3 mb-3"
            style={{ fontSize: 'clamp(32px, 4.2vw, 48px)', lineHeight: 1.08, color: '#ffffff' }}
          >
            Let&apos;s Build Something<br />
            Extraordinary{' '}
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#93c5fd] bg-clip-text text-transparent">Together</span>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 56 }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE_OUT }}
            className="h-[3px] bg-[#3b82f6] mb-5"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-[15px] leading-relaxed max-w-md mb-12"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Have a question, need more information, or ready to start your project? We&apos;d love to hear from you.
          </motion.p>

          {/* 4 info items */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6">
            {HERO_INFO.map(({ Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.08, duration: 0.45, ease: EASE_OUT }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#2563eb' }}>
                  <Icon size={16} style={{ color: '#ffffff' }} />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold mb-0.5" style={{ color: '#ffffff' }}>{label}</div>
                  <div className="text-[12px] leading-snug" style={{ color: 'rgba(255,255,255,0.50)' }}>{value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ BODY: 3-column ══════════════════════ */}
      <section className="relative px-6 lg:px-8 py-16 lg:py-20" style={{ background: tok.bodyBg }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_0.85fr] gap-6 items-start">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <ContactForm />
          </motion.div>

          {/* Why Partner */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.1, duration: 0.5, ease: EASE_OUT }}
            className="p-7 lg:p-8 rounded-2xl flex flex-col gap-5 h-full"
            style={{ background: tok.cardBg, border: `1px solid ${tok.cardBorder}`, boxShadow: tok.cardShadow }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#2563eb' }}>
                <Sparkles size={17} style={{ color: '#ffffff' }} />
              </div>
              <h2 className="font-heading font-bold text-xl" style={{ color: tok.heading }}>Why Partner With MetaVision?</h2>
            </div>

            <div className="flex flex-col gap-4">
              {WHY_PARTNER.map(({ Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease: EASE_OUT }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: isDark ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)' }}
                  >
                    <Icon size={14} className="text-[#2563eb]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold mb-0.5" style={{ color: tok.heading }}>{title}</div>
                    <p className="text-[12px] leading-relaxed" style={{ color: tok.body }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Our Office */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.2, duration: 0.5, ease: EASE_OUT }}
            className="p-7 lg:p-8 rounded-2xl flex flex-col gap-5"
            style={{ background: tok.cardBg, border: `1px solid ${tok.cardBorder}`, boxShadow: tok.cardShadow }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#2563eb' }}>
                <MapPin size={17} style={{ color: '#ffffff' }} />
              </div>
              <h2 className="font-heading font-bold text-xl" style={{ color: tok.heading }}>Our Office</h2>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-[#2563eb] mt-0.5 shrink-0" />
              <p className="text-[13px] leading-relaxed" style={{ color: tok.body }}>
                {OFFICE_ADDRESS}
              </p>
            </div>

            {/* Embedded map */}
            <div className="relative w-full h-40 rounded-xl overflow-hidden" style={{ border: `1px solid ${tok.cardBorder}` }}>
              <iframe
                title="MetaVision office location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(OFFICE_ADDRESS)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, filter: isDark ? 'invert(0.92) hue-rotate(180deg) brightness(0.95) contrast(0.9)' : 'none' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href={OFFICE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all hover:-translate-y-0.5"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                border: `1px solid ${tok.cardBorder}`,
                color: tok.heading,
              }}
            >
              Get Directions
              <ExternalLink size={13} />
            </a>
          </motion.div>

        </div>
      </section>
    </div>
  )
}
