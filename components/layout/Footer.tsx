import Link from 'next/link'
import { Mail, Phone, MapPin, Globe, Share2, Code2 } from 'lucide-react'

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
    <footer className="border-t border-gold/10" style={{ backgroundColor: 'var(--clr-bg)' }}>
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
              {[Globe, Share2, Code2].map((Icon, i) => (
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
