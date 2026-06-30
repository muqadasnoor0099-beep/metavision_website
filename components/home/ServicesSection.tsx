'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type MotionValue,
} from 'framer-motion'
import { Brain, Calculator, Gauge, Cpu, LayoutDashboard, Cloud } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const SERVICES = [
  {
    icon: Brain,
    num: '01',
    title: 'Medical AI Systems',
    tag: 'Healthcare',
    description:
      'Smart healthcare software that simplifies prescriptions, records, and patient management using AI-powered workflows.',
    accent: '#3b82f6',
  },
  {
    icon: Calculator,
    num: '02',
    title: 'CA Finance Software',
    tag: 'Finance',
    description:
      'Modern financial systems for accounting firms with intelligent reporting, taxation workflows, and analytics.',
    accent: '#a78bfa',
  },
  {
    icon: Gauge,
    num: '03',
    title: 'Oil & Gas Dashboards',
    tag: 'Industrial',
    description:
      'Real-time industrial dashboards for monitoring operations, production data, and enterprise analytics.',
    accent: '#fb923c',
  },
  {
    icon: Cpu,
    num: '04',
    title: 'AI Enterprise Solutions',
    tag: 'AI & ML',
    description:
      'Custom AI-powered software solutions designed for modern businesses and automation systems.',
    accent: '#22d3ee',
  },
  {
    icon: LayoutDashboard,
    num: '05',
    title: 'Dashboard UI / UX',
    tag: 'Design',
    description:
      'Beautiful, data-driven dashboards with modern UX and real-time visualization experiences.',
    accent: '#34d399',
  },
  {
    icon: Cloud,
    num: '06',
    title: 'Cloud Infrastructure',
    tag: 'Cloud',
    description:
      'Scalable cloud systems and secure enterprise deployment architecture for mission-critical workloads.',
    accent: '#f472b6',
  },
] as const

/* ─────────────────────────────────────────
   MOBILE CARD — whileInView, no scroll dep
───────────────────────────────────────── */
function MobileCard({
  service,
  index,
  isDark,
}: {
  service: (typeof SERVICES)[number]
  index: number
  isDark: boolean
}) {
  const Icon      = service.icon
  const cardBg    = isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.82)'
  const cardBorder= isDark ? 'rgba(255,255,255,0.075)' : `${service.accent}28`
  const cardShadow= isDark ? 'none' : `0 3px 14px rgba(0,0,0,0.05)`
  const titleColor= isDark ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.88)'
  const descColor = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(15,23,42,0.55)'
  const numColor  = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: cardShadow,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '0.875rem',
      }}
      className="relative flex flex-col gap-3 p-4 overflow-hidden"
    >
      {/* Top glow line */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-40 pointer-events-none"
        style={{ background: `linear-gradient(90deg,transparent,${service.accent}80,transparent)` }}
      />

      {/* Number */}
      <span
        className="absolute top-3 right-3 text-[10px] font-bold tabular-nums pointer-events-none"
        style={{ color: numColor }}
      >
        {service.num}
      </span>

      {/* Icon */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: `${service.accent}16`,
          border: `1px solid ${service.accent}38`,
          boxShadow: `0 0 12px ${service.accent}14`,
        }}
      >
        <Icon size={17} style={{ color: service.accent }} />
      </div>

      {/* Tag */}
      <span
        className="self-start text-[8px] font-bold tracking-[0.20em] uppercase px-2 py-0.5 rounded-full"
        style={{
          color: service.accent,
          background: `${service.accent}12`,
          border: `1px solid ${service.accent}28`,
        }}
      >
        {service.tag}
      </span>

      {/* Title */}
      <h3
        className="text-[13px] font-bold leading-snug"
        style={{ color: titleColor, fontFamily: 'var(--font-sora), sans-serif' }}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-[11px] leading-[1.65]" style={{ color: descColor }}>
        {service.description}
      </p>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   DESKTOP CARD — scroll-progress driven
───────────────────────────────────────── */
function ServiceCard({
  service,
  index,
  sp,
  isDark,
}: {
  service: (typeof SERVICES)[number]
  index: number
  sp: MotionValue<number>
  isDark: boolean
}) {
  const Icon  = service.icon
  const col   = index % 3
  const row   = Math.floor(index / 3)

  const t0    = 0.26 + col * 0.04 + row * 0.025
  const t1    = t0 + 0.10

  const opacity = useTransform(sp, [t0, t1], [0, 1])
  const y       = useTransform(sp, [t0, t1], [30, 0])
  const scale   = useTransform(sp, [t0, t1], [0.94, 1])
  const hoverY  = useMotionValue(0)

  const cardBg     = isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.82)'
  const cardBorder = isDark ? 'rgba(255,255,255,0.075)' : `${service.accent}28`
  const cardShadow = isDark ? 'none' : `0 4px 18px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)`
  const numColor   = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)'
  const titleColor = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.88)'
  const descColor  = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(15,23,42,0.55)'

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y: useTransform([y, hoverY], ([a, b]) => (a as number) + (b as number)),
        willChange: 'transform, opacity',
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: cardShadow,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '1rem',
        translateZ: 0,
      }}
      className="group relative flex flex-col gap-4 p-6 cursor-default select-none overflow-hidden"
      onHoverStart={() => hoverY.set(-7)}
      onHoverEnd={() => hoverY.set(0)}
      whileHover={{
        boxShadow: `0 26px 60px ${service.accent}22, 0 6px 20px rgba(0,0,0,${isDark ? '0.45' : '0.12'})`,
        borderColor: `${service.accent}40`,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(90deg,transparent,${service.accent}90,transparent)` }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%,${service.accent}10 0%,transparent 70%)` }}
      />

      <span
        className="absolute top-5 right-5 text-[11px] font-bold tabular-nums pointer-events-none"
        style={{ color: numColor }}
      >
        {service.num}
      </span>

      <div
        className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: `${service.accent}16`,
          border: `1px solid ${service.accent}38`,
          boxShadow: `0 0 18px ${service.accent}18`,
        }}
      >
        <Icon size={20} style={{ color: service.accent }} />
      </div>

      <span
        className="relative z-10 self-start text-[9px] font-bold tracking-[0.22em] uppercase px-2.5 py-1 rounded-full"
        style={{
          color: service.accent,
          background: `${service.accent}12`,
          border: `1px solid ${service.accent}28`,
        }}
      >
        {service.tag}
      </span>

      <h3
        className="relative z-10 text-[15px] font-bold leading-snug"
        style={{ color: titleColor, fontFamily: 'var(--font-sora), sans-serif' }}
      >
        {service.title}
      </h3>

      <p className="relative z-10 text-[12.5px] leading-[1.72]" style={{ color: descColor }}>
        {service.description}
      </p>

      <div
        className="relative z-10 mt-auto pt-1 flex items-center gap-1.5 text-[11px] font-semibold
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color: service.accent }}
      >
        Learn more
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   SECTION
───────────────────────────────────────── */
export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { theme, mounted } = useTheme()
  const isDark = !mounted || theme === 'dark'

  const { scrollYProgress: raw } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const sp = useSpring(raw, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const introOpacity = useTransform(sp, [0, 0.10, 0.20], [1, 1, 0])
  const introScale   = useTransform(sp, [0, 0.20], [1, 0.88])
  const introY       = useTransform(sp, [0, 0.20], [0, -24])
  const mainOpacity  = useTransform(sp, [0.14, 0.28], [0, 1])
  const mainY        = useTransform(sp, [0.14, 0.28], [20, 0])
  const leftX        = useTransform(sp, [0.14, 0.28], [-28, 0])

  /* theme-aware colors */
  const sectionBg      = isDark ? '#06060f' : '#f0f8ff'
  const introHeadGrad  = isDark
    ? 'linear-gradient(160deg,#ffffff 0%,rgba(255,255,255,0.42) 100%)'
    : 'linear-gradient(160deg,#0f172a 0%,rgba(15,23,42,0.65) 100%)'
  const introSubColor  = isDark ? 'rgba(255,255,255,0.36)' : 'rgba(15,23,42,0.52)'
  const scrollLineClr  = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.20)'
  const scrollLabelClr = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(15,23,42,0.28)'
  const leftHeadColor  = isDark ? '#fff' : '#0f172a'
  const leftDescColor  = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.55)'
  const leftStatNum    = isDark ? '#fff' : '#0f172a'
  const leftStatLabel  = isDark ? 'rgba(255,255,255,0.30)' : 'rgba(15,23,42,0.40)'
  const blobBlue       = isDark ? '#3b82f63a' : '#3b82f614'
  const blobPurple     = isDark ? '#a78bfa2e' : '#a78bfa10'
  const blobCyan       = isDark ? '#22d3ee20' : '#22d3ee0c'

  return (
    <>
      {/* ══════════════════════════════════════
          MOBILE  (hidden on lg+)
          Simple flat layout, no sticky scroll
      ══════════════════════════════════════ */}
      <section
        className="lg:hidden relative py-16 px-5 overflow-hidden"
        style={{ background: sectionBg }}
      >
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div style={{ position:'absolute', width:340,height:340,top:'-8%',left:'-20%',
            background:`radial-gradient(circle,${blobBlue} 0%,transparent 70%)`,
            borderRadius:'50%',filter:'blur(70px)' }} />
          <div style={{ position:'absolute', width:280,height:280,bottom:'5%',right:'-12%',
            background:`radial-gradient(circle,${blobPurple} 0%,transparent 70%)`,
            borderRadius:'50%',filter:'blur(60px)' }} />
          <div style={{ position:'absolute', width:220,height:220,top:'45%',right:'20%',
            background:`radial-gradient(circle,${blobCyan} 0%,transparent 70%)`,
            borderRadius:'50%',filter:'blur(50px)' }} />
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55 }}
          className="text-center mb-8 relative z-10"
        >
          <p
            className="text-[9px] font-semibold tracking-[0.28em] uppercase mb-3 flex items-center justify-center gap-2"
            style={{ color: '#3b82f6' }}
          >
            <span className="w-4 h-px" style={{ background: '#3b82f6' }} />
            What We Build
            <span className="w-4 h-px" style={{ background: '#3b82f6' }} />
          </p>
          <h2
            className="font-extrabold leading-tight tracking-tight mb-3"
            style={{
              fontSize: 'clamp(26px,7vw,34px)',
              fontFamily: 'var(--font-sora),sans-serif',
              color: leftHeadColor,
            }}
          >
            Our{' '}
            <span style={{
              backgroundImage: 'linear-gradient(110deg,#3b82f6 0%,#a78bfa 55%,#22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Services
            </span>
          </h2>
          <p
            className="text-[12px] leading-relaxed mx-auto"
            style={{ maxWidth: 260, color: introSubColor }}
          >
            Enterprise AI solutions for healthcare, finance, and industrial sectors.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center gap-8 mb-8 relative z-10"
        >
          {([['6+','Industries'],['50+','Clients'],['99%','Uptime']] as const).map(([n,l]) => (
            <div key={l} className="text-center">
              <div
                className="text-[22px] font-extrabold leading-none"
                style={{ fontFamily:'var(--font-sora),sans-serif', color: leftStatNum }}
              >
                {n}
              </div>
              <div className="text-[9px] mt-1" style={{ color: leftStatLabel }}>{l}</div>
            </div>
          ))}
        </motion.div>

        {/* 2-column card grid */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          {SERVICES.map((s, i) => (
            <MobileCard key={s.title} service={s} index={i} isDark={isDark} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          DESKTOP  (hidden below lg)
          Sticky cinematic scroll experience
      ══════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="hidden lg:block relative"
        style={{ height: '200vh', background: sectionBg }}
      >
        <div
          className="sticky top-0 h-screen overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          {/* Background */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.3) 1px,transparent 1px)',
                backgroundSize: '34px 34px',
                opacity: isDark ? 0.045 : 0.08,
              }}
            />
            <div className="absolute" style={{ width:720,height:720,top:'-12%',left:'-6%',
              background:`radial-gradient(circle,${blobBlue} 0%,transparent 70%)`,
              borderRadius:'50%',filter:'blur(90px)' }} />
            <div className="absolute" style={{ width:580,height:580,bottom:'-8%',right:'-4%',
              background:`radial-gradient(circle,${blobPurple} 0%,transparent 70%)`,
              borderRadius:'50%',filter:'blur(80px)' }} />
            <div className="absolute" style={{ width:360,height:360,top:'40%',right:'28%',
              background:`radial-gradient(circle,${blobCyan} 0%,transparent 70%)`,
              borderRadius:'50%',filter:'blur(58px)' }} />
            <div className="absolute inset-x-0 top-0 h-28"
              style={{ background:`linear-gradient(to bottom,${sectionBg},transparent)` }} />
            <div className="absolute inset-x-0 bottom-0 h-28"
              style={{ background:`linear-gradient(to top,${sectionBg},transparent)` }} />
          </div>

          {/* Intro state */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
            style={{ opacity: introOpacity, scale: introScale, y: introY, willChange: 'transform,opacity' }}
          >
            <p
              className="text-[10px] font-semibold tracking-[0.28em] uppercase mb-4 flex items-center gap-2"
              style={{ color: '#3b82f6' }}
            >
              <span className="w-4 h-px" style={{ background: '#3b82f6' }} />
              What We Build
              <span className="w-4 h-px" style={{ background: '#3b82f6' }} />
            </p>
            <h2
              className="text-center font-extrabold leading-[0.96] tracking-tight"
              style={{
                fontSize: 'clamp(60px,9vw,120px)',
                fontFamily: 'var(--font-sora),sans-serif',
                backgroundImage: introHeadGrad,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Our<br />Services
            </h2>
            <p
              className="mt-5 text-center text-[14px] leading-[1.8] max-w-[360px]"
              style={{ color: introSubColor }}
            >
              Enterprise AI solutions for healthcare, finance, and industrial sectors.
            </p>
            <motion.div
              className="mt-14 flex flex-col items-center gap-1.5"
              animate={{ y: [0, 9, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            >
              <div className="w-px h-10" style={{
                background: `linear-gradient(to bottom,transparent,${scrollLineClr},transparent)`,
              }} />
              <span className="text-[9px] tracking-[0.25em] uppercase" style={{ color: scrollLabelClr }}>
                Scroll
              </span>
            </motion.div>
          </motion.div>

          {/* Main state */}
          <motion.div
            className="absolute inset-0 flex z-20"
            style={{ opacity: mainOpacity, y: mainY, willChange: 'transform,opacity' }}
          >
            {/* Left column */}
            <motion.div
              className="flex w-[36%] shrink-0 flex-col justify-center pl-[5.5vw] pr-8"
              style={{ x: leftX, willChange: 'transform' }}
            >
              <p
                className="text-[10px] font-semibold tracking-[0.26em] uppercase mb-4 flex items-center gap-2"
                style={{ color: '#3b82f6' }}
              >
                <span className="w-3 h-px inline-block" style={{ background: '#3b82f6' }} />
                Our Services
              </p>
              <h2
                className="font-extrabold leading-[1.02] tracking-tight mb-5"
                style={{
                  fontSize: 'clamp(34px,3vw,50px)',
                  fontFamily: 'var(--font-sora),sans-serif',
                  color: leftHeadColor,
                }}
              >
                Enterprise AI<br />
                <span style={{
                  backgroundImage: 'linear-gradient(110deg,#3b82f6 0%,#a78bfa 55%,#22d3ee 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Solutions
                </span>
              </h2>
              <p
                className="text-[13px] leading-[1.8] mb-8 max-w-[260px]"
                style={{ color: leftDescColor }}
              >
                Metavision engineers intelligent systems powering the next generation of healthcare, finance, and industrial enterprises.
              </p>
              <div className="flex gap-7 mb-8">
                {([['6+','Industries'],['50+','Clients'],['99%','Uptime']] as const).map(([n,l]) => (
                  <div key={l}>
                    <div
                      className="text-[26px] font-extrabold leading-none"
                      style={{ fontFamily:'var(--font-sora),sans-serif', color: leftStatNum }}
                    >
                      {n}
                    </div>
                    <div className="text-[10px] mt-1" style={{ color: leftStatLabel }}>{l}</div>
                  </div>
                ))}
              </div>
              <div className="h-px w-20"
                style={{ background: 'linear-gradient(90deg,#3b82f6,transparent)' }} />
            </motion.div>

            {/* Right column: cards */}
            <div className="flex-1 flex items-center justify-center px-4 pr-[4vw] py-10 overflow-hidden">
              <div className="w-full max-w-[860px] grid grid-cols-3 gap-[14px]">
                {SERVICES.map((s, i) => (
                  <ServiceCard key={s.title} service={s} index={i} sp={sp} isDark={isDark} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
