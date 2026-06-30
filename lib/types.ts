export type ProductMode = 'medical' | 'accounting'

export interface HeroContent {
  overline: string
  headline1: string
  headline2: string
  description: string
  ctaLabel: string
  ctaHref: string
  stats: { value: string; label: string }[]
}

export interface Feature {
  icon: string
  title: string
  subtitle?: string
  description: string
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
  rating: number
}

export interface NavLink {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export interface Step {
  number: string
  title: string
  subtitle?: string
  description: string
}

export interface ServiceItem {
  icon: string
  title: string
  tags?: string[]
  description?: string
}

export interface PricingPlan {
  name: string
  description: string
  features: string[]
  cta: string
}
