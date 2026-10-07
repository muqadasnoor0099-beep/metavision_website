'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { GlobeLive } from '@/components/ui/GlobeLive'
import { useTheme } from '@/components/providers/ThemeProvider'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const TITLE_WORDS = [['Trusted', 'by'], ['Industry', 'Leaders']]


// ── Component ─────────────────────────────────────────────────────────────
export default function WhyUsSection() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'

  // ── Token map ─────────────────────────────────────────────────────
  const tok = {
    sectionBg:      isDark ? '#060609'                      : '#f0f7ff',
    ambientA:       isDark ? 'rgba(37,99,235,0.07)'         : 'rgba(37,99,235,0.06)',
    ambientB:       isDark ? 'rgba(37,99,235,0.05)'         : 'rgba(37,99,235,0.04)',
    divider:        isDark ? '#3b82f6'                      : '#1d4ed8',
    heading:        isDark ? '#ffffff'                      : '#001851',
    body:           isDark ? 'rgba(255,255,255,0.55)'       : '#444651',
    btnFillBg:      isDark ? '#2563eb'                      : '#0035c6',
    btnFillHover:   isDark ? '#1d4ed8'                      : '#001851',
    btnFillColor:   '#ffffff',
    btnOutBorder:   isDark ? 'rgba(255,255,255,0.22)'       : '#747683',
    btnOutColor:    isDark ? 'rgba(255,255,255,0.82)'       : '#001851',
    btnOutHoverBg:  isDark ? 'rgba(255,255,255,0.07)'       : '#eff4ff',
    btnOutHoverBrd: isDark ? 'rgba(255,255,255,0.45)'       : '#1d4ed8',
    globeGlow:      isDark ? 'rgba(37,99,235,0.20)'         : 'rgba(37,99,235,0.10)',
    cardBg:         isDark ? 'rgba(255,255,255,0.04)'       : '#ffffff',
    cardBorder:     isDark ? 'rgba(59,130,246,0.18)'        : 'rgba(37,99,235,0.15)',
    cardShadow:     isDark ? '0 0 40px rgba(37,99,235,0.08)': '0 4px 32px rgba(37,99,235,0.08)',
    dividerLine:    isDark ? 'rgba(59,130,246,0.15)'        : 'rgba(37,99,235,0.12)',
    iconBg:         isDark ? 'rgba(37,99,235,0.15)'         : 'rgba(37,99,235,0.10)',
    iconBorder:     isDark ? 'rgba(59,130,246,0.22)'        : 'rgba(37,99,235,0.20)',
    iconColor:      isDark ? '#60a5fa'                      : '#1d4ed8',
    statValue:      isDark ? '#ffffff'                      : '#001851',
    statLabel:      isDark ? '#60a5fa'                      : '#1d4ed8',
    statDesc:       isDark ? 'rgba(255,255,255,0.40)'       : '#6b7280',
    glowPulse:      isDark ? '#2563eb'                      : '#3b82f6',
    glowOpacity:    isDark ? [0.12, 0.22, 0.12]             : [0.06, 0.12, 0.06],
  }

  return (
    <section
      className="relative py-32 overflow-hidden"
      style={{ backgroundColor: tok.sectionBg }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            `radial-gradient(ellipse 60% 50% at 80% 50%, ${tok.ambientA} 0%, transparent 70%),` +
            `radial-gradient(ellipse 40% 40% at 10% 80%, ${tok.ambientB} 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6">

        {/* ── Hero row ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">

          {/* Left: text */}
          <div className="lg:col-span-5 flex flex-col items-start gap-6">

            {/* Divider bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 48, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              style={{ backgroundColor: tok.divider, height: 3 }}
            />

            {/* Word-by-word title */}
            <h2
              style={{
                fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif',
                color: tok.heading,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
              className="text-4xl lg:text-5xl font-bold"
            >
              {TITLE_WORDS.map((line, li) => (
                <span key={li} className="block">
                  {line.map((word, wi) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ delay: (li * 2 + wi) * 0.1, duration: 0.55, ease: EASE_OUT }}
                      className="inline-block mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.35, duration: 0.55, ease: EASE_OUT }}
              style={{
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                color: tok.body,
                lineHeight: 1.7,
                fontSize: 17,
              }}
              className="max-w-lg"
            >
              From regional clinics to hospital chains, healthcare institutions worldwide rely on
              MetaVision to navigate complex operational landscapes with precision.
            </motion.p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                { href: '/products', label: 'Explore Our Solutions', filled: true },
                { href: '/contact',  label: 'Contact Us',            filled: false },
              ].map(({ href, label, filled }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: 0.45 + i * 0.1, duration: 0.5, ease: EASE_OUT }}
                >
                  <Link
                    href={href}
                    className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded group"
                    style={filled
                      ? { backgroundColor: tok.btnFillBg, color: tok.btnFillColor,
                          fontFamily: 'var(--font-inter), Inter, sans-serif',
                          transition: 'background-color 0.2s, transform 0.15s' }
                      : { border: `1px solid ${tok.btnOutBorder}`, color: tok.btnOutColor,
                          fontFamily: 'var(--font-inter), Inter, sans-serif',
                          transition: 'background-color 0.2s, border-color 0.2s, transform 0.15s' }
                    }
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      if (filled) { e.currentTarget.style.backgroundColor = tok.btnFillHover }
                      else { e.currentTarget.style.backgroundColor = tok.btnOutHoverBg; e.currentTarget.style.borderColor = tok.btnOutHoverBrd }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      if (filled) { e.currentTarget.style.backgroundColor = tok.btnFillBg }
                      else { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = tok.btnOutBorder }
                    }}
                  >
                    {label}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: globe */}
          <motion.div
            className="lg:col-span-7 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: EASE_OUT }}
          >
            <div className="relative w-full max-w-[520px]">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${tok.globeGlow} 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                  transform: 'scale(1.1)',
                }}
              />

              <GlobeLive className="w-full" speed={0.004} darkMode={isDark} />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
