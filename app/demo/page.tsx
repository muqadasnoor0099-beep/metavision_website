'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Clock, Users, ShieldCheck, Stethoscope, Calculator, ArrowRight, ListChecks,
} from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'
import { useTheme } from '@/components/providers/ThemeProvider'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const HERO_INFO = [
  { Icon: Clock,       label: '30-Minute Walkthrough', value: 'Focused on your workflow, not a generic pitch' },
  { Icon: Users,       label: 'Live With Our Team',    value: 'No bots — a real product specialist' },
  { Icon: ShieldCheck, label: 'No Commitment Required', value: 'See it first, decide after' },
]

const WHAT_TO_EXPECT = [
  'A live walkthrough of the product you\'re interested in',
  'Answers to your specific workflow or compliance questions',
  'A follow-up plan tailored to your team size and needs',
]

const PRODUCTS = [
  { icon: Stethoscope, name: 'NexLink MedAI',              href: '/products/medical' },
  { icon: Calculator,  name: 'Workflow Management System', href: '/products/accounting' },
]

export default function DemoPage() {
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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            opacity: 0.06,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-[#60a5fa] text-[11px] font-semibold tracking-[0.2em] uppercase">Request a Demo</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: EASE_OUT }}
            className="font-heading font-extrabold tracking-tight mt-3 mb-3"
            style={{ fontSize: 'clamp(32px, 4.2vw, 48px)', lineHeight: 1.08, color: '#ffffff' }}
          >
            See MetaVision<br />
            in <span className="bg-gradient-to-r from-[#3b82f6] to-[#93c5fd] bg-clip-text text-transparent">Action</span>
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
            Tell us a bit about your team and we&apos;ll walk you through NexLink MedAI or the Workflow Management System, live.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-6">
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

      {/* ══════════════════════ BODY ══════════════════════ */}
      <section className="relative px-6 lg:px-8 py-16 lg:py-20" style={{ background: tok.bodyBg }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <ContactForm
              formType="demo"
              heading="Request Your Demo"
              messageLabel="What Would You Like Us to Cover? *"
              messagePlaceholder="Tell us about your team, patient/client volume, or specific questions..."
              submitLabel="Request Demo"
              successTitle="Demo Requested!"
              successMessage="Our team will reach out within 24 hours to schedule your walkthrough."
            />
          </motion.div>

          <div className="flex flex-col gap-6">
            {/* What to expect */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE_OUT }}
              className="p-7 lg:p-8 rounded-2xl flex flex-col gap-5"
              style={{ background: tok.cardBg, border: `1px solid ${tok.cardBorder}`, boxShadow: tok.cardShadow }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#2563eb' }}>
                  <ListChecks size={17} style={{ color: '#ffffff' }} />
                </div>
                <h2 className="font-heading font-bold text-xl" style={{ color: tok.heading }}>What to Expect</h2>
              </div>

              <ul className="flex flex-col gap-3">
                {WHAT_TO_EXPECT.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease: EASE_OUT }}
                    className="flex items-start gap-2.5 text-[13px] leading-relaxed"
                    style={{ color: tok.body }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#2563eb' }} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Choose a product */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.2, duration: 0.5, ease: EASE_OUT }}
              className="p-7 lg:p-8 rounded-2xl flex flex-col gap-4"
              style={{ background: tok.cardBg, border: `1px solid ${tok.cardBorder}`, boxShadow: tok.cardShadow }}
            >
              <h2 className="font-heading font-bold text-xl" style={{ color: tok.heading }}>Not Ready for a Demo?</h2>
              <p className="text-[13px] leading-relaxed" style={{ color: tok.body }}>
                Explore either product on your own first.
              </p>
              <div className="flex flex-col gap-2.5">
                {PRODUCTS.map(({ icon: Icon, name, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
                      border: `1px solid ${tok.cardBorder}`,
                      color: tok.heading,
                    }}
                  >
                    <Icon size={16} className="text-[#2563eb] shrink-0" />
                    <span className="flex-1">{name}</span>
                    <ArrowRight size={14} className="text-[#2563eb] transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  )
}
