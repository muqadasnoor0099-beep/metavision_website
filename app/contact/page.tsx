import { Mail, Clock } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import ContactForm from '@/components/contact/ContactForm'

const INFO = [
  { Icon: Mail, label: 'Email', value: 'admin@metavision.world' },
  { Icon: Clock, label: 'Hours', value: 'Mon–Fri, 9 AM – 6 PM' },
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
            <div className="flex flex-col gap-5 justify-center">
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
          </div>
        </div>
      </section>
    </div>
  )
}
