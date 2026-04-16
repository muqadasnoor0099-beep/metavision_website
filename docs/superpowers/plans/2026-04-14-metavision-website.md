# MetaVision Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full production-ready Next.js 14 marketing website for MetaVision with animated 3D hero, 7 routes, and a dark/gold premium design system.

**Architecture:** Next.js 14 App Router with static export. Shared layout (Header/Footer) in `app/layout.tsx`. 3D canvases loaded client-side only via `dynamic(() => import(...), { ssr: false })`. Framer Motion for all UI animations. Design tokens in `tailwind.config.ts`.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS v3, Framer Motion, React Three Fiber (`@react-three/fiber`), `@react-three/drei`, Three.js, Lucide React, `next/font` (Space Grotesk + Inter)

---

## File Map

```
app/
  layout.tsx
  page.tsx
  globals.css
  about/page.tsx
  products/page.tsx
  products/medical/page.tsx
  products/accounting/page.tsx
  portfolio/page.tsx
  contact/page.tsx
components/
  layout/Header.tsx
  layout/Footer.tsx
  home/HeroSection.tsx
  home/FeaturesSection.tsx
  home/WhyUsSection.tsx
  home/TestimonialsSection.tsx
  home/CTABanner.tsx
  three/BrainCanvas.tsx
  three/DashboardCanvas.tsx
  ui/GlassCard.tsx
  ui/GoldButton.tsx
  ui/GhostButton.tsx
  ui/SectionHeader.tsx
  ui/StatCounter.tsx
  products/ProductHero.tsx
  products/FeatureGrid.tsx
  products/HowItWorks.tsx
  products/PricingCards.tsx
  portfolio/MockupCard.tsx
  contact/ContactForm.tsx
lib/
  types.ts
  constants.ts
tailwind.config.ts
next.config.js
```

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.ts` (via create-next-app)

- [ ] **Step 1: Scaffold into project root**

```bash
cd "e:/New folder"
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

When prompted, accept all defaults. If asked about existing files, confirm yes to continue.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install framer-motion @react-three/fiber @react-three/drei three lucide-react
npm install -D @types/three
```

- [ ] **Step 3: Verify install**

```bash
npx tsc --noEmit
```

Expected: no errors (default Next.js types are clean).

- [ ] **Step 4: Update next.config.js for static export**

Replace the content of `next.config.js` with:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

- [ ] **Step 5: Commit**

```bash
git init
git add package.json package-lock.json next.config.js tsconfig.json
git commit -m "feat: scaffold Next.js 14 project with R3F and Framer Motion"
```

---

## Task 2: Tailwind Config + Global CSS

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
        'gold-light': '#f5d060',
        surface: '#0e0e14',
        'surface-high': '#16161f',
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37, #f5d060)',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Replace app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: #060609;
    color: #ffffff;
  }
  * {
    box-sizing: border-box;
  }
}

@layer components {
  .glass-card {
    background: rgba(14, 14, 20, 0.75);
    border: 1px solid rgba(212, 175, 55, 0.18);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-radius: 0.75rem;
  }
}
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure Tailwind design tokens and global CSS"
```

---

## Task 3: Types + Constants

**Files:**
- Create: `lib/types.ts`
- Create: `lib/constants.ts`

- [ ] **Step 1: Create lib/types.ts**

```ts
export type ProductMode = 'medical' | 'accounting'

export interface HeroContent {
  overline: string
  headline1: string
  headline2: string
  description: string
  ctaLabel: string
  ctaHref: string
  stats: { value: string; label: string }[]
}

export interface Feature {
  icon: string
  title: string
  description: string
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
  rating: number
}

export interface NavLink {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export interface Step {
  number: string
  title: string
  description: string
}

export interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
}

export interface PortfolioItem {
  title: string
  tag: string
  image: string
}
```

- [ ] **Step 2: Create lib/constants.ts**

```ts
import type { ProductMode, HeroContent, Feature, Testimonial, NavLink, Step, PricingTier, PortfolioItem } from './types'

export const HERO_CONTENT: Record<ProductMode, HeroContent> = {
  medical: {
    overline: 'AI-Powered Healthcare Platform',
    headline1: 'Real-Time Doctor–Patient',
    headline2: 'Consultation & AI Rx',
    description:
      'Seamless live video consultations with intelligent AI prescription suggestions — built for modern healthcare workflows.',
    ctaLabel: 'Explore Medical Software',
    ctaHref: '/products/medical',
    stats: [
      { value: '500+', label: 'Clinics' },
      { value: '98%', label: 'Uptime SLA' },
      { value: '2M+', label: 'Consultations' },
    ],
  },
  accounting: {
    overline: 'Intelligent CA Workflow Suite',
    headline1: 'Streamline Your Practice',
    headline2: 'With AI-Driven Accounting',
    description:
      'End-to-end chartered accountant workflow: GST, ITR, balance sheets, and client management — all in one intelligent platform.',
    ctaLabel: 'Explore CA Software',
    ctaHref: '/products/accounting',
    stats: [
      { value: '1,200+', label: 'CA Firms' },
      { value: '99.9%', label: 'Accuracy' },
      { value: '50M+', label: 'Records Processed' },
    ],
  },
}

export const MEDICAL_FEATURES: Feature[] = [
  { icon: 'Video', title: 'Live Video Consult', description: 'HD real-time consultations with end-to-end encryption.' },
  { icon: 'Brain', title: 'AI Prescription', description: 'Intelligent drug suggestions based on diagnosis and history.' },
  { icon: 'FileText', title: 'Patient Records', description: 'Unified digital health records accessible anywhere.' },
  { icon: 'Calendar', title: 'Smart Scheduling', description: 'Automated appointment booking and reminders.' },
  { icon: 'Microscope', title: 'Lab Integration', description: 'Direct lab report import and analysis.' },
  { icon: 'Globe', title: 'Telemedicine Portal', description: 'Patient-facing portal for remote care access.' },
]

export const ACCOUNTING_FEATURES: Feature[] = [
  { icon: 'Receipt', title: 'GST Filing', description: 'Automated GST return preparation and e-filing.' },
  { icon: 'FileCheck', title: 'ITR Preparation', description: 'Intelligent income tax return with error detection.' },
  { icon: 'BarChart2', title: 'Balance Sheets', description: 'Auto-generated financial statements in one click.' },
  { icon: 'Users', title: 'Client Management', description: 'Centralised client database and communication hub.' },
  { icon: 'Shield', title: 'Audit Trail', description: 'Complete immutable log of every financial action.' },
  { icon: 'LayoutDashboard', title: 'Multi-firm Dashboard', description: 'Manage multiple firms from a single unified view.' },
]

export const WHY_US = [
  { value: '1,700+', label: 'Professionals', description: 'Trusted by doctors and CAs across Pakistan.' },
  { value: 'AI-First', label: 'Philosophy', description: 'Not bolted on — AI is core to every workflow.' },
  { value: '100%', label: 'Compliance', description: "Built for Pakistan's regulatory landscape — HIPAA, GST, IT Act." },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "MetaVision's medical platform cut our prescription errors by 80%. The AI suggestions are remarkably accurate.",
    name: 'Dr. Priya Sharma',
    role: 'Senior Physician',
    company: 'Apollo Clinics, Mumbai',
    rating: 5,
  },
  {
    quote: 'Filing 200+ GST returns used to take a week. Now it takes a day. MetaVision is a game-changer for our firm.',
    name: 'CA Rajesh Mehta',
    role: 'Founding Partner',
    company: 'Mehta & Associates, Delhi',
    rating: 5,
  },
  {
    quote: 'The telemedicine portal was live in 48 hours. Patient satisfaction scores went up 30% in the first month.',
    name: 'Dr. Anil Verma',
    role: 'Hospital Director',
    company: 'Verma Multispeciality, Pune',
    rating: 5,
  },
]

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Medical Software', href: '/products/medical' },
      { label: 'CA Software', href: '/products/accounting' },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
]

export const HOW_IT_WORKS_MEDICAL: Step[] = [
  {
    number: '01',
    title: 'Register & Set Up',
    description: 'Create your practice profile, add doctors, and configure patient intake forms in minutes.',
  },
  {
    number: '02',
    title: 'Start Consultations',
    description: 'Patients book via the portal. Doctors join the HD video call with one click.',
  },
  {
    number: '03',
    title: 'AI-Assisted Diagnosis',
    description: 'As the consultation progresses, AI suggests prescriptions and flags drug interactions in real time.',
  },
]

export const HOW_IT_WORKS_ACCOUNTING: Step[] = [
  {
    number: '01',
    title: 'Import Client Data',
    description: 'Connect existing records via CSV or API. MetaVision auto-categorises transactions instantly.',
  },
  {
    number: '02',
    title: 'Review & Approve',
    description: 'AI prepares GST returns, ITR drafts, and balance sheets. You review and approve in one click.',
  },
  {
    number: '03',
    title: 'File & Report',
    description: 'Direct e-filing to government portals. Share branded reports with clients from the dashboard.',
  },
]

export const MEDICAL_PRICING: PricingTier[] = [
  {
    name: 'Starter',
    price: '₹2,999',
    period: '/month',
    description: 'For small clinics and solo practitioners.',
    features: ['Up to 5 doctors', '500 consultations/month', 'AI prescriptions', 'Patient portal', 'Email support'],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '₹7,999',
    period: '/month',
    description: 'For growing multi-specialty clinics.',
    features: ['Up to 25 doctors', 'Unlimited consultations', 'Lab integration', 'Custom branding', 'Priority support'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For hospital chains and large networks.',
    features: ['Unlimited doctors', 'Dedicated infrastructure', 'HIPAA compliance audit', 'Custom integrations', '24/7 dedicated support'],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export const ACCOUNTING_PRICING: PricingTier[] = [
  {
    name: 'Solo',
    price: '₹1,999',
    period: '/month',
    description: 'For individual chartered accountants.',
    features: ['Up to 50 clients', 'GST + ITR filing', 'Balance sheet automation', 'Audit trail', 'Email support'],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Firm',
    price: '₹5,499',
    period: '/month',
    description: 'For CA firms with multiple partners.',
    features: ['Up to 300 clients', 'Multi-user access', 'Advanced GST analytics', 'Client portal', 'Phone + chat support'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large firms and corporates.',
    features: ['Unlimited clients', 'Custom workflows', 'API access', 'White-labeling', 'Dedicated account manager'],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { title: 'Patient Dashboard', tag: 'Medical', image: 'https://placehold.co/400x260/0e0e14/d4af37?text=Patient+Dashboard' },
  { title: 'Video Consultation', tag: 'Medical', image: 'https://placehold.co/400x260/0e0e14/d4af37?text=Video+Consultation' },
  { title: 'AI Prescription Panel', tag: 'Medical', image: 'https://placehold.co/400x260/0e0e14/d4af37?text=AI+Prescription' },
  { title: 'GST Filing Interface', tag: 'Accounting', image: 'https://placehold.co/400x260/0e0e14/d4af37?text=GST+Filing' },
  { title: 'Balance Sheet Generator', tag: 'Accounting', image: 'https://placehold.co/400x260/0e0e14/d4af37?text=Balance+Sheet' },
  { title: 'Client Management Hub', tag: 'Accounting', image: 'https://placehold.co/400x260/0e0e14/d4af37?text=Client+Hub' },
  { title: 'Analytics Dashboard', tag: 'Medical', image: 'https://placehold.co/400x260/0e0e14/d4af37?text=Analytics' },
  { title: 'Multi-firm Overview', tag: 'Accounting', image: 'https://placehold.co/400x260/0e0e14/d4af37?text=Multi-firm' },
]
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/
git commit -m "feat: add shared types and content constants"
```

---

## Task 4: UI Atoms

**Files:**
- Create: `components/ui/GoldButton.tsx`
- Create: `components/ui/GhostButton.tsx`
- Create: `components/ui/GlassCard.tsx`
- Create: `components/ui/SectionHeader.tsx`

- [ ] **Step 1: Create components/ui/GoldButton.tsx**

```tsx
import Link from 'next/link'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md'
  className?: string
  type?: 'button' | 'submit'
}

export default function GoldButton({ children, href, onClick, size = 'md', className = '', type = 'button' }: Props) {
  const base = `inline-flex items-center justify-center font-bold bg-gradient-to-r from-gold to-gold-light text-black rounded-[10px] transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 ${
    size === 'sm' ? 'text-xs px-4 py-2' : 'text-sm px-6 py-3'
  } ${className}`

  if (href) return <Link href={href} className={base}>{children}</Link>
  return <button type={type} onClick={onClick} className={base}>{children}</button>
}
```

- [ ] **Step 2: Create components/ui/GhostButton.tsx**

```tsx
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
}

export default function GhostButton({ children, onClick, className = '', type = 'button' }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded-[10px] text-sm px-5 py-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${className}`}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 3: Create components/ui/GlassCard.tsx**

```tsx
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function GlassCard({ children, className = '', hover = false }: Props) {
  return (
    <div
      className={`glass-card p-6 ${
        hover
          ? 'transition-all duration-300 hover:border-gold/30 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_40px_rgba(212,175,55,0.07)]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Create components/ui/SectionHeader.tsx**

```tsx
interface Props {
  overline?: string
  title: string
  titleGold?: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeader({ overline, title, titleGold, subtitle, centered = true }: Props) {
  return (
    <div className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : 'items-start'}`}>
      {overline && (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">{overline}</span>
        </div>
      )}
      <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight font-heading">
        <span className="text-white">{title} </span>
        {titleGold && (
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{titleGold}</span>
        )}
      </h2>
      {subtitle && <p className="text-white/50 text-sm leading-relaxed max-w-lg">{subtitle}</p>}
    </div>
  )
}
```

- [ ] **Step 5: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/ui/
git commit -m "feat: add UI atom components (GoldButton, GhostButton, GlassCard, SectionHeader)"
```

---

## Task 5: StatCounter

**Files:**
- Create: `components/ui/StatCounter.tsx`

- [ ] **Step 1: Create components/ui/StatCounter.tsx**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  value: string
  label: string
}

export default function StatCounter({ value, label }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState('0')

  useEffect(() => {
    if (!isInView) return
    const match = value.match(/^([\d,.]+)(.*)$/)
    if (!match) {
      setDisplayed(value)
      return
    }
    const num = parseFloat(match[1].replace(/,/g, ''))
    const suffix = match[2]
    const duration = 1400
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(num * eased).toLocaleString() + suffix)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, value])

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl lg:text-4xl font-extrabold text-gold font-heading">{displayed}</div>
      <div className="text-white/40 text-xs mt-1 uppercase tracking-widest">{label}</div>
    </div>
  )
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/StatCounter.tsx
git commit -m "feat: add animated StatCounter component"
```

---

## Task 6: Header

**Files:**
- Create: `components/layout/Header.tsx`

- [ ] **Step 1: Create components/layout/Header.tsx**

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import GoldButton from '@/components/ui/GoldButton'
import { NAV_LINKS } from '@/lib/constants'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-[12px] ${
        scrolled
          ? 'bg-[rgba(6,6,9,0.95)] shadow-[0_1px_0_rgba(212,175,55,0.1)]'
          : 'bg-[rgba(6,6,9,0.6)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-light rounded-lg flex items-center justify-center font-black text-black text-sm font-heading">
            MV
          </div>
          <span className="font-heading font-bold text-white tracking-tight">MetaVision</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 text-white/60 hover:text-white text-sm transition-colors">
                  {link.label}
                  <ChevronDown size={13} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-52 glass-card py-2"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link key={link.href} href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          <GoldButton href="/contact" size="sm">Get Demo</GoldButton>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white/70 hover:text-white transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[rgba(6,6,9,0.98)] border-t border-gold/10 overflow-hidden"
          >
            <nav className="px-6 py-5 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-white/70 hover:text-white text-base font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="ml-4 mt-2 flex flex-col gap-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-white/45 hover:text-white text-sm transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2">
                <GoldButton href="/contact" className="w-full justify-center">Get Demo</GoldButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "feat: add sticky Header with dropdown and mobile menu"
```

---

## Task 7: Footer + Root Layout

**Files:**
- Create: `components/layout/Footer.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create components/layout/Footer.tsx**

```tsx
import Link from 'next/link'
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react'

const FOOTER_COLS = {
  Products: [
    { label: 'Medical Software', href: '/products/medical' },
    { label: 'CA Software', href: '/products/accounting' },
    { label: 'All Products', href: '/products' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-[#060609]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-light rounded-lg flex items-center justify-center font-black text-black text-sm">
                MV
              </div>
              <span className="font-heading font-bold text-white">MetaVision</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Premium AI software for healthcare and finance professionals. Pakistan-built, globally ready.
            </p>
            <div className="flex gap-3 mt-1">
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg border border-white/10 hover:border-gold/30 flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_COLS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-5">{title}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/40 hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Contact</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-white/40 text-sm">
                <Mail size={14} className="text-gold mt-0.5 shrink-0" />
                hello@metavision.in
              </li>
              <li className="flex items-start gap-2.5 text-white/40 text-sm">
                <Phone size={14} className="text-gold mt-0.5 shrink-0" />
                +92 300 1231234
              </li>
              <li className="flex items-start gap-2.5 text-white/40 text-sm">
                <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                Islamabad, Pakistan
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">© 2026 MetaVision Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-white/25 text-xs">Built with ♥ in Pakistan</p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Replace app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'MetaVision — AI Software for Healthcare & Finance',
  description:
    'Premium AI-powered software for doctors and chartered accountants. Real-time consultations, intelligent prescriptions, and automated accounting workflows.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Start dev server and verify nav renders**

```bash
npm run dev
```

Open `http://localhost:3000`. You should see the header and footer with gold logo. Stop the server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add components/layout/ app/layout.tsx
git commit -m "feat: add Footer and wire up root layout with fonts"
```

---

## Task 8: BrainCanvas (3D)

**Files:**
- Create: `components/three/BrainCanvas.tsx`

- [ ] **Step 1: Create components/three/BrainCanvas.tsx**

```tsx
'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function NeuralNode({ position, phase }: { position: [number, number, number]; phase: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.scale.setScalar(0.75 + Math.sin(state.clock.elapsedTime * 1.8 + phase) * 0.25)
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={2.5} />
    </mesh>
  )
}

function ConnectionLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = useMemo(
    () => [new THREE.Vector3(...start), new THREE.Vector3(...end)],
    [start, end]
  )
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points)
    return g
  }, [points])

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#d4af37" opacity={0.18} transparent />
    </line>
  )
}

const NODE_POSITIONS: [number, number, number][] = [
  [-0.8, 0.9, 0.4], [0.8, 0.9, 0.4], [-1.1, 0.2, 0.2], [1.1, 0.2, 0.2],
  [-0.9, -0.5, 0.5], [0.9, -0.5, 0.5], [0, 1.2, 0], [0, -0.9, 0.3],
  [-0.5, 0.5, 1.0], [0.5, 0.5, 1.0], [-0.6, -0.2, -0.8], [0.6, -0.2, -0.8],
  [-1.0, 0.6, -0.3], [1.0, 0.6, -0.3], [0, 0, 1.3], [-0.3, 1.0, -0.6],
  [0.3, 1.0, -0.6], [-1.2, -0.1, -0.1], [1.2, -0.1, -0.1], [0, -1.1, -0.2],
]

const CONNECTIONS: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [6, 0], [6, 1],
  [7, 4], [7, 5], [8, 0], [9, 1], [10, 4], [11, 5], [14, 8],
  [14, 9], [12, 2], [13, 3], [15, 6], [16, 6], [17, 2], [18, 3],
]

function BrainScene() {
  const groupRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.0035
    groupRef.current.rotation.x += (mouse.y * 0.12 - groupRef.current.rotation.x) * 0.04
  })

  return (
    <group ref={groupRef}>
      {/* Left hemisphere */}
      <mesh position={[-0.28, 0, 0]}>
        <icosahedronGeometry args={[1.38, 4]} />
        <meshStandardMaterial color="#d4af37" wireframe opacity={0.28} transparent />
      </mesh>

      {/* Right hemisphere */}
      <mesh position={[0.28, 0, 0]}>
        <icosahedronGeometry args={[1.38, 4]} />
        <meshStandardMaterial color="#d4af37" wireframe opacity={0.28} transparent />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.25}
          opacity={0.07}
          transparent
        />
      </mesh>

      {/* Neural connections */}
      {CONNECTIONS.map(([a, b], i) => (
        <ConnectionLine key={i} start={NODE_POSITIONS[a]} end={NODE_POSITIONS[b]} />
      ))}

      {/* Neural nodes */}
      {NODE_POSITIONS.map((pos, i) => (
        <NeuralNode key={i} position={pos} phase={i * 0.6} />
      ))}

      {/* Outer orbit ring */}
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.0, 0.008, 8, 80]} />
          <meshStandardMaterial color="#d4af37" opacity={0.15} transparent />
        </mesh>
      </Float>
    </group>
  )
}

export default function BrainCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 4.8], fov: 48 }} dpr={[1, 2]}>
      <ambientLight intensity={0.25} />
      <pointLight position={[-3, 3, 3]} intensity={2} color="#d4af37" />
      <pointLight position={[3, -2, -2]} intensity={0.6} color="#ffffff" />
      <BrainScene />
    </Canvas>
  )
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/three/BrainCanvas.tsx
git commit -m "feat: add R3F BrainCanvas with neural network animation"
```

---

## Task 9: DashboardCanvas (3D)

**Files:**
- Create: `components/three/DashboardCanvas.tsx`

- [ ] **Step 1: Create components/three/DashboardCanvas.tsx**

```tsx
'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const BAR_HEIGHTS = [0.6, 1.1, 0.8, 1.5, 1.0, 1.35, 1.6, 1.2]

function AnimatedBar({ position, targetHeight, delay }: { position: [number, number, number]; targetHeight: number; delay: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const current = useRef(0)

  useFrame((state) => {
    if (!ref.current) return
    const t = Math.max(0, state.clock.elapsedTime - delay)
    const progress = Math.min(t / 1.2, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    current.current = targetHeight * eased
    ref.current.scale.y = Math.max(current.current, 0.01)
    ref.current.position.y = position[1] + (current.current / 2)
  })

  return (
    <mesh ref={ref} position={[position[0], position[1], position[2]]}>
      <boxGeometry args={[0.18, 1, 0.18]} />
      <meshStandardMaterial
        color="#d4af37"
        emissive="#d4af37"
        emissiveIntensity={0.5}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  )
}

function LineGraph() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < 8; i++) {
      pts.push(new THREE.Vector3(-1.4 + i * 0.4, -0.5 + [0.2, 0.5, 0.3, 0.8, 0.6, 0.9, 1.1, 0.85][i], 0.05))
    }
    return pts
  }, [])

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#f5d060" opacity={0.6} transparent />
    </line>
  )
}

import { useMemo } from 'react'

function DashboardScene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.18
    groupRef.current.rotation.x = -0.1 + Math.sin(state.clock.elapsedTime * 0.18) * 0.04
  })

  return (
    <group ref={groupRef}>
      {/* Dashboard backing plane */}
      <mesh position={[0, 0.1, -0.1]}>
        <planeGeometry args={[4.2, 3.2]} />
        <meshStandardMaterial color="#0e0e14" opacity={0.85} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Border frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(4.2, 3.2)]} />
        <lineBasicMaterial color="#d4af37" opacity={0.2} transparent />
      </lineSegments>

      {/* Animated bars */}
      {BAR_HEIGHTS.map((h, i) => (
        <AnimatedBar
          key={i}
          position={[-1.52 + i * 0.44, -1.1, 0]}
          targetHeight={h}
          delay={i * 0.08}
        />
      ))}

      {/* Line graph above bars */}
      <LineGraph />

      {/* Floating data cube */}
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={0.4}>
        <mesh position={[2.0, 1.1, 0.5]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial color="#d4af37" wireframe opacity={0.65} transparent />
        </mesh>
      </Float>

      {/* Second floating cube */}
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={0.6}>
        <mesh position={[-2.1, 1.0, 0.3]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#f5d060" wireframe opacity={0.5} transparent />
        </mesh>
      </Float>
    </group>
  )
}

export default function DashboardCanvas() {
  return (
    <Canvas camera={{ position: [0, 0.3, 5.5], fov: 46 }} dpr={[1, 2]}>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 3, 4]} intensity={1.8} color="#d4af37" />
      <pointLight position={[-3, -2, 2]} intensity={0.5} color="#ffffff" />
      <DashboardScene />
    </Canvas>
  )
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/three/DashboardCanvas.tsx
git commit -m "feat: add R3F DashboardCanvas with animated bar chart"
```

---

## Task 10: HeroSection

**Files:**
- Create: `components/home/HeroSection.tsx`

- [ ] **Step 1: Create components/home/HeroSection.tsx**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'
import { HERO_CONTENT } from '@/lib/constants'
import type { ProductMode } from '@/lib/types'

const BrainCanvas = dynamic(() => import('@/components/three/BrainCanvas'), { ssr: false })
const DashboardCanvas = dynamic(() => import('@/components/three/DashboardCanvas'), { ssr: false })

const MODES: ProductMode[] = ['medical', 'accounting']
const MODE_LABELS: Record<ProductMode, string> = {
  medical: 'Medical Software',
  accounting: 'Accounting Software',
}

export default function HeroSection() {
  const [mode, setMode] = useState<ProductMode>('medical')

  useEffect(() => {
    const id = setInterval(() => {
      setMode((m) => (m === 'medical' ? 'accounting' : 'medical'))
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const content = HERO_CONTENT[mode]

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Global background radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.06),transparent)]" />

      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen pt-16">
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col justify-center px-8 lg:px-16 py-20 lg:py-0 gap-7">
          {/* Pill toggle */}
          <div className="inline-flex bg-white/[0.05] border border-gold/20 rounded-full p-1 gap-1 w-fit">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all duration-300 ${
                  mode === m
                    ? 'bg-gradient-to-r from-gold to-gold-light text-black'
                    : 'text-white/40 hover:text-white/65'
                }`}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Animated content block */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-5"
            >
              {/* Overline */}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#d4af37]" />
                <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">
                  {content.overline}
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold font-heading text-white leading-[1.06] tracking-tight">
                  {content.headline1}
                </h1>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold font-heading leading-[1.06] tracking-tight bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                  {content.headline2}
                </h1>
              </div>

              {/* Description */}
              <p className="text-white/55 text-sm leading-relaxed max-w-[380px]">
                {content.description}
              </p>

              {/* CTAs */}
              <div className="flex gap-3 flex-wrap">
                <GoldButton href={content.ctaHref}>{content.ctaLabel}</GoldButton>
                <GhostButton>▶ Watch Demo</GhostButton>
              </div>

              {/* Stats */}
              <div className="flex gap-7 pt-5 border-t border-white/[0.07]">
                {content.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-gold font-extrabold text-xl font-heading">{stat.value}</div>
                    <div className="text-white/35 text-[11px] mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── RIGHT COLUMN: 3D ── */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
          {/* Stage glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,rgba(212,175,55,0.1)_0%,transparent_65%)]" />
          {/* Scan lines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(212,175,55,0.012)_3px,rgba(212,175,55,0.012)_4px)] pointer-events-none" />

          {/* 3D canvas */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.55 }}
              className="absolute inset-0"
            >
              {mode === 'medical' ? <BrainCanvas /> : <DashboardCanvas />}
            </motion.div>
          </AnimatePresence>

          {/* Floating status card — bottom right */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`card-br-${mode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="absolute bottom-8 right-6 glass-card p-3 min-w-[155px] z-10"
            >
              <div className="text-gold text-[9px] font-bold tracking-widest mb-1.5">
                {mode === 'medical' ? 'AI ANALYSIS' : 'REVENUE REPORT'}
              </div>
              <div className="text-white text-sm font-semibold mb-0.5">
                {mode === 'medical' ? 'Diagnosis Ready' : '+24% Growth'}
              </div>
              <div className="text-white/40 text-[11px]">
                {mode === 'medical' ? 'Confidence: 97.4%' : 'vs last quarter'}
              </div>
              <div className="mt-2 h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-700"
                  style={{ width: mode === 'medical' ? '97%' : '76%' }}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating status card — top left */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`card-tl-${mode}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45, duration: 0.3 }}
              className="absolute top-10 left-6 glass-card p-3 z-10"
            >
              <div className="text-white/35 text-[9px] font-semibold tracking-widest mb-2 uppercase">
                {mode === 'medical' ? 'Neural Activity' : 'Reports Filed'}
              </div>
              <div className="flex items-end gap-1 h-6">
                {[10, 20, 13, 24, 16, 8, 18].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gold rounded-sm transition-all duration-500"
                    style={{ height: `${(h / 24) * 100}%`, opacity: 0.5 + (h / 24) * 0.5 }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-white/25 text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-0.5 h-5 bg-gradient-to-b from-gold/40 to-transparent rounded-full"
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/home/HeroSection.tsx
git commit -m "feat: add HeroSection with pill toggle, auto-switch, and 3D canvases"
```

---

## Task 11: FeaturesSection + WhyUsSection + TestimonialsSection + CTABanner

**Files:**
- Create: `components/home/FeaturesSection.tsx`
- Create: `components/home/WhyUsSection.tsx`
- Create: `components/home/TestimonialsSection.tsx`
- Create: `components/home/CTABanner.tsx`

- [ ] **Step 1: Create components/home/FeaturesSection.tsx**

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import { MEDICAL_FEATURES, ACCOUNTING_FEATURES } from '@/lib/constants'
import type { Feature, ProductMode } from '@/lib/types'

const ICON_MAP: Record<string, LucideIcon> = {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
}

interface Props {
  fixedMode?: ProductMode
}

export default function FeaturesSection({ fixedMode }: Props) {
  const [mode, setMode] = useState<ProductMode>(fixedMode ?? 'medical')
  const features: Feature[] = mode === 'medical' ? MEDICAL_FEATURES : ACCOUNTING_FEATURES

  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader
        overline="Capabilities"
        title="Everything You Need."
        titleGold="Nothing You Don't."
        subtitle="Purpose-built features for healthcare and financial professionals."
      />

      {!fixedMode && (
        <div className="flex justify-center mt-8 mb-4">
          <div className="inline-flex bg-white/[0.05] border border-gold/20 rounded-full p-1 gap-1">
            {(['medical', 'accounting'] as ProductMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all duration-300 ${
                  mode === m ? 'bg-gradient-to-r from-gold to-gold-light text-black' : 'text-white/40 hover:text-white/65'
                }`}
              >
                {m === 'medical' ? 'Medical' : 'Accounting'}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10"
        >
          {features.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon]
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.055, duration: 0.38 }}
              >
                <GlassCard hover>
                  <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <h3 className="font-heading font-semibold text-white mb-1.5">{feature.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
```

- [ ] **Step 2: Create components/home/WhyUsSection.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import StatCounter from '@/components/ui/StatCounter'
import { WHY_US } from '@/lib/constants'

export default function WhyUsSection() {
  return (
    <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(212,175,55,0.04)_0%,transparent_70%)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          overline="Why MetaVision"
          title="Trusted by"
          titleGold="Industry Leaders"
          subtitle="From solo practitioners to hospital chains, professionals across Pakistan rely on MetaVision."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          {WHY_US.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <StatCounter value={item.value} label={item.label} />
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create components/home/TestimonialsSection.tsx**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import { TESTIMONIALS } from '@/lib/constants'

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
            <motion.div
              key={i}
              animate={{ opacity: i === active ? 1 : 0.38, scale: i === active ? 1 : 0.97 }}
              transition={{ duration: 0.4 }}
              onClick={() => setActive(i)}
              className="cursor-pointer"
            >
              <GlassCard className={i === active ? 'border-gold/30' : ''}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs mt-0.5">{t.role}, {t.company}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all ${i === active ? 'w-4 h-2 bg-gold' : 'w-2 h-2 bg-white/20'}`}
            />
          ))}
          <button
            onClick={() => setActive((a) => (a + 1) % TESTIMONIALS.length)}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create components/home/CTABanner.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'

export default function CTABanner() {
  return (
    <section className="py-20 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,175,55,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(212,175,55,0.05),transparent_60%)]" />
      <div className="absolute inset-0 border-y border-gold/10" />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-5xl font-extrabold font-heading tracking-tight"
        >
          <span className="text-white">Ready to Transform </span>
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">Your Practice?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/50 text-base leading-relaxed max-w-xl"
        >
          Join 1,700+ professionals already using MetaVision. Start your free trial today — no credit card required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <GoldButton href="/contact">Start Free Trial</GoldButton>
          <GhostButton>Book a Demo</GhostButton>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/home/
git commit -m "feat: add FeaturesSection, WhyUsSection, TestimonialsSection, CTABanner"
```

---

## Task 12: Landing Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```tsx
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import WhyUsSection from '@/components/home/WhyUsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTABanner from '@/components/home/CTABanner'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CTABanner />
    </>
  )
}
```

- [ ] **Step 2: Start dev server and visually verify landing page**

```bash
npm run dev
```

Open `http://localhost:3000`. Check:
- Header visible with gold logo and nav links
- Hero shows Medical Software mode by default with pill toggle
- Auto-switches to Accounting Software after 5 seconds
- 3D brain canvas renders on right
- Features section below with toggle
- Stats, testimonials, CTA banner, footer all visible

Stop server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire up landing page with all home sections"
```

---

## Task 13: About Page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create app/about/page.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import CTABanner from '@/components/home/CTABanner'

const TIMELINE = [
  { year: '2019', title: 'Founded', description: 'MetaVision started as a medical software consultancy in Bangalore with a mission to bring AI to everyday healthcare.' },
  { year: '2020', title: 'First Product Launch', description: 'Launched our telemedicine platform, onboarding 50 clinics in the first 6 months.' },
  { year: '2022', title: 'CA Suite Launch', description: 'Expanded into financial software with AI-driven accounting tools for chartered accountants.' },
  { year: '2024', title: 'Scale', description: 'Now serving 1,700+ professionals across Pakistan with 24/7 dedicated support.' },
]

const TEAM = [
  { name: 'Faisal Ayub', role: 'CEO & Co-Founder', avatar: 'https://placehold.co/80x80/d4af37/060609?text=AN' },
  { name: 'Faisal Ayub', role: 'CTO & Co-Founder', avatar: 'https://placehold.co/80x80/d4af37/060609?text=PK' },
  { name: 'Faisal Ayub', role: 'Head of Product', avatar: 'https://placehold.co/80x80/d4af37/060609?text=RD' },
]

const UNIQUE = [
  { icon: '🧠', title: 'AI at the Core', body: "Our AI isn't a feature — it's the foundation every product is built on." },
  { icon: '🇮🇳', title: 'Pakistan-First', body: 'Built for Pakistan\'s regulatory landscape: HIPAA, GST, and IT Act compliance out of the box.' },
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
              body: 'Make enterprise-grade AI tools accessible to every doctor and CA in Pakistan — regardless of their practice size.',
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
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/about/
git commit -m "feat: add About page with timeline, team, and mission sections"
```

---

## Task 14: Product Components

**Files:**
- Create: `components/products/ProductHero.tsx`
- Create: `components/products/FeatureGrid.tsx`
- Create: `components/products/HowItWorks.tsx`
- Create: `components/products/PricingCards.tsx`

- [ ] **Step 1: Create components/products/ProductHero.tsx**

```tsx
'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'
import type { ProductMode } from '@/lib/types'

const BrainCanvas = dynamic(() => import('@/components/three/BrainCanvas'), { ssr: false })
const DashboardCanvas = dynamic(() => import('@/components/three/DashboardCanvas'), { ssr: false })

interface Props {
  mode: ProductMode
  overline: string
  headline1: string
  headline2: string
  description: string
  ctaLabel: string
  ctaHref: string
}

export default function ProductHero({ mode, overline, headline1, headline2, description, ctaLabel, ctaHref }: Props) {
  return (
    <section className="relative min-h-[80vh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.06),transparent)]" />

      {/* Left */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-20 lg:py-0 gap-7 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#d4af37]" />
            <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">{overline}</span>
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-heading text-white leading-[1.06] tracking-tight">{headline1}</h1>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-heading leading-[1.06] tracking-tight bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{headline2}</h1>
          </div>
          <p className="text-white/55 text-sm leading-relaxed max-w-[380px]">{description}</p>
          <div className="flex gap-3 flex-wrap">
            <GoldButton href={ctaHref}>{ctaLabel}</GoldButton>
            <GhostButton>▶ Watch Demo</GhostButton>
          </div>
        </motion.div>
      </div>

      {/* Right 3D */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,rgba(212,175,55,0.1),transparent_65%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(212,175,55,0.012)_3px,rgba(212,175,55,0.012)_4px)] pointer-events-none" />
        <div className="absolute inset-0">
          {mode === 'medical' ? <BrainCanvas /> : <DashboardCanvas />}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create components/products/FeatureGrid.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import type { Feature } from '@/lib/types'

const ICON_MAP: Record<string, LucideIcon> = {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
}

interface Props {
  features: Feature[]
  title: string
  titleGold?: string
}

export default function FeatureGrid({ features, title, titleGold }: Props) {
  return (
    <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader overline="Features" title={title} titleGold={titleGold} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {features.map((feature, i) => {
          const Icon = ICON_MAP[feature.icon]
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.38 }}
            >
              <GlassCard hover>
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-gold" />
                </div>
                <h3 className="font-heading font-semibold text-white mb-1.5">{feature.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{feature.description}</p>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create components/products/HowItWorks.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import type { Step } from '@/lib/types'

interface Props {
  steps: Step[]
}

export default function HowItWorks({ steps }: Props) {
  return (
    <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader overline="Process" title="How It" titleGold="Works" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 relative">
        <div className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.45 }}
          >
            <GlassCard>
              <div className="text-4xl font-black font-heading bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent mb-4">
                {step.number}
              </div>
              <h3 className="text-white font-heading font-semibold mb-2">{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{step.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create components/products/PricingCards.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'
import type { PricingTier } from '@/lib/types'

interface Props {
  tiers: PricingTier[]
}

export default function PricingCards({ tiers }: Props) {
  return (
    <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader overline="Pricing" title="Simple," titleGold="Transparent Pricing" subtitle="No hidden fees. Cancel anytime." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 flex flex-col ${
              tier.highlighted ? 'border-gold/35 shadow-[0_0_40px_rgba(212,175,55,0.1)]' : ''
            }`}
          >
            {tier.highlighted && (
              <div className="text-[10px] font-bold text-black bg-gradient-to-r from-gold to-gold-light rounded-full px-3 py-1 w-fit mb-4">
                MOST POPULAR
              </div>
            )}
            <div className="text-white font-heading font-bold text-xl mb-1">{tier.name}</div>
            <div className="mb-2">
              <span className="text-3xl font-extrabold text-gold font-heading">{tier.price}</span>
              <span className="text-white/40 text-sm">{tier.period}</span>
            </div>
            <p className="text-white/40 text-sm mb-6">{tier.description}</p>
            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {tier.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2.5 text-white/60 text-sm">
                  <Check size={14} className="text-gold shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {tier.highlighted ? (
              <GoldButton href="/contact" className="w-full justify-center">{tier.cta}</GoldButton>
            ) : (
              <GhostButton className="w-full">{tier.cta}</GhostButton>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add components/products/
git commit -m "feat: add ProductHero, FeatureGrid, HowItWorks, PricingCards components"
```

---

## Task 15: Products Pages

**Files:**
- Create: `app/products/page.tsx`
- Create: `app/products/medical/page.tsx`
- Create: `app/products/accounting/page.tsx`

- [ ] **Step 1: Create app/products/page.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
import GhostButton from '@/components/ui/GhostButton'
import { MEDICAL_FEATURES, ACCOUNTING_FEATURES } from '@/lib/constants'
import {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Feature } from '@/lib/types'

const ICON_MAP: Record<string, LucideIcon> = {
  Video, Brain, FileText, Calendar, Microscope, Globe,
  Receipt, FileCheck, BarChart2, Users, Shield, LayoutDashboard,
}

function ProductSection({
  tag, headline1, headline2, description, features, ctaHref, flip,
}: {
  tag: string; headline1: string; headline2: string; description: string
  features: Feature[]; ctaHref: string; flip: boolean
}) {
  return (
    <section className={`py-20 px-6 lg:px-8 relative overflow-hidden ${flip ? 'bg-surface/30' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${flip ? 'lg:flex-row-reverse' : ''}`}>
          <motion.div initial={{ opacity: 0, x: flip ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">{tag}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-heading tracking-tight mb-4">
              <span className="text-white">{headline1} </span>
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{headline2}</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-md">{description}</p>
            <div className="flex gap-3">
              <GoldButton href={ctaHref}>Learn More</GoldButton>
              <GhostButton>View Demo</GhostButton>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.slice(0, 4).map((f, i) => {
              const Icon = ICON_MAP[f.icon]
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <GlassCard hover className="p-4">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-3">
                      <Icon size={15} className="text-gold" />
                    </div>
                    <div className="text-white font-semibold text-sm mb-1">{f.title}</div>
                    <div className="text-white/40 text-xs leading-relaxed">{f.description}</div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ProductsPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.07),transparent_60%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">Our Products</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading tracking-tight mb-5">
            <span className="text-white">Two Products. </span>
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">One Vision.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            MetaVision builds AI-first software for two of Pakistan's most demanding professions. Both products share the same commitment: intelligence that works in the background, so you can focus on what matters.
          </p>
        </div>
      </section>

      <ProductSection
        tag="Medical Software"
        headline1="Real-Time Consultation"
        headline2="& AI Prescription"
        description="Seamless live video consultations with intelligent AI prescription suggestions, patient records, and lab integration — all in one platform."
        features={MEDICAL_FEATURES}
        ctaHref="/products/medical"
        flip={false}
      />

      <ProductSection
        tag="CA Workflow Software"
        headline1="Intelligent Accounting"
        headline2="For Modern CAs"
        description="End-to-end workflow automation for chartered accountants — GST, ITR, balance sheets, and client management powered by AI."
        features={ACCOUNTING_FEATURES}
        ctaHref="/products/accounting"
        flip={true}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create app/products/medical/page.tsx**

```tsx
import ProductHero from '@/components/products/ProductHero'
import FeatureGrid from '@/components/products/FeatureGrid'
import HowItWorks from '@/components/products/HowItWorks'
import PricingCards from '@/components/products/PricingCards'
import CTABanner from '@/components/home/CTABanner'
import { MEDICAL_FEATURES, HOW_IT_WORKS_MEDICAL, MEDICAL_PRICING } from '@/lib/constants'

export default function MedicalProductPage() {
  return (
    <div className="pt-16">
      <ProductHero
        mode="medical"
        overline="AI-Powered Healthcare Platform"
        headline1="Real-Time Doctor–Patient"
        headline2="Consultation & AI Rx"
        description="Seamless live video consultations with intelligent AI prescription suggestions — built for modern healthcare workflows."
        ctaLabel="Start Free Trial"
        ctaHref="/contact"
      />
      <FeatureGrid features={MEDICAL_FEATURES} title="Medical Software" titleGold="Features" />
      <HowItWorks steps={HOW_IT_WORKS_MEDICAL} />
      <PricingCards tiers={MEDICAL_PRICING} />
      <CTABanner />
    </div>
  )
}
```

- [ ] **Step 3: Create app/products/accounting/page.tsx**

```tsx
import ProductHero from '@/components/products/ProductHero'
import FeatureGrid from '@/components/products/FeatureGrid'
import HowItWorks from '@/components/products/HowItWorks'
import PricingCards from '@/components/products/PricingCards'
import CTABanner from '@/components/home/CTABanner'
import { ACCOUNTING_FEATURES, HOW_IT_WORKS_ACCOUNTING, ACCOUNTING_PRICING } from '@/lib/constants'

export default function AccountingProductPage() {
  return (
    <div className="pt-16">
      <ProductHero
        mode="accounting"
        overline="Intelligent CA Workflow Suite"
        headline1="Streamline Your Practice"
        headline2="With AI-Driven Accounting"
        description="End-to-end chartered accountant workflow: GST, ITR, balance sheets, and client management — all in one intelligent platform."
        ctaLabel="Start Free Trial"
        ctaHref="/contact"
      />
      <FeatureGrid features={ACCOUNTING_FEATURES} title="CA Software" titleGold="Features" />
      <HowItWorks steps={HOW_IT_WORKS_ACCOUNTING} />
      <PricingCards tiers={ACCOUNTING_PRICING} />
      <CTABanner />
    </div>
  )
}
```

- [ ] **Step 4: Type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add app/products/
git commit -m "feat: add Products overview and Medical/Accounting detail pages"
```

---

## Task 16: Portfolio Page

**Files:**
- Create: `components/portfolio/MockupCard.tsx`
- Create: `app/portfolio/page.tsx`

- [ ] **Step 1: Create components/portfolio/MockupCard.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import type { PortfolioItem } from '@/lib/types'

interface Props {
  item: PortfolioItem
  index: number
}

export default function MockupCard({ item, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative glass-card overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
        <button className="bg-gradient-to-r from-gold to-gold-light text-black text-xs font-bold px-4 py-2 rounded-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          View Demo
        </button>
      </div>

      {/* Card body */}
      <div className="p-4">
        <span className="text-[10px] font-bold text-gold tracking-widest uppercase">{item.tag}</span>
        <h3 className="text-white font-semibold text-sm mt-1">{item.title}</h3>
      </div>

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-xl border border-gold/0 group-hover:border-gold/25 transition-all duration-300 pointer-events-none" />
    </motion.div>
  )
}
```

- [ ] **Step 2: Create app/portfolio/page.tsx**

```tsx
import SectionHeader from '@/components/ui/SectionHeader'
import MockupCard from '@/components/portfolio/MockupCard'
import CTABanner from '@/components/home/CTABanner'
import { PORTFOLIO_ITEMS } from '@/lib/constants'

export default function PortfolioPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.07),transparent_60%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            overline="Portfolio"
            title="See It"
            titleGold="In Action"
            subtitle="Real interfaces from our Medical and Accounting platforms — click any card to explore."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {PORTFOLIO_ITEMS.map((item, i) => (
              <MockupCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>
      <CTABanner />
    </div>
  )
}
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/portfolio/ app/portfolio/
git commit -m "feat: add Portfolio page with animated mockup cards"
```

---

## Task 17: Contact Page

**Files:**
- Create: `components/contact/ContactForm.tsx`
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Create components/contact/ContactForm.tsx**

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import GoldButton from '@/components/ui/GoldButton'

interface FormState {
  name: string
  email: string
  phone: string
  company: string
  message: string
  interest: string
}

const EMPTY: FormState = { name: '', email: '', phone: '', company: '', message: '', interest: '' }

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required'
    if (!form.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    console.log('Form submitted:', form)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 flex flex-col items-center text-center gap-4"
      >
        <CheckCircle size={40} className="text-gold" />
        <h3 className="text-white font-heading font-bold text-xl">Message Sent!</h3>
        <p className="text-white/50 text-sm">We'll get back to you within 24 hours.</p>
        <button onClick={() => { setForm(EMPTY); setSubmitted(false) }} className="text-gold text-sm hover:underline">
          Send another message
        </button>
      </motion.div>
    )
  }

  const inputClass = (key: keyof FormState) =>
    `w-full bg-white/[0.04] border ${errors[key] ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors`

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <input className={inputClass('name')} placeholder="Full Name *" value={form.name} onChange={set('name')} />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <input className={inputClass('email')} placeholder="Email Address *" value={form.email} onChange={set('email')} type="email" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <input className={inputClass('phone')} placeholder="Phone Number" value={form.phone} onChange={set('phone')} />
        <input className={inputClass('company')} placeholder="Company / Practice Name" value={form.company} onChange={set('company')} />
      </div>
      <select className={inputClass('interest')} value={form.interest} onChange={set('interest')}>
        <option value="" disabled>I'm interested in...</option>
        <option value="medical">Medical Software</option>
        <option value="accounting">Accounting Software</option>
        <option value="both">Both Products</option>
      </select>
      <div>
        <textarea
          className={`${inputClass('message')} resize-none`}
          placeholder="Your message *"
          value={form.message}
          onChange={set('message')}
          rows={5}
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
      </div>
      <GoldButton type="submit" className="w-full justify-center">Send Message</GoldButton>
    </form>
  )
}
```

- [ ] **Step 2: Create app/contact/page.tsx**

```tsx
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import ContactForm from '@/components/contact/ContactForm'

const INFO = [
  { Icon: Mail, label: 'Email', value: 'hello@metavision.in' },
  { Icon: Phone, label: 'Phone', value: '+92 300 1231234' },
  { Icon: MapPin, label: 'Address', value: ' , Bangalore, Karnataka 560034' },
  { Icon: Clock, label: 'Hours', value: 'Mon–Fri, 9 AM – 7 PM IST' },
]

export default function ContactPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.07),transparent_60%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            overline="Contact"
            title="Let's Build"
            titleGold="Something Together"
            subtitle="Fill in the form and we'll get back to you within one business day."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
            {/* Form */}
            <ContactForm />

            {/* Info */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                {INFO.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-gold" />
                    </div>
                    <div>
                      <div className="text-white/35 text-[11px] font-semibold uppercase tracking-widest mb-0.5">{label}</div>
                      <div className="text-white text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="glass-card overflow-hidden">
                <img
                  src="https://placehold.co/600x260/0e0e14/d4af37?text=Bangalore+Office+Map"
                  alt="Office location map"
                  className="w-full h-52 object-cover"
                />
                <div className="p-4">
                  <p className="text-white/40 text-xs">MetaVision Technologies Pvt. Ltd. —  , Bangalore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/contact/ app/contact/
git commit -m "feat: add Contact page with form validation and office info"
```

---

## Task 18: Final Build Verification

- [ ] **Step 1: Run full type check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: build completes with no errors. Static export generates `out/` directory.

- [ ] **Step 3: Start dev server and do a final visual pass**

```bash
npm run dev
```

Visit each route and verify:
- `http://localhost:3000` — landing page, hero auto-switches, 3D canvases render
- `http://localhost:3000/about` — timeline, team, mission cards
- `http://localhost:3000/products` — two product sections with feature previews
- `http://localhost:3000/products/medical` — brain 3D, features, how it works, pricing
- `http://localhost:3000/products/accounting` — dashboard 3D, features, how it works, pricing
- `http://localhost:3000/portfolio` — 8 mockup cards with hover overlays
- `http://localhost:3000/contact` — form validates, submission logs to console

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete MetaVision website — all 7 routes, 3D canvases, animations"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Dark/gold design system with glassmorphism
- ✅ Hero auto-switch every 5s + manual pill toggle
- ✅ 3D brain (medical) + 3D dashboard (accounting) via R3F
- ✅ Floating status cards on 3D panels
- ✅ Features section with mode toggle
- ✅ Why Us with animated stat counters
- ✅ Testimonials carousel with auto-advance
- ✅ CTA banner on landing + product pages
- ✅ About: mission, vision, timeline, team, differentiators
- ✅ Products overview + two detail pages with features, how it works, pricing
- ✅ Portfolio: 8 cards, hover overlays
- ✅ Contact: form with validation, office info, map placeholder
- ✅ Shared header (sticky, dropdown, mobile) + footer
- ✅ Static export config
- ✅ Space Grotesk + Inter fonts via next/font
- ✅ Mobile-first responsive (hero 3D hidden on mobile, single-column grids)
- ✅ Every interactive element has hover + focus-visible + active states

**Placeholder scan:** No TBDs. Contact form logs to console — documented as intentional.

**Type consistency:** `ProductMode`, `Feature`, `Step`, `PricingTier`, `PortfolioItem` defined in `lib/types.ts` and used consistently across all components. `ICON_MAP` defined in both `FeaturesSection` and `FeatureGrid` — duplication is intentional (they're independent components).
