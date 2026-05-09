import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import MedicalShowcaseSection from '@/components/home/MedicalShowcaseSection'
import WhyUsSection from '@/components/home/WhyUsSection'
import dynamic from 'next/dynamic'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTABanner from '@/components/home/CTABanner'

const GestureFXSection = dynamic(() => import('@/components/home/GestureFXSection'), { ssr: false })

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <MedicalShowcaseSection />
      <WhyUsSection />
      <GestureFXSection />
      <TestimonialsSection />
      <CTABanner />
    </>
  )
}
