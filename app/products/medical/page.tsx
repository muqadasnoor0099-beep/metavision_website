import { CinematicHero } from '@/components/ui/cinematic-landing-hero'
import FeatureGrid from '@/components/products/FeatureGrid'
import HowItWorks from '@/components/products/HowItWorks'
import PricingCards from '@/components/products/PricingCards'
import CTABanner from '@/components/home/CTABanner'
import { MEDICAL_FEATURES, HOW_IT_WORKS_MEDICAL, MEDICAL_PRICING } from '@/lib/constants'

export default function MedicalProductPage() {
  return (
    <>
      {/* Cinematic full-screen hero — owns its own scroll pinning */}
      <CinematicHero
        tagline1="Talk to a Doctor,"
        tagline2="Get an AI Prescription"
        brandName="NexLink"
        cardHeading="Healthcare, redefined."
        cardDescription={
          <>
            <span className="text-white font-semibold">NexLink MedAI</span> empowers
            doctors and patients with intelligent AI-powered consultations, real-time
            prescription suggestions, and seamless clinical workflows — built for modern
            healthcare.
          </>
        }
        metricValue={98}
        metricLabel="Uptime SLA"
        ctaHeading="Transform Your Practice."
        ctaDescription="Join 500+ clinics already using NexLink MedAI. Start your free trial today — no credit card required."
        badge1Label="AI Prescription"
        badge1Sub="Generated instantly"
        badge2Label="Live Consultation"
        badge2Sub="Doctor connected"
      />

      {/* Remaining page sections */}
      <div className="pt-16">
        <FeatureGrid features={MEDICAL_FEATURES} title="NexLink MedAI" titleGold="Features" />
        <HowItWorks steps={HOW_IT_WORKS_MEDICAL} />
        <PricingCards plan={MEDICAL_PRICING} />
        <CTABanner />
      </div>
    </>
  )
}
