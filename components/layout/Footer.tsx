'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Mail, Globe, Share2, Code2,
  Stethoscope, Brain, HeartPulse, Activity, Pill,
  Calculator, Briefcase, FileSpreadsheet, BarChart3, Receipt, FileCheck,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'

const FOOTER_COLS = {
  Products: [
    { label: 'NexLink MedAI', href: '/products/medical' },
    { label: 'Workflow Management System', href: '/products/accounting' },
    { label: 'All Products', href: '/products' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ],
}

// Floating icons drifting in the footer background — half medical (NexLink MedAI),
// half workflow/accounting (Workflow Management System).
const FLOATING_ICONS = [
  { Icon: Stethoscope,     top: '10%', left: '5%',  size: 46, duration: 9,  delay: 0 },
  { Icon: Brain,           top: '60%', left: '3%',  size: 40, duration: 11, delay: 0.8 },
  { Icon: HeartPulse,      top: '32%', left: '15%', size: 32, duration: 8,  delay: 1.6 },
  { Icon: Activity,        top: '80%', left: '13%', size: 36, duration: 10, delay: 0.4 },
  { Icon: Pill,            top: '6%',  left: '25%', size: 28, duration: 7.5, delay: 2.2 },

  { Icon: Calculator,      top: '12%', left: '88%', size: 44, duration: 9.5, delay: 0.3 },
  { Icon: Briefcase,       top: '62%', left: '92%', size: 40, duration: 10.5, delay: 1.2 },
  { Icon: FileSpreadsheet, top: '34%', left: '80%', size: 34, duration: 8.5, delay: 1.9 },
  { Icon: BarChart3,       top: '82%', left: '83%', size: 36, duration: 9,  delay: 0.6 },
  { Icon: Receipt,         top: '4%',  left: '72%', size: 28, duration: 7,  delay: 2.6 },
  { Icon: FileCheck,       top: '48%', left: '95%', size: 26, duration: 8,  delay: 1.4 },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/10 overflow-hidden" style={{ backgroundColor: 'var(--clr-bg)' }}>

      {/* Floating product icons background */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        {FLOATING_ICONS.map(({ Icon, top, left, size, duration, delay }, i) => (
          <motion.div
            key={i}
            className="absolute text-gold"
            style={{ top, left, opacity: 0.22 }}
            animate={{
              y: [0, -16, 0],
              rotate: [0, i % 2 === 0 ? 8 : -8, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon size={size} strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center">
              <Logo className="h-14 w-auto drop-shadow-[0_0_24px_rgba(59,130,246,0.25)]" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Premium AI software for healthcare and finance professionals — built for teams worldwide.
            </p>
            <div className="flex gap-3 mt-1">
              {[Globe, Share2, Code2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg border border-white/10 hover:border-gold/30 flex items-center justify-center text-white/65 hover:text-white transition-all"
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
                    <Link href={link.href} className="text-white/70 hover:text-white text-sm transition-colors">
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
              <li className="flex items-start gap-2.5 text-white/70 text-sm">
                <Mail size={14} className="text-gold mt-0.5 shrink-0" />
                metavision786@gmail.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/[0.05] py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">© 2026 MetaVision Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-white/50 text-xs">Built with ♥ by the MetaVision team</p>
        </div>
      </div>
    </footer>
  )
}
