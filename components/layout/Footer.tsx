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

// ─── Water-wave config ───────────────────────────────────────────────────────
// SVG canvas: 1440 × 320 viewBox.
// Each path is drawn 2880 wide (2×VW) so translating by −VW loops seamlessly.
const VW = 1440
const VH = 320

// 6 wave layers — closer waves (centre) are faster, larger, and more opaque.
// yPct  : vertical position as % of VH
// amp   : peak-to-trough in SVG units
// dur   : one full loop in seconds (slower = feels more distant)
// phase : negative begin offset so waves are already mid-cycle on page load
// op    : stroke-opacity (dark mode); halved automatically in light mode
const WAVES = [
  { yPct: 14, amp: 10, dur: 28, phase: -3,  op: 0.035, sw: 0.9,  color: '#93c5fd' },
  { yPct: 30, amp: 18, dur: 20, phase: -9,  op: 0.055, sw: 1.1,  color: '#60a5fa' },
  { yPct: 46, amp: 26, dur: 14, phase: -5,  op: 0.08,  sw: 1.4,  color: '#3b82f6' },
  { yPct: 60, amp: 22, dur: 17, phase: -12, op: 0.065, sw: 1.25, color: '#2563eb' },
  { yPct: 75, amp: 16, dur: 22, phase: -7,  op: 0.045, sw: 1.0,  color: '#1d4ed8' },
  { yPct: 88, amp: 12, dur: 32, phase: -1,  op: 0.03,  sw: 0.85, color: '#1e40af' },
]

/**
 * Smooth sine wave drawn with quadratic bezier segments.
 * The path is 2× the viewBox width so a -VW SVG-unit translate loops cleanly.
 * 4 full cycles × 2 segments each = 8 Q commands.
 */
function wavePath(yPct: number, amp: number): string {
  const y0    = (yPct / 100) * VH
  const total = VW * 2            // path width = 2 × 1440 = 2880
  const segs  = 8                 // 4 full cycles × 2 half-cycles
  const sw    = total / segs      // 360 units per half-cycle

  let d = `M 0,${y0.toFixed(2)}`
  for (let i = 0; i < segs; i++) {
    const cx  = sw * i + sw / 2
    const cy  = y0 + (i % 2 === 0 ? -amp : amp)   // alternate peak / trough
    const ex  = sw * (i + 1)
    d += ` Q ${cx.toFixed(2)},${cy.toFixed(2)} ${ex.toFixed(2)},${y0.toFixed(2)}`
  }
  return d
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Footer() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const opMul     = isDark ? 1 : 0.45

  return (
    <footer
      className="relative border-t border-gold/10 overflow-hidden"
      style={{ backgroundColor: 'var(--clr-bg)' }}
    >
      {/* ── Water-wave SVG ──────────────────────────────────────────────── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Soft glow — makes each wave look luminous */}
          <filter id="wglow" x="-2%" y="-200%" width="104%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="b"/>
            <feMerge>
              <feMergeNode in="b"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Vertical fade mask: waves fade at very top + bottom of footer */}
          <linearGradient id="wvfade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="0"  />
            <stop offset="18%"  stopColor="white" stopOpacity="1"  />
            <stop offset="82%"  stopColor="white" stopOpacity="1"  />
            <stop offset="100%" stopColor="white" stopOpacity="0"  />
          </linearGradient>
          <mask id="wvmask">
            <rect width={VW} height={VH} fill="url(#wvfade)" />
          </mask>
        </defs>

        <g mask="url(#wvmask)" filter="url(#wglow)">
          {WAVES.map(({ yPct, amp, dur, phase, op, sw, color }, i) => (
            <path
              key={i}
              d={wavePath(yPct, amp)}
              fill="none"
              stroke={color}
              strokeWidth={sw}
              strokeOpacity={op * opMul}
              strokeLinecap="round"
            >
              {/*
                animateTransform in SVG user-units:
                translating by −VW (=−1440) moves the 2880-wide path
                exactly one loop length — works on every screen size because
                the SVG scales with preserveAspectRatio="none".
              */}
              <animateTransform
                attributeName="transform"
                type="translate"
                from={`0,0`}
                to={`${-VW},0`}
                dur={`${dur}s`}
                begin={`${phase}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}
        </g>
      </svg>

      {/* ── Footer content ───────────────────────────────────────────────── */}
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
                {links.map(link => (
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

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-white/[0.05] py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">© 2026 MetaVision Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-white/50 text-xs">Built with ♥ by the MetaVision team</p>
        </div>
      </div>
    </footer>
  )
}
