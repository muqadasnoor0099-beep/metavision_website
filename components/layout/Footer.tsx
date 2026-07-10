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

// ─── Canvas ──────────────────────────────────────────────────────────────────
const VW = 1440
const VH = 380

/**
 * Smooth sinusoidal wave path using cubic bezier curves (sharper crests,
 * rounder troughs — closer to real Stokes waves than pure sine).
 *
 * Path is 2×VW wide → translating by −VW loops seamlessly.
 * cycles: how many full up/down cycles across 2×VW.
 */
function crestPath(yPct: number, amp: number, cycles = 5): string {
  const y0   = (yPct / 100) * VH
  const tw   = VW * 2
  const segW = tw / (cycles * 2)   // width of one half-cycle

  let d = `M 0,${y0.toFixed(1)}`
  for (let i = 0; i < cycles * 2; i++) {
    const x0 = segW * i
    const x1 = x0 + segW
    const dir = i % 2 === 0 ? -1 : 1   // −1 = up (crest), +1 = down (trough)

    // Cubic bezier: sharp crest, flat trough — like real water
    // Control pts pulled further out for crests, pulled in for troughs
    const pull = dir === -1 ? 1.6 : 0.8
    const cx1  = x0 + segW * 0.25
    const cy1  = y0 + dir * amp * pull
    const cx2  = x0 + segW * 0.75
    const cy2  = y0 + dir * amp * pull
    d += ` C ${cx1.toFixed(1)},${cy1.toFixed(1)} ${cx2.toFixed(1)},${cy2.toFixed(1)} ${x1.toFixed(1)},${y0.toFixed(1)}`
  }
  return d
}

/** Closed filled wave: wave top + rectangle down to footer bottom. */
function fillPath(yPct: number, amp: number, cycles = 5): string {
  const tw = VW * 2
  return `${crestPath(yPct, amp, cycles)} L ${tw},${VH} L 0,${VH} Z`
}

// ─── Wave layers ─────────────────────────────────────────────────────────────
// Each layer = a filled area below the wave crest + a bright crest stroke.
// Layers are ordered back (slow, low, dark) → front (fast, high, bright).
const LAYERS = [
  { yPct: 82, amp: 14, dur: 32, phase: -5,  fill: '#1e3a8a', crestC: '#3b82f6', fillOp: 0.12, crestOp: 0.20, sw: 0.9, cycles: 4 },
  { yPct: 70, amp: 20, dur: 24, phase: -11, fill: '#1d4ed8', crestC: '#3b82f6', fillOp: 0.10, crestOp: 0.25, sw: 1.1, cycles: 4 },
  { yPct: 57, amp: 26, dur: 18, phase: -7,  fill: '#2563eb', crestC: '#60a5fa', fillOp: 0.09, crestOp: 0.32, sw: 1.3, cycles: 5 },
  { yPct: 44, amp: 30, dur: 13, phase: -3,  fill: '#3b82f6', crestC: '#93c5fd', fillOp: 0.07, crestOp: 0.40, sw: 1.5, cycles: 5 },
  { yPct: 32, amp: 22, dur: 10, phase: -8,  fill: '#60a5fa', crestC: '#bfdbfe', fillOp: 0.05, crestOp: 0.50, sw: 1.8, cycles: 6 },
]

// ─────────────────────────────────────────────────────────────────────────────
export default function Footer() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const opMul     = isDark ? 1 : 0.35

  return (
    <footer
      className="relative border-t border-gold/10 overflow-hidden"
      style={{ backgroundColor: 'var(--clr-bg)' }}
    >
      {/* ── Ocean wave SVG ──────────────────────────────────────────────── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Multi-pass glow for crest lines — gives a neon water-light look */}
          <filter id="crest-glow" x="-4%" y="-300%" width="108%" height="700%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="soft"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="hard"/>
            <feMerge>
              <feMergeNode in="soft"/>
              <feMergeNode in="hard"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Subtle glow on filled areas */}
          <filter id="fill-glow" x="-2%" y="-10%" width="104%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Per-layer fill gradients: transparent at crest → solid at bottom */}
          {LAYERS.map(({ fill }, i) => (
            <linearGradient key={i} id={`wfg${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={fill} stopOpacity="0"   />
              <stop offset="40%"  stopColor={fill} stopOpacity="0.5" />
              <stop offset="100%" stopColor={fill} stopOpacity="1"   />
            </linearGradient>
          ))}

          {/* Top-fade mask: upper portion of footer stays clean */}
          <linearGradient id="top-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="white" stopOpacity="0" />
            <stop offset="22%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="1"/>
          </linearGradient>
          <mask id="top-mask">
            <rect width={VW} height={VH} fill="url(#top-fade)" />
          </mask>
        </defs>

        <g mask="url(#top-mask)">
          {LAYERS.map(({ yPct, amp, dur, phase, fillOp, crestOp, sw, crestC, cycles }, i) => (
            <g key={i}>
              {/* ── Filled wave body ─────────────────────────────────── */}
              <path
                d={fillPath(yPct, amp, cycles)}
                fill={`url(#wfg${i})`}
                fillOpacity={fillOp * opMul}
                filter="url(#fill-glow)"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0,0"
                  to={`${-VW},0`}
                  dur={`${dur}s`}
                  begin={`${phase}s`}
                  repeatCount="indefinite"
                />
              </path>

              {/* ── Glowing crest line on top of each wave ───────────── */}
              <path
                d={crestPath(yPct, amp, cycles)}
                fill="none"
                stroke={crestC}
                strokeWidth={sw}
                strokeOpacity={crestOp * opMul}
                strokeLinecap="round"
                filter="url(#crest-glow)"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0,0"
                  to={`${-VW},0`}
                  dur={`${dur}s`}
                  begin={`${phase}s`}
                  repeatCount="indefinite"
                />
              </path>
            </g>
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
