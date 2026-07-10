'use client'

import Link from 'next/link'
import { Mail, Globe, Share2, Code2 } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useTheme } from '@/components/providers/ThemeProvider'

const FOOTER_COLS = {
  Products: [
    { label: 'NexLink MedAI',             href: '/products/medical' },
    { label: 'Workflow Management System', href: '/products/accounting' },
    { label: 'All Products',               href: '/products' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact',  href: '/contact' },
  ],
}

// Wave config: y = vertical position (% of SVG height), amp = peak height (px),
// duration = seconds for one full loop, opacity = base opacity in dark mode.
const WAVES = [
  { y: 28, amp: 22, duration: 18, opacity: 0.08 },
  { y: 50, amp: 30, duration: 26, opacity: 0.055 },
  { y: 68, amp: 16, duration: 34, opacity: 0.04 },
  { y: 86, amp: 24, duration: 21, opacity: 0.03 },
]

const SVG_W = 2880   // 2× viewport so translateX(-50%) loops seamlessly
const SVG_H = 320

/** Quadratic-bezier sine wave spanning the full SVG_W. */
function wavePath(yPct: number, amp: number): string {
  const y0   = (yPct / 100) * SVG_H
  const seg  = SVG_W / 16          // 16 half-cycles
  const pts: string[] = [`M 0 ${y0}`]
  for (let i = 0; i < 16; i++) {
    const cx = seg * i + seg / 2
    const cy = y0 + (i % 2 === 0 ? amp : -amp)
    const ex = seg * (i + 1)
    pts.push(`Q ${cx} ${cy} ${ex} ${y0}`)
  }
  return pts.join(' ')
}

export default function Footer() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <footer
      className="relative border-t border-gold/10 overflow-hidden"
      style={{ backgroundColor: 'var(--clr-bg)' }}
    >
      {/* ── Animated sine-wave background ────────────────────────────────── */}
      <style>{`
        @keyframes mv-wave {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <svg
        aria-hidden="true"
        className="pointer-events-none select-none"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          overflow: 'visible',
        }}
        viewBox={`0 0 ${SVG_W / 2} ${SVG_H}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Mask: waves fade out toward left & right edges */}
          <linearGradient id="wm-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="white" stopOpacity="0" />
            <stop offset="15%"  stopColor="white" stopOpacity="1" />
            <stop offset="85%"  stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="wave-fade-mask">
            <rect width={SVG_W / 2} height={SVG_H} fill="url(#wm-h)" />
          </mask>
        </defs>

        <g mask="url(#wave-fade-mask)">
          {WAVES.map(({ y, amp, duration, opacity }, i) => (
            <path
              key={i}
              d={wavePath(y, amp)}
              fill="none"
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{
                opacity: isDark ? opacity : opacity * 0.55,
                animation: `mv-wave ${duration}s linear infinite`,
                transformOrigin: '0 0',
                willChange: 'transform',
              }}
            />
          ))}
        </g>
      </svg>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Logo className="h-14 w-auto drop-shadow-[0_0_24px_rgba(59,130,246,0.25)]" />
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Premium AI software for healthcare and finance professionals — built for teams worldwide.
            </p>
            <div className="flex gap-3">
              {[Globe, Share2, Code2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg border border-white/10 hover:border-gold/30 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(FOOTER_COLS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-5">{title}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                    >
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
              <li className="flex items-center gap-2.5 text-white/70 text-sm">
                <Mail size={14} className="text-gold shrink-0" />
                admin@metavision.world
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-white/[0.05] py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">© 2026 MetaVision Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-white/50 text-xs">Built with ♥ by the MetaVision team</p>
        </div>
      </div>
    </footer>
  )
}
