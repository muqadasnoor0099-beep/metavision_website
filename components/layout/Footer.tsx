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

// ─── SVG canvas ──────────────────────────────────────────────────────────────
const VW = 1440
const VH = 340
const FY = VH * 0.50   // all lines converge here on the RIGHT edge

// 8 start positions spread across the left edge (4 above, 4 below centre)
const Y_FRACS = [0.05, 0.18, 0.31, 0.44, 0.56, 0.69, 0.82, 0.95]

/**
 * Two cubic-bezier segments joined at the path midpoint.
 *
 * Key rule: BOTH humps go in the SAME direction —
 *   • Lines above centre  →  both humps arc UPWARD   (away from centre)
 *   • Lines below centre  →  both humps arc DOWNWARD (away from centre)
 *
 * This is different from a sine wave (alternating up/down).
 * The result looks like a cable or ribbon that bows consistently
 * in one direction while travelling left → right.
 *
 * All lines END at (VW, FY): full-width, converging at the right-edge centre.
 */
function makePath(yFrac: number): string {
  const sy   = yFrac * VH           // start Y (left edge)
  const ey   = FY                    // end Y   (right edge, converge)
  const midY = (sy + ey) / 2        // Y at the path mid-x (VW/2)
  const dist = Math.abs(yFrac - 0.5)
  const amp1 = dist * 140 + 22      // first hump — larger
  const amp2 = dist * 85  + 14      // second hump — slightly smaller (natural decay)

  // −1 = above centre (humps go UP = decrease Y)
  // +1 = below centre (humps go DOWN = increase Y)
  const dir = yFrac < 0.5 ? -1 : 1

  // Segment 1 ─ (0, sy) → (VW/2, midY)  : FIRST hump
  const cx1a = VW * 0.17,  cy1a = sy   + dir * amp1          // strong pull
  const cx1b = VW * 0.40,  cy1b = midY + dir * amp1 * 0.32   // ease toward midY

  // Segment 2 ─ (VW/2, midY) → (VW, ey)  : SECOND hump — same direction as first
  const cx2a = VW * 0.63,  cy2a = midY + dir * amp2           // second hump
  const cx2b = VW * 0.85,  cy2b = ey   + dir * amp2 * 0.10   // slight tail

  return [
    `M 0,${sy}`,
    `C ${cx1a},${cy1a} ${cx1b},${cy1b} ${VW / 2},${midY}`,
    `C ${cx2a},${cy2a} ${cx2b},${cy2b} ${VW},${ey}`,
  ].join(' ')
}

const LINES = Y_FRACS.map((yf, i) => ({
  d:    makePath(yf),
  dist: Math.abs(yf - 0.5),  // 0 = centre, ~0.46 = outer edge
  spd:  1.0 + i * 0.13,      // each line streams at slightly different speed
  del:  -(i * 0.36),          // negative = pre-offset so all are mid-animation on load
}))

// ─────────────────────────────────────────────────────────────────────────────
export default function Footer() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const opMul     = isDark ? 1 : 0.38   // dampen in light mode

  return (
    <footer
      className="relative border-t border-gold/10 overflow-hidden"
      style={{ backgroundColor: 'var(--clr-bg)' }}
    >
      <style>{`
        /* Particles flow left → right along each path */
        @keyframes mv-stream {
          from { stroke-dashoffset:  0; }
          to   { stroke-dashoffset: -20; }
        }
        @keyframes mv-focal-pulse {
          0%,100% { opacity: .65; transform: scale(1);   }
          50%      { opacity: .15; transform: scale(2.2); }
        }
      `}</style>

      {/* ── Wave SVG ──────────────────────────────────────────────────────── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Soft neon glow on every line */}
          <filter id="mv-glow" x="-5%" y="-100%" width="110%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="b"/>
            <feMerge>
              <feMergeNode in="b"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Right-edge convergence glow */}
          <radialGradient id="mv-rglow" cx="100%" cy="50%" r="30%">
            <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </radialGradient>

          {/* Left-edge fade: lines emerge softly from nothing */}
          <linearGradient id="mv-lfade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="white" stopOpacity="0"/>
            <stop offset="9%"  stopColor="white" stopOpacity="1"/>
            <stop offset="100%" stopColor="white" stopOpacity="1"/>
          </linearGradient>
          <mask id="mv-lmask">
            <rect width={VW} height={VH} fill="url(#mv-lfade)"/>
          </mask>
        </defs>

        {/* Ambient glow at the right-edge convergence point */}
        <rect
          x={VW * 0.72} y={0} width={VW * 0.28} height={VH}
          fill="url(#mv-rglow)"
          style={{ opacity: opMul * 0.75 }}
        />

        {/* All wave lines inside the left-edge fade mask */}
        <g mask="url(#mv-lmask)">
          {LINES.map(({ d, dist, spd, del }, i) => {
            // Outer lines are more opaque — inner (near-centre) lines are subtler
            const threadOp = (0.025 + dist * 0.055) * opMul
            const flowOp   = (0.16  + dist * 0.18 ) * opMul

            return (
              <g key={i} filter="url(#mv-glow)">
                {/* Always-visible faint thread */}
                <path
                  d={d} fill="none"
                  stroke="#2563eb" strokeWidth="1"
                  strokeOpacity={threadOp}
                />
                {/* Animated streaming dashes (particles) */}
                <path
                  d={d} fill="none"
                  stroke="#93c5fd" strokeWidth="1.6"
                  strokeOpacity={flowOp}
                  strokeDasharray="7 13"
                  style={{ animation: `mv-stream ${spd}s linear ${del}s infinite` }}
                />
              </g>
            )
          })}
        </g>

        {/* Convergence dot at right-edge centre — pulsing */}
        <circle
          cx={VW} cy={FY} r="4" fill="#93c5fd"
          style={{
            opacity: opMul * 0.8,
            animation: 'mv-focal-pulse 2.6s ease-in-out infinite',
            transformOrigin: `${VW}px ${FY}px`,
          }}
        />
      </svg>

      {/* ── Footer content ────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Logo className="h-14 w-auto drop-shadow-[0_0_24px_rgba(59,130,246,0.25)]"/>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Premium AI software for healthcare and finance professionals — built for teams worldwide.
            </p>
            <div className="flex gap-3">
              {[Globe, Share2, Code2].map((Icon, i) => (
                <a
                  key={i} href="#"
                  className="w-8 h-8 rounded-lg border border-white/10 hover:border-gold/30 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200"
                >
                  <Icon size={14}/>
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
                <Mail size={14} className="text-gold shrink-0"/>
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
