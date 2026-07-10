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

// ─── SVG canvas ────────────────────────────────────────────────────────────────
const VW = 1440
const VH = 340

// Lines start spread across the LEFT edge and converge at this focal point
const FX = VW * 0.68
const FY = VH * 0.50

// 8 starting Y positions, evenly spread left-edge top→bottom
const Y_STARTS = [0.04, 0.17, 0.30, 0.43, 0.57, 0.70, 0.83, 0.96]

/**
 * Build one cubic-bezier path from (0, startY) → focal point (FX, FY).
 * Lines above center curve UP first then arc down; lines below curve DOWN then arc up.
 * This creates the spread-and-converge "funnel" with a natural wave.
 */
function makePath(yFrac: number): string {
  const sy = yFrac * VH
  const signed = yFrac - 0.5                   // negative = above center
  const amp    = Math.abs(signed) * 130 + 20   // outer lines wave more

  // CP1: dramatic first sweep away from center (creates the divergent wave look)
  const cp1x = VW * 0.20
  const cp1y = sy - signed * amp * 2.4

  // CP2: pulls back toward the focal Y (convergence arc)
  const cp2x = VW * 0.50
  const cp2y = FY + signed * amp * 0.45

  return `M 0,${sy} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${FX},${FY}`
}

const LINES = Y_STARTS.map((yf, i) => ({
  d:    makePath(yf),
  dist: Math.abs(yf - 0.5),        // distance from center (0=center, 0.5=outer)
  spd:  1.4 + i * 0.18,            // stream animation speed (s per dash-cycle)
  del:  i * 0.22,                  // stagger delay (s)
}))

// ─────────────────────────────────────────────────────────────────────────────
export default function Footer() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'

  // In light mode dampen opacity so lines don't compete with light background
  const opMul = isDark ? 1 : 0.45

  return (
    <footer
      className="relative border-t border-gold/10 overflow-hidden"
      style={{ backgroundColor: 'var(--clr-bg)' }}
    >
      {/* ── CSS keyframes ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes mv-stream {
          from { stroke-dashoffset: 20; }
          to   { stroke-dashoffset:  0; }
        }
        @keyframes mv-pulse {
          0%,100% { opacity: .55; r: 4; }
          50%      { opacity: .15; r: 8; }
        }
        @keyframes mv-pulse-ring {
          0%,100% { opacity: .12; r: 18; }
          50%      { opacity: .03; r: 32; }
        }
      `}</style>

      {/* ── Converging-lines SVG ──────────────────────────────────────────── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Soft glow filter for lines */}
          <filter id="mv-glow" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial glow at focal point */}
          <radialGradient id="mv-focal-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#2563eb" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0"   />
          </radialGradient>

          {/* Left-edge fade: lines are invisible at x=0 and solidify quickly */}
          <linearGradient id="mv-fade-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="white" stopOpacity="0"   />
            <stop offset="12%" stopColor="white" stopOpacity="1"   />
            <stop offset="100%" stopColor="white" stopOpacity="1"  />
          </linearGradient>
          <mask id="mv-edge-mask">
            <rect width={VW} height={VH} fill="url(#mv-fade-left)" />
          </mask>
        </defs>

        {/* Focal point glow circle */}
        <circle cx={FX} cy={FY} r="32" fill="url(#mv-focal-glow)"
          style={{ opacity: opMul * 0.9 }} />
        <circle cx={FX} cy={FY} r="18" fill="url(#mv-focal-glow)"
          style={{ opacity: opMul * 0.7 }} />

        <g mask="url(#mv-edge-mask)">
          {LINES.map(({ d, dist, spd, del }, i) => {
            // Outer lines are brighter; center line is subtler
            const baseOp   = (0.04 + dist * 0.06) * opMul
            const streamOp = (0.22 + dist * 0.12) * opMul

            return (
              <g key={i} filter="url(#mv-glow)">
                {/* Static background thread — always visible */}
                <path
                  d={d}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1"
                  strokeOpacity={baseOp}
                />

                {/* Animated flowing dashes — streaming particles */}
                <path
                  d={d}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                  strokeOpacity={streamOp}
                  strokeDasharray="6 14"
                  style={{
                    animation: `mv-stream ${spd}s linear ${del}s infinite`,
                  }}
                />
              </g>
            )
          })}
        </g>

        {/* Focal point dot + pulsing ring */}
        <circle
          cx={FX} cy={FY}
          fill="#93c5fd"
          style={{
            opacity: opMul,
            animation: 'mv-pulse 2.8s ease-in-out infinite',
          }}
          r="4"
        />
        <circle
          cx={FX} cy={FY}
          fill="none"
          stroke="#2563eb"
          strokeWidth="1"
          style={{
            opacity: opMul,
            animation: 'mv-pulse-ring 2.8s ease-in-out infinite',
          }}
          r="18"
        />
      </svg>

      {/* ── Footer content ────────────────────────────────────────────────── */}
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
