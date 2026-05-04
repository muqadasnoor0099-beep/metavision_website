import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import ContactForm from '@/components/contact/ContactForm'

const INFO = [
  { Icon: Mail, label: 'Email', value: 'hello@metavision.pk' },
  { Icon: Phone, label: 'Phone', value: '+92 300 1231234' },
  { Icon: MapPin, label: 'Address', value: 'Blue Area, Islamabad, 44000, Pakistan' },
  { Icon: Clock, label: 'Hours', value: 'Mon–Fri, 9 AM – 6 PM PKT' },
]

export default function ContactPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.07),transparent_60%)]" />
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

              {/* Map — Islamabad, Blue Area */}
              <div className="glass-card overflow-hidden">
                <iframe
                  title="MetaVision Islamabad Office"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=73.0133%2C33.7015%2C73.0933%2C33.7415&layer=mapnik&marker=33.7215%2C73.0533"
                  className="w-full h-52 border-0"
                  loading="lazy"
                  allowFullScreen
                />
                <div className="p-4 flex items-center gap-2">
                  <MapPin size={12} className="text-gold shrink-0" />
                  <p className="text-white/40 text-xs">MetaVision Technologies Pvt. Ltd. — Blue Area, Islamabad, Pakistan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
