'use client'

import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import CTABanner from '@/components/home/CTABanner'
import { useTheme } from '@/components/providers/ThemeProvider'

const TIMELINE = [
  { year: '2024', title: 'HA EngagePro', description: 'Delivered HA EngagePro, an end-to-end client lifecycle platform — from project initiation to secure, authenticated engagement tracking.' },
  { year: '2025', title: 'NexLink MedAI', description: 'Launched NexLink MedAI, our AI-powered telemedicine and prescription platform, onboarding 50+ clinics in the first 6 months.' },
  { year: '2025', title: 'NexLink Clinical Intelligence', description: 'Introduced NexLink Clinical Intelligence, transforming messy EHR records into a structured, FHIR-ready clinical data backbone.' },
  { year: '2026', title: 'Oil & Gas Dashboards', description: 'Expanded into industrial intelligence with real-time Oil & Gas dashboards for production monitoring and enterprise analytics.' },
]

const TEAM = [
  {
    initials: 'MN',
    name: 'Mustafa Nawaz Khokhar',
    role: 'CEO & Founder',
    badge: 'Founder',
    desc: 'Visionary leader driving MetaVision\'s mission to democratise AI across the healthcare and finance sectors.',
    featured: true,
    ai: false,
  },
  {
    initials: 'FA',
    name: 'Faisal Ayub',
    role: 'Co-Founder & Managing Director',
    badge: 'Co-Founder',
    desc: 'Strategic architect overseeing operations and growth, ensuring MetaVision scales with precision and purpose.',
    featured: false,
    ai: false,
  },
  {
    initials: 'OI',
    name: 'Dr. Omer Ishaq',
    role: 'HOD ML & AI',
    badge: 'AI / ML',
    desc: 'PhD-level AI architect engineering the intelligence layer that powers every MetaVision product and model.',
    featured: false,
    ai: true,
  },
]

const UNIQUE = [
  { icon: '🧠', title: 'AI at the Core', body: "Our AI isn't a feature — it's the foundation every product is built on." },
  { icon: '🛡️', title: 'Compliance-Ready', body: 'Built for evolving data protection and regulatory standards — compliance out of the box.' },
  { icon: '⚡', title: 'Speed to Value', body: 'Most clients go live in under 48 hours. No 6-month implementations.' },
]

type TeamMember = typeof TEAM[0]

function TeamCard({ member, delay }: { member: TeamMember; delay: number }) {
  const tiltRef = useRef<HTMLDivElement>(null)
  const { theme, mounted } = useTheme()
  const isDark = !mounted || theme === 'dark'

  // Brand blue or cyan per member
  const C  = member.ai ? '34,211,238' : '37,99,235'
  const C2 = member.ai ? '96,165,250' : '96,165,250'

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current
    if (!el) return
    const r  = el.getBoundingClientRect()
    const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2
    const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2
    el.style.transform = `perspective(900px) rotateY(${dx * 12}deg) rotateX(${-dy * 12}deg) translateZ(10px) scale(1.015)`
    const spot = el.querySelector<HTMLElement>('[data-spot]')
    if (spot) {
      spot.style.setProperty('--mx', `${((e.clientX - r.left) / r.width)  * 100}%`)
      spot.style.setProperty('--my', `${((e.clientY - r.top)  / r.height) * 100}%`)
    }
  }, [])

  const onLeave = useCallback(() => {
    const el = tiltRef.current
    if (!el) return
    el.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)'
    el.style.transform  = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0) scale(1)'
  }, [])

  const onEnter = useCallback(() => {
    if (tiltRef.current) tiltRef.current.style.transition = 'transform 0.12s ease'
  }, [])

  const cardBg   = isDark ? 'rgba(8,8,13,0.97)' : 'rgba(240,247,255,0.98)'
  const nameClr  = isDark ? '#ffffff' : '#0f172a'
  const descClr  = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(15,23,42,0.5)'
  const dotGrid  = isDark
    ? 'radial-gradient(circle, rgba(37,99,235,0.07) 1px, transparent 1px)'
    : 'radial-gradient(circle, rgba(37,99,235,0.11) 1px, transparent 1px)'
  const avatarClr = member.ai
    ? (isDark ? '#22d3ee' : '#0891b2')
    : (isDark ? '#93c5fd' : '#2563eb')
  const badgeClr  = member.ai
    ? (isDark ? '#22d3ee' : '#0891b2')
    : '#2563eb'

  const corners = [
    { pos: 'top-2.5 left-2.5',    border: { borderTop: `1.5px solid rgba(${C},0.4)`, borderLeft:  `1.5px solid rgba(${C},0.4)` } },
    { pos: 'top-2.5 right-2.5',   border: { borderTop: `1.5px solid rgba(${C},0.4)`, borderRight: `1.5px solid rgba(${C},0.4)` } },
    { pos: 'bottom-2.5 left-2.5', border: { borderBottom: `1.5px solid rgba(${C},0.4)`, borderLeft:  `1.5px solid rgba(${C},0.4)` } },
    { pos: 'bottom-2.5 right-2.5',border: { borderBottom: `1.5px solid rgba(${C},0.4)`, borderRight: `1.5px solid rgba(${C},0.4)` } },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7, type: 'spring', stiffness: 180, damping: 18 }}
    >
      <div
        ref={tiltRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={onEnter}
        style={{
          padding: '1.5px',
          borderRadius: '26px',
          background: `conic-gradient(from var(--team-ba), rgba(${C},0.04) 0%, rgba(${C},0.65) 15%, rgba(${C2},0.9) 25%, rgba(${C},0.65) 35%, rgba(${C},0.04) 50%, rgba(${C},0.04) 100%)`,
          animation: 'team-border 5s linear infinite',
          width: member.featured ? '292px' : '268px',
          willChange: 'transform',
          flexShrink: 0,
          boxShadow: member.featured
            ? `0 0 60px rgba(${C},0.08), 0 30px 80px ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(37,99,235,0.1)'}`
            : undefined,
        }}
      >
        <div style={{
          background: cardBg,
          borderRadius: '25px',
          padding: '40px 26px 36px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
        }}>
          {/* Mouse spotlight */}
          <div data-spot="" style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle 200px at var(--mx,-200px) var(--my,-200px), rgba(${C},${isDark ? 0.09 : 0.06}), transparent 70%)`,
            pointerEvents: 'none', zIndex: 1,
          }} />

          {/* Dot-grid texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            backgroundImage: dotGrid,
            backgroundSize: '24px 24px',
          }} />

          {/* Scan line */}
          <div style={{
            position: 'absolute', top: 0, left: '-60%',
            width: '60%', height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(${C},0.5), transparent)`,
            animation: 'team-scan 3.5s ease-in-out infinite',
            animationDelay: `${delay * 0.6}s`,
            zIndex: 2,
          }} />

          {/* Corner brackets */}
          {corners.map(({ pos, border }, i) => (
            <div key={i} className={`absolute w-3.5 h-3.5 ${pos}`} style={{ ...border, zIndex: 4 }} />
          ))}

          {/* ── Avatar ── */}
          <div style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 28px', zIndex: 3 }}>
            {/* Breathing rings */}
            {[{ inset: '-10px', a: 0.2 }, { inset: '-22px', a: 0.1 }].map(({ inset, a }, i) => (
              <div key={i} style={{
                position: 'absolute', inset, borderRadius: '50%',
                border: `1px solid rgba(${C},${a})`,
                animation: 'team-breathe 2.5s ease-in-out infinite',
                animationDelay: `${i * 0.45}s`,
              }} />
            ))}

            {/* Orbit track + satellite */}
            <div style={{
              position: 'absolute', inset: '-18px', borderRadius: '50%',
              border: `1px dashed rgba(${C},${member.featured ? 0.22 : 0.14})`,
              animation: `team-orbit ${member.featured ? 4 : member.ai ? 5 : 6}s linear infinite`,
              animationDirection: member.ai ? 'reverse' : 'normal',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: '50%',
                width: 8, height: 8, transform: 'translate(-50%,-50%)',
                borderRadius: '50%',
                background: member.ai
                  ? 'radial-gradient(circle,#67e8f9,#22d3ee)'
                  : 'radial-gradient(circle,#93c5fd,#2563eb)',
                boxShadow: `0 0 8px rgba(${C},0.9), 0 0 20px rgba(${C},0.5)`,
              }} />
            </div>

            {/* Initials circle */}
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: `linear-gradient(135deg, rgba(${C},${member.featured ? 0.22 : 0.13}), rgba(${C},0.04))`,
              border: `2px solid rgba(${C},${member.featured ? 0.65 : 0.42})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 800, letterSpacing: '-1px',
              color: avatarClr,
              position: 'relative', zIndex: 2,
              textShadow: `0 0 20px rgba(${C},0.4)`,
              fontFamily: 'var(--font-heading)',
              boxShadow: member.featured
                ? `0 0 30px rgba(${C},0.15), inset 0 0 30px rgba(${C},0.06)`
                : undefined,
            }}>
              {member.initials}
            </div>
          </div>

          {/* Role badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `rgba(${C},0.07)`,
            border: `1px solid rgba(${C},0.22)`,
            borderRadius: 999, padding: '4px 12px',
            fontSize: 9, fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase',
            color: badgeClr,
            marginBottom: 12, position: 'relative', zIndex: 3,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', display: 'inline-block',
              background: badgeClr,
              animation: 'team-blink 1.8s ease-in-out infinite',
            }} />
            {member.badge}
          </div>

          {/* Name */}
          <div style={{
            fontSize: member.featured ? 19 : 17,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            marginBottom: 7,
            position: 'relative', zIndex: 3,
            color: nameClr,
            fontFamily: 'var(--font-heading)',
          }}>
            {member.name}
          </div>

          {/* Role gradient text */}
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: '1.8px', textTransform: 'uppercase',
            background: member.ai
              ? 'linear-gradient(90deg,#22d3ee,#60a5fa)'
              : 'linear-gradient(90deg,#2563eb,#60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 20, position: 'relative', zIndex: 3,
          }}>
            {member.role}
          </div>

          {/* Divider */}
          <div style={{
            width: 36, height: 1, margin: '0 auto 18px',
            background: `linear-gradient(90deg,transparent,rgba(${C},0.45),transparent)`,
            position: 'relative', zIndex: 3,
          }} />

          {/* Description */}
          <p style={{
            fontSize: 12, lineHeight: 1.75,
            color: descClr,
            position: 'relative', zIndex: 3,
          }}>
            {member.desc}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-28 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.07),transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">About MetaVision</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold font-heading tracking-tight mb-6">
              <span className="text-white">We Build Software </span>
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">That Thinks</span>
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-2xl mx-auto">
              MetaVision is an AI-first software company dedicated to transforming how healthcare professionals and chartered accountants work. We believe the best tools should feel like extensions of your expertise — fast, intelligent, and invisible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-4 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              tag: 'Our Mission',
              body: 'To empower organizations with cutting-edge IT solutions and intelligent AI systems that solve real-world challenges — delivering measurable impact through innovation, security, and excellence.',
            },
            {
              tag: 'Our Vision',
              body: 'To be the most trusted technology partner in the region, shaping a future where AI-driven transformation enables governments, enterprises, and communities to reach their full potential.',
            },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="text-gold text-[10px] font-bold tracking-widest uppercase mb-3">{card.tag}</div>
                <p className="text-white/70 text-base leading-relaxed">{card.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader overline="Our Journey" title="How We" titleGold="Got Here" />
        <div className="mt-14 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gold/10" />
          <div className="flex flex-col gap-10">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`relative flex flex-col md:flex-row gap-6 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="md:w-1/2" />
                <div className="absolute left-1 md:left-1/2 w-3 h-3 rounded-full bg-gold border-2 border-[#060609] md:-translate-x-1.5 mt-2 z-10" />
                <div className="pl-10 md:pl-0 md:w-1/2">
                  <GlassCard>
                    <div className="text-gold font-bold text-sm mb-1">{item.year}</div>
                    <div className="text-white font-semibold mb-2">{item.title}</div>
                    <p className="text-white/45 text-sm leading-relaxed">{item.description}</p>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes us unique */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader overline="Our Edge" title="What Makes Us" titleGold="Different" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {UNIQUE.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard hover>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-white font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{item.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader overline="The Team" title="The Minds" titleGold="Behind MetaVision" />
        <div className="flex flex-wrap justify-center items-center gap-6 mt-14">
          {TEAM.map((member, i) => (
            <TeamCard key={i} member={member} delay={i * 0.15} />
          ))}
        </div>
      </section>

      <CTABanner />
    </div>
  )
}
