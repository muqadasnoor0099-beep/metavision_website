import Link from 'next/link'
import { Mail, Globe, Code2, ArrowRight } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import OrbitingCirclesGlobe from '@/components/ui/orbiting-circles-02'

const FOOTER_COLS = {
  Products: [
    { label: 'NexLink MedAI',             href: '/products/medical' },
    { label: 'Workflow Management',        href: '/products/accounting' },
    { label: 'All Products',              href: '/products' },
  ],
  Company: [
    { label: 'About Us',  href: '/about' },
    { label: 'Services',  href: '/services' },
    { label: 'Contact',   href: '/contact' },
  ],
}

const SOCIAL = [
  {
    label: 'Website',
    href: 'https://metavision.world',
    icon: <Globe size={15} />,
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/metavisionworld',
    icon: (
      <svg width="13" height="13" viewBox="0 0 1200 1227" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6899H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: <Code2 size={15} />,
  },
]

export default function Footer() {
  return (
    <footer
      className="relative border-t border-gold/10 overflow-hidden"
      style={{ backgroundColor: 'var(--clr-bg)' }}
    >
      {/* ── Orbiting globe background ── */}
      <div className="pointer-events-none select-none absolute inset-x-0 bottom-0 opacity-30">
        <OrbitingCirclesGlobe />
      </div>

      {/* ── Top gradient glow ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.4) 50%, transparent 100%)' }}
      />

      {/* ── CTA strip ── */}
      <div className="relative z-10 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/55 text-sm text-center sm:text-left">
            Ready to transform your workflows with AI?
          </p>
          <Link
            href="/demo"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-white transition-colors duration-200 whitespace-nowrap"
          >
            Request a Demo
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand — full width on mobile, 1 col on desktop */}
          <div className="flex flex-col gap-5 md:col-span-2 lg:col-span-1">
            <div className="w-36 sm:w-44">
              <Logo className="w-full h-auto drop-shadow-[0_0_24px_rgba(59,130,246,0.25)]" />
            </div>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              Premium AI software for healthcare and finance professionals — built for teams worldwide.
            </p>
            {/* Social icons — touch-friendly 44×44 */}
            <div className="flex gap-2.5">
              {SOCIAL.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-11 h-11 rounded-xl border border-white/10 hover:border-gold/40 hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200 active:scale-95"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns — 2-col grid on mobile so they sit side-by-side */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            {Object.entries(FOOTER_COLS).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white/90 font-semibold text-xs uppercase tracking-widest mb-4">{title}</h4>
                <ul className="flex flex-col gap-3">
                  {links.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-white/50 hover:text-white text-sm transition-colors duration-200 leading-snug"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/90 font-semibold text-xs uppercase tracking-widest mb-4">Contact</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:admin@metavision.world"
                  className="group inline-flex items-center gap-2.5 text-white/50 hover:text-white text-sm transition-colors duration-200"
                >
                  <Mail size={14} className="text-gold shrink-0" />
                  <span>admin@metavision.world</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-10 border-t border-white/[0.05] py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/35 text-xs text-center sm:text-left">
            © 2026 MetaVision Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-white/35 text-xs">Built with ♥ by the MetaVision team</p>
        </div>
      </div>
    </footer>
  )
}
