import ProductHero from '@/components/products/ProductHero'
import FeatureGrid from '@/components/products/FeatureGrid'
import HowItWorks from '@/components/products/HowItWorks'
import PricingCards from '@/components/products/PricingCards'
import CTABanner from '@/components/home/CTABanner'
import { ACCOUNTING_FEATURES, HOW_IT_WORKS_ACCOUNTING, ACCOUNTING_PRICING } from '@/lib/constants'

export default function AccountingProductPage() {
  return (
    <div className="pt-16">
      <ProductHero
        mode="accounting"
        overline="Intelligent CA Workflow Suite"
        headline1="Streamline Your Practice"
        headline2="With AI-Driven Accounting"
        description="End-to-end chartered accountant workflow: GST, ITR, balance sheets, and client management — all in one intelligent platform."
        ctaLabel="Start Free Trial"
        ctaHref="/contact"
      />
      <FeatureGrid features={ACCOUNTING_FEATURES} title="CA Software" titleGold="Features" />
      <HowItWorks steps={HOW_IT_WORKS_ACCOUNTING} />
      <PricingCards tiers={ACCOUNTING_PRICING} />
      <CTABanner />
    </div>
  )
}
