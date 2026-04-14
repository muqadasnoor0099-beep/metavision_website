'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import CTABanner from '@/components/home/CTABanner'

const TIMELINE = [
  { year: '2019', title: 'Founded', description: 'MetaVision started as a medical software consultancy in Bangalore with a mission to bring AI to everyday healthcare.' },
  { year: '2020', title: 'First Product Launch', description: 'Launched our telemedicine platform, onboarding 50 clinics in the first 6 months.' },
  { year: '2022', title: 'CA Suite Launch', description: 'Expanded into financial software with AI-driven accounting tools for chartered accountants.' },
  { year: '2024', title: 'Scale', description: 'Now serving 1,700+ professionals across India with 24/7 dedicated support.' },
]

const TEAM = [
  { name: 'Arjun Nair', role: 'CEO & Co-Founder', avatar: 'https://placehold.co/80x80/d4af37/060609?text=AN' },
  { name: 'Priya Krishnan', role: 'CTO & Co-Founder', avatar: 'https://placehold.co/80x80/d4af37/060609?text=PK' },
  { name: 'Rahul Desai', role: 'Head of Product', avatar: 'https://placehold.co/80x80/d4af37/060609?text=RD' },
]

const UNIQUE = [
  { icon: '🧠', title: 'AI at the Core', body: "Our AI isn't a feature — it's the foundation every product is built on." },
  { icon: '🇮🇳', title: 'India-First', body: 'Built for India\'s regulatory landscape: HIPAA, GST, and IT Act compliance out of the box.' },
  { icon: '⚡', title: 'Speed to Value', body: 'Most clients go live in under 48 hours. No 6-month implementations.' },
]

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-28 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.07),transparent_60%)]" />
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
              title: 'Democratise AI for Professionals',
              body: 'Make enterprise-grade AI tools accessible to every doctor and CA in India — regardless of their practice size.',
            },
            {
              tag: 'Our Vision',
              title: 'The Intelligent Practice',
              body: 'A future where every clinical and financial decision is informed by real-time AI — reducing errors, saving time, and delivering better outcomes.',
            },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="text-gold text-[10px] font-bold tracking-widest uppercase mb-3">{card.tag}</div>
                <h3 className="text-white font-heading font-bold text-xl mb-3">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.body}</p>
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
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader overline="The Team" title="Meet the" titleGold="Founders" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
          {TEAM.map((member, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard hover className="text-center">
                <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-gold/30" />
                <div className="text-white font-semibold text-sm">{member.name}</div>
                <div className="text-white/40 text-xs mt-1">{member.role}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <CTABanner />
    </div>
  )
}
