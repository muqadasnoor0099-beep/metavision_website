import SectionHeader from '@/components/ui/SectionHeader'
import MockupCard from '@/components/portfolio/MockupCard'
import CTABanner from '@/components/home/CTABanner'
import { PORTFOLIO_ITEMS } from '@/lib/constants'

export default function PortfolioPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.07),transparent_60%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            overline="Portfolio"
            title="See It"
            titleGold="In Action"
            subtitle="Real interfaces from our Medical and Accounting platforms — click any card to explore."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {PORTFOLIO_ITEMS.map((item, i) => (
              <MockupCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>
      <CTABanner />
    </div>
  )
}
