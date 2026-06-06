import HeroSection from '@/components/home/HeroSection'
import ServicesSection from '@/components/home/ServicesSection'
import MedicalShowcaseSection from '@/components/home/MedicalShowcaseSection'
import WhyUsSection from '@/components/home/WhyUsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTABanner from '@/components/home/CTABanner'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <MedicalShowcaseSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CTABanner />
    </>
  )
}
