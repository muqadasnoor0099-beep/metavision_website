import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import MedicalShowcaseSection from '@/components/home/MedicalShowcaseSection'
import WhyUsSection from '@/components/home/WhyUsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTABanner from '@/components/home/CTABanner'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <MedicalShowcaseSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CTABanner />
    </>
  )
}
