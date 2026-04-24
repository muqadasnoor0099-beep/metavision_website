import ProductHero from '@/components/products/ProductHero'
import FeatureGrid from '@/components/products/FeatureGrid'
import HowItWorks from '@/components/products/HowItWorks'
import PricingCards from '@/components/products/PricingCards'
import CTABanner from '@/components/home/CTABanner'
import {
  ACCOUNTING_FEATURES,
  HOW_IT_WORKS_ACCOUNTING,
  ACCOUNTING_PRICING,
  PRODUCT_DEMO_BY_MODE,
} from '@/lib/constants'

export default function AccountingProductPage() {
  return (
    <div className="pt-16">
      <ProductHero
        mode="accounting"
        overline="Professional CA Workflow Suite"
        headline1="Streamline Your Practice"
        headline2="For Chartered Accountants"
        description="End-to-end workflow platform for chartered accountants — GST filing, ITR preparation, balance sheets, and client management all in one place."
        ctaLabel="Start Free Trial"
        ctaHref="/contact"
        demoVideoSrc={PRODUCT_DEMO_BY_MODE.accounting.src}
        demoTitle={PRODUCT_DEMO_BY_MODE.accounting.title}
      />
      <FeatureGrid features={ACCOUNTING_FEATURES} title="CA Software" titleGold="Features" />
      <HowItWorks steps={HOW_IT_WORKS_ACCOUNTING} />
      <PricingCards tiers={ACCOUNTING_PRICING} />
      <CTABanner />
    </div>
  )
}
