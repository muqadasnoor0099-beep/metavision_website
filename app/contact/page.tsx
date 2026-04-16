import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import ContactForm from '@/components/contact/ContactForm'

const INFO = [
  { Icon: Mail, label: 'Email', value: 'hello@metavision.in' },
  { Icon: Phone, label: 'Phone', value: '+92 300 1231234' },
  { Icon: MapPin, label: 'Address', value: 'Koramangala, Bangalore, Karnataka 560034' },
  { Icon: Clock, label: 'Hours', value: 'Mon–Fri, 9 AM – 7 PM IST' },
]

export default function ContactPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.07),transparent_60%)]" />
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

              {/* Map placeholder */}
              <div className="glass-card overflow-hidden">
                <img
                  src="https://placehold.co/600x260/0e0e14/d4af37?text=Bangalore+Office+Map"
                  alt="Office location map"
                  className="w-full h-52 object-cover"
                />
                <div className="p-4">
                  <p className="text-white/40 text-xs">MetaVision Technologies Pvt. Ltd. — Koramangala, Bangalore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
