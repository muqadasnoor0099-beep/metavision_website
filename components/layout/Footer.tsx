import Link from 'next/link'
import { Mail, Globe, Share2, Code2 } from 'lucide-react'
import Logo from '@/components/ui/Logo'

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

export default function Footer() {
  return (
    <footer
      className="relative border-t border-gold/10 overflow-hidden"
      style={{ backgroundColor: 'var(--clr-bg)' }}
    >
      {/* ── Ocean wave silhouette — crests from the right ────────────────── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-x-0 bottom-0 w-full"
        style={{ height: '260px' }}
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Wave body gradient: fades in from bottom, transparent at crest */}
          <linearGradient id="wv-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1d4ed8" stopOpacity="0"   />
            <stop offset="45%"  stopColor="#1d4ed8" stopOpacity="0.10"/>
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.22"/>
          </linearGradient>

          {/* Second wave layer */}
          <linearGradient id="wv-fill2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2563eb" stopOpacity="0"   />
            <stop offset="50%"  stopColor="#2563eb" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.18"/>
          </linearGradient>

          {/* Neon crest glow — 3 passes */}
          <filter id="wv-crest" x="-2%" y="-200%" width="104%" height="600%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8"   result="g1"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="3"   result="g2"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="g3"/>
            <feMerge>
              <feMergeNode in="g1"/>
              <feMergeNode in="g2"/>
              <feMergeNode in="g3"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Soft glow under the crest for extra depth */}
          <filter id="wv-bloom" x="-2%" y="-100%" width="104%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Right-side mask: wave is strongest on the right, fades left */}
          <linearGradient id="wv-mask-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="white" stopOpacity="0"  />
            <stop offset="28%"  stopColor="white" stopOpacity="0.6"/>
            <stop offset="55%"  stopColor="white" stopOpacity="1"  />
            <stop offset="100%" stopColor="white" stopOpacity="1"  />
          </linearGradient>
          <mask id="wv-mask">
            <rect width="1440" height="260" fill="url(#wv-mask-grad)" />
          </mask>
        </defs>

        <g mask="url(#wv-mask)">
          {/* ── Back wave (deepest, tallest crest on right) ── */}
          <path
            d="M 0,260 L 1440,260 L 1440,55
               C 1280,30  1100,110 920,85
               C 740,60   560,140  380,125
               C 220,112  90,150   0,165 Z"
            fill="url(#wv-fill)"
          />
          {/* Crest stroke for back wave */}
          <path
            d="M 0,165
               C 90,150   220,112  380,125
               C 560,140  740,60   920,85
               C 1100,110 1280,30  1440,55"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeOpacity="0.55"
            filter="url(#wv-crest)"
          />

          {/* ── Front wave (lower, wider curves) ── */}
          <path
            d="M 0,260 L 1440,260 L 1440,120
               C 1300,95  1120,165  940,148
               C 760,131  580,190  400,175
               C 240,162  100,195  0,210 Z"
            fill="url(#wv-fill2)"
          />
          {/* Crest stroke for front wave — brighter */}
          <path
            d="M 0,210
               C 100,195  240,162  400,175
               C 580,190  760,131  940,148
               C 1120,165 1300,95  1440,120"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1.6"
            strokeOpacity="0.70"
            filter="url(#wv-crest)"
          />

          {/* ── Foam crest accent — thin bright line at peak ── */}
          <path
            d="M 820,76
               C 920,58   1060,38  1180,46
               C 1280,52  1380,44  1440,50"
            fill="none"
            stroke="#bfdbfe"
            strokeWidth="1.2"
            strokeOpacity="0.85"
            strokeLinecap="round"
            filter="url(#wv-crest)"
          />

          {/* Ambient bloom under peak */}
          <ellipse cx="1200" cy="80" rx="320" ry="55"
            fill="#2563eb" fillOpacity="0.10" filter="url(#wv-bloom)" />
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

      <div className="relative z-10 border-t border-white/[0.05] py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">© 2026 MetaVision Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-white/50 text-xs">Built with ♥ by the MetaVision team</p>
        </div>
      </div>
    </footer>
  )
}
