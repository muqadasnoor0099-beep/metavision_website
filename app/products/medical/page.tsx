import ProductHero from '@/components/products/ProductHero'
import FeatureGrid from '@/components/products/FeatureGrid'
import HowItWorks from '@/components/products/HowItWorks'
import PricingCards from '@/components/products/PricingCards'
import CTABanner from '@/components/home/CTABanner'
import { MEDICAL_FEATURES, HOW_IT_WORKS_MEDICAL, MEDICAL_PRICING, PRODUCT_DEMO_BY_MODE } from '@/lib/constants'

export default function MedicalProductPage() {
  return (
    <div className="pt-16">
      <ProductHero
        mode="medical"
        overline="NexLink MedAI · AI-Powered Healthcare Platform"
        headline1="Talk to a Doctor"
        headline2="Get an AI Prescription"
        description="Seamless live video consultations with intelligent AI prescription suggestions — built for modern healthcare workflows."
        ctaLabel="Start Free Trial"
        ctaHref="/contact"
        demoVideoSrc={PRODUCT_DEMO_BY_MODE.medical.src}
        demoTitle={PRODUCT_DEMO_BY_MODE.medical.title}
      />
      <FeatureGrid features={MEDICAL_FEATURES} title="NexLink MedAI" titleGold="Features" />
      <HowItWorks steps={HOW_IT_WORKS_MEDICAL} />
      <PricingCards plan={MEDICAL_PRICING} />
      <CTABanner />
    </div>
  )
}
