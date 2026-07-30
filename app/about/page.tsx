'use client'

import { useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
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

// ── "What Makes Us Different" bento data ─────────────────────────────────────
const UNIQUE = [
  {
    num: '01', title: 'AI at the Core',
    body: "Intelligence isn't a feature we bolt on — it's the substrate every product is built on. From inference to insight, AI runs through everything we ship.",
    metric: '100% AI-Native', rgb: '37,99,235', glow: '#3b82f6', large: true,
  },
  {
    num: '02', title: 'Compliance-Ready',
    body: 'Security and regulatory compliance are baked in at the architecture level — not added as an afterthought.',
    metric: 'Zero-Config Security', rgb: '124,58,237', glow: '#a78bfa', large: false,
  },
  {
    num: '03', title: 'Speed to Value',
    body: 'Most clients go live in under 48 hours. No six-month implementations, no endless discovery sprints.',
    metric: '< 48 hr Go-Live', rgb: '217,119,6', glow: '#f59e0b', large: false,
  },
]

// ── Neural-net SVG (AI card illustration) ─────────────────────────────────────
const NN_NODES = [
  { cx: 28,  cy: 48  }, { cx: 28,  cy: 100 }, { cx: 28,  cy: 152 },
  { cx: 100, cy: 24  }, { cx: 100, cy: 88  }, { cx: 100, cy: 140 }, { cx: 100, cy: 176 },
  { cx: 172, cy: 48  }, { cx: 172, cy: 112 }, { cx: 172, cy: 164 },
  { cx: 240, cy: 80  }, { cx: 240, cy: 140 },
]
const NN_EDGES = [
  [0,3],[0,4],[1,3],[1,4],[1,5],[2,4],[2,5],[2,6],
  [3,7],[3,8],[4,7],[4,8],[4,9],[5,8],[5,9],[6,9],
  [7,10],[7,11],[8,10],[8,11],[9,11],
]

function NeuralNetIllustration() {
  return (
    <svg viewBox="0 0 268 200" fill="none" aria-hidden="true"
      className="w-full" style={{ maxHeight: 110 }}>
      {NN_EDGES.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={NN_NODES[a].cx} y1={NN_NODES[a].cy}
          x2={NN_NODES[b].cx} y2={NN_NODES[b].cy}
          stroke="#3b82f6" strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.25 }}
          transition={{ duration: 1.2, delay: i * 0.04, ease: 'easeOut' }}
        />
      ))}
      {NN_NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.cx} cy={n.cy} r={i === 4 || i === 8 ? 6 : 4}
          fill="#1d4ed8"
          stroke="#3b82f6" strokeWidth="1.2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.06, type: 'spring', stiffness: 260 }}
          style={{ filter: i === 4 || i === 8 ? 'drop-shadow(0 0 6px #3b82f6)' : undefined }}
        />
      ))}
      {/* Travelling signal dots on two edges */}
      {[[0,3],[4,8]].map(([a,b], k) => (
        <motion.circle key={`sig${k}`} r="2.5" fill="#93c5fd"
          style={{ filter: 'drop-shadow(0 0 4px #60a5fa)' }}
          animate={{
            cx: [NN_NODES[a].cx, NN_NODES[b].cx, NN_NODES[a].cx],
            cy: [NN_NODES[a].cy, NN_NODES[b].cy, NN_NODES[a].cy],
          }}
          transition={{ duration: 2.4, delay: k * 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

// ── Shield SVG (Compliance card) ──────────────────────────────────────────────
function ShieldIllustration() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" className="w-12 h-12 lg:w-16 lg:h-16">
      <motion.path
        d="M40 8 L64 18 L64 38 C64 54 40 68 40 68 C40 68 16 54 16 38 L16 18 Z"
        stroke="#a78bfa" strokeWidth="2" fill="rgba(124,58,237,0.1)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
      <motion.path
        d="M28 40 L36 48 L52 32"
        stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 1.4, ease: 'easeOut' }}
      />
    </svg>
  )
}

// ── Speed arc SVG (Speed card) ────────────────────────────────────────────────
function SpeedIllustration() {
  const circumference = 2 * Math.PI * 26
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" className="w-12 h-12 lg:w-16 lg:h-16">
      <circle cx="40" cy="40" r="26" stroke="rgba(217,119,6,0.15)" strokeWidth="5" />
      <motion.circle
        cx="40" cy="40" r="26"
        stroke="#f59e0b" strokeWidth="5" strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * 0.22 }}
        transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '40px 40px', transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 4px #f59e0b)' }}
      />
      <motion.text x="40" y="45" textAnchor="middle"
        fill="#fcd34d" fontSize="13" fontWeight="800" fontFamily="var(--font-heading)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}>
        48h
      </motion.text>
    </svg>
  )
}

// ── Bento card ────────────────────────────────────────────────────────────────
function UniqueCard({
  item, index, large = false,
}: {
  item: typeof UNIQUE[0]; index: number; large?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const { theme, mounted } = useTheme()
  const isDark = !mounted || theme === 'dark'

  const cardBg  = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff'
  const border  = isDark ? `rgba(${item.rgb},0.18)` : `rgba(${item.rgb},0.14)`
  const titleC  = isDark ? '#ffffff' : '#0f172a'
  const bodyC   = isDark ? 'rgba(255,255,255,0.45)' : '#64748b'
  const numC    = isDark ? `rgba(${item.rgb},0.06)` : `rgba(${item.rgb},0.05)`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.13, duration: 0.65, type: 'spring', stiffness: 190, damping: 22 }}
      className="h-full"
    >
      <div
        className="relative overflow-hidden rounded-[22px] h-full flex flex-col"
        style={{
          background: cardBg,
          border: `1px solid ${border}`,
          boxShadow: isDark ? 'none' : `0 4px 28px rgba(${item.rgb},0.06)`,
          transition: 'transform 0.28s ease, box-shadow 0.28s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)'
          e.currentTarget.style.boxShadow = `0 20px 52px rgba(${item.rgb},${isDark ? 0.18 : 0.13})`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = isDark ? 'none' : `0 4px 28px rgba(${item.rgb},0.06)`
        }}
      >
        {/* Glowing top bar */}
        <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-[22px]"
          style={{ background: `linear-gradient(90deg,transparent,${item.glow},transparent)`, opacity: 0.9 }} />
        {/* Ambient bloom */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-10 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%,rgba(${item.rgb},0.14),transparent 70%)` }} />

        {/* Watermark number */}
        <div className="absolute top-0 right-3 leading-none pointer-events-none select-none font-heading"
          style={{ fontSize: large ? 90 : 80, fontWeight: 900, color: numC, letterSpacing: '-4px', lineHeight: 1 }}>
          <span className="hidden lg:inline" style={{ fontSize: large ? 140 : 110 }}>{item.num}</span>
          <span className="lg:hidden">{item.num}</span>
        </div>

        {/* Illustration zone */}
        <div className={`relative z-10 flex items-center justify-center ${large ? 'py-6 px-6 lg:py-9 lg:px-9' : 'py-4 px-5 lg:py-7 lg:px-7'}`}
          style={{ minHeight: large ? 120 : 90 }}>
          {index === 0 && <NeuralNetIllustration />}
          {index === 1 && <ShieldIllustration />}
          {index === 2 && <SpeedIllustration />}
        </div>

        {/* Divider */}
        <div className="mx-4 lg:mx-6" style={{ height: 1, background: `linear-gradient(90deg,transparent,rgba(${item.rgb},0.25),transparent)` }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col flex-1 p-4 lg:p-6" style={{ gap: 8 }}>
          {/* Number badge */}
          <div className="text-[9px] lg:text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{ color: item.glow }}>
            {item.num}
          </div>

          <div className="font-heading font-bold" style={{ fontSize: large ? 17 : 14, letterSpacing: '-0.03em', color: titleC, lineHeight: 1.2 }}>
            <span className="lg:hidden">{item.title}</span>
            <span className="hidden lg:inline" style={{ fontSize: large ? 22 : 17 }}>{item.title}</span>
          </div>

          <p className="text-[12px] lg:text-[13px] leading-relaxed flex-1" style={{ color: bodyC }}>
            {item.body}
          </p>

          {/* Metric chip */}
          <div className="inline-flex items-center gap-1.5 lg:gap-2 self-start rounded-full px-2.5 lg:px-3.5 py-1 lg:py-1.5 mt-1"
            style={{
              background: `rgba(${item.rgb},0.10)`,
              border: `1px solid rgba(${item.rgb},0.25)`,
              fontSize: 10, fontWeight: 700, color: item.glow,
            }}>
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.4 }}
              className="rounded-full"
              style={{ width: 6, height: 6, background: item.glow, boxShadow: `0 0 6px ${item.glow}`, display: 'inline-block', flexShrink: 0 }}
            />
            {item.metric}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

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

      {/* What makes us unique — bento grid */}
      <section className="py-20 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%,rgba(37,99,235,0.04),transparent)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader overline="Our Edge" title="What Makes Us" titleGold="Different" />

          {/* Desktop bento: large card left, two small cards right
              Mobile: horizontal snap-scroll row */}
          <div
            className="mt-14 grid gap-5
              grid-cols-1
              lg:grid-cols-[1.55fr_1fr] lg:grid-rows-2"
          >
            {/* Card 01 — large, spans both rows on desktop */}
            <div className="lg:row-span-2">
              <UniqueCard item={UNIQUE[0]} index={0} large />
            </div>

            {/* Card 02 */}
            <div>
              <UniqueCard item={UNIQUE[1]} index={1} />
            </div>

            {/* Card 03 */}
            <div>
              <UniqueCard item={UNIQUE[2]} index={2} />
            </div>
          </div>
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
