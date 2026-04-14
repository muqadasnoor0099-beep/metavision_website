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
  description: string
}

export interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
}

export interface PortfolioItem {
  title: string
  tag: string
  image: string
}
