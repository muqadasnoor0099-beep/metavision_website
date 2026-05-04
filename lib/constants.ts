import type { ProductMode, HeroContent, Feature, Testimonial, NavLink, Step, PricingTier, PortfolioItem } from './types'

export const HERO_CONTENT: Record<ProductMode, HeroContent> = {
  medical: {
    overline: 'AI-Powered Healthcare Platform',
    headline1: 'Real-Time Doctor–Patient',
    headline2: 'Consultation & AI Rx',
    description:
      'Seamless live video consultations with intelligent AI prescription suggestions — built for modern healthcare workflows.',
    ctaLabel: 'Explore Medical Software',
    ctaHref: '/products/medical',
    stats: [
      { value: '500+', label: 'Clinics' },
      { value: '98%', label: 'Uptime SLA' },
      { value: '2M+', label: 'Consultations' },
    ],
  },
  accounting: {
    overline: 'Professional CA Workflow Suite',
    headline1: 'Streamline Your Practice',
    headline2: 'For Chartered Accountants',
    description:
      'End-to-end workflow platform for chartered accountants — GST filing, ITR preparation, balance sheets, and client management all in one place.',
    ctaLabel: 'Explore CA Software',
    ctaHref: '/products/accounting',
    stats: [
      { value: '1,200+', label: 'CA Firms' },
      { value: '99.9%', label: 'Accuracy' },
      { value: '50M+', label: 'Records Processed' },
    ],
  },
}

/** Demo modals — `public/demos/ha-engage-pro.mp4`; run `npm run sync-demo` after Remotion writes `remotion-videos/out/ha-engage-pro.mp4`. */
export const PRODUCT_DEMO_BY_MODE: Record<ProductMode, { src: string; title: string }> = {
  medical: {
    src: '/demos/medical-consultation.mp4',
    title: 'AI Medical Consultation — platform demo',
  },
  accounting: {
    src: '/demos/accounting-explainer.mp4',
    title: 'CA Software — platform overview',
  },
}

export const MEDICAL_FEATURES: Feature[] = [
  { icon: 'Video', title: 'Live Video Consult', description: 'HD real-time consultations with end-to-end encryption.' },
  { icon: 'Brain', title: 'AI Prescription', description: 'Intelligent drug suggestions based on diagnosis and history.' },
  { icon: 'FileText', title: 'Patient Records', description: 'Unified digital health records accessible anywhere.' },
  { icon: 'Calendar', title: 'Smart Scheduling', description: 'Automated appointment booking and reminders.' },
  { icon: 'Microscope', title: 'Lab Integration', description: 'Direct lab report import and analysis.' },
  { icon: 'Globe', title: 'Telemedicine Portal', description: 'Patient-facing portal for remote care access.' },
]

export const ACCOUNTING_FEATURES: Feature[] = [
  { icon: 'Receipt', title: 'GST Filing', description: 'Automated GST return preparation and e-filing.' },
  { icon: 'FileCheck', title: 'ITR Preparation', description: 'Accurate income tax return preparation with built-in validation and error checks.' },
  { icon: 'BarChart2', title: 'Balance Sheets', description: 'Auto-generated financial statements in one click.' },
  { icon: 'Users', title: 'Client Management', description: 'Centralised client database and communication hub.' },
  { icon: 'Shield', title: 'Audit Trail', description: 'Complete immutable log of every financial action.' },
  { icon: 'LayoutDashboard', title: 'Multi-firm Dashboard', description: 'Manage multiple firms from a single unified view.' },
]

export const WHY_US = [
  { value: '1,700+', label: 'Professionals', description: 'Trusted by doctors and CAs across Pakistan.' },
  { value: 'AI-First', label: 'Philosophy', description: 'Not bolted on — AI is core to every workflow.' },
  { value: '100%', label: 'Compliance', description: "Built for Pakistan's regulatory landscape — HIPAA, GST, IT Act." },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "MetaVision's medical platform cut our prescription errors by 80%. The AI suggestions are remarkably accurate.",
    name: 'Dr. Priya Sharma',
    role: 'Senior Physician',
    company: 'Apollo Clinics, Mumbai',
    rating: 5,
  },
  {
    quote: 'Filing 200+ GST returns used to take a week. Now it takes a day. MetaVision is a game-changer for our firm.',
    name: 'CA Rajesh Mehta',
    role: 'Founding Partner',
    company: 'Mehta & Associates, Delhi',
    rating: 5,
  },
  {
    quote: 'The telemedicine portal was live in 48 hours. Patient satisfaction scores went up 30% in the first month.',
    name: 'Dr. Anil Verma',
    role: 'Hospital Director',
    company: 'Verma Multispeciality, Pune',
    rating: 5,
  },
]

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Medical Software', href: '/products/medical' },
      { label: 'CA Software', href: '/products/accounting' },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
]

export const HOW_IT_WORKS_MEDICAL: Step[] = [
  {
    number: '01',
    title: 'Register & Set Up',
    description: 'Create your practice profile, add doctors, and configure patient intake forms in minutes.',
  },
  {
    number: '02',
    title: 'Start Consultations',
    description: 'Patients book via the portal. Doctors join the HD video call with one click.',
  },
  {
    number: '03',
    title: 'AI-Assisted Diagnosis',
    description: 'As the consultation progresses, AI suggests prescriptions and flags drug interactions in real time.',
  },
]

export const HOW_IT_WORKS_ACCOUNTING: Step[] = [
  {
    number: '01',
    title: 'Import Client Data',
    description: 'Connect existing records via CSV or API. MetaVision auto-categorises transactions instantly.',
  },
  {
    number: '02',
    title: 'Review & Approve',
    description: 'The platform compiles GST returns, ITR drafts, and balance sheets from imported data. Review, make adjustments, and approve in one click.',
  },
  {
    number: '03',
    title: 'File & Report',
    description: 'Direct e-filing to government portals. Share branded reports with clients from the dashboard.',
  },
]

export const MEDICAL_PRICING: PricingTier[] = [
  {
    name: 'Starter',
    price: 'PKR2,999',
    period: '/month',
    description: 'For small clinics and solo practitioners.',
    features: ['Up to 5 doctors', '500 consultations/month', 'AI prescriptions', 'Patient portal', 'Email support'],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: 'PKR7,999',
    period: '/month',
    description: 'For growing multi-specialty clinics.',
    features: ['Up to 25 doctors', 'Unlimited consultations', 'Lab integration', 'Custom branding', 'Priority support'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For hospital chains and large networks.',
    features: ['Unlimited doctors', 'Dedicated infrastructure', 'HIPAA compliance audit', 'Custom integrations', '24/7 dedicated support'],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export const ACCOUNTING_PRICING: PricingTier[] = [
  {
    name: 'Solo',
    price: 'PKR1,999',
    period: '/month',
    description: 'For individual chartered accountants.',
    features: ['Up to 50 clients', 'GST + ITR filing', 'Balance sheet automation', 'Audit trail', 'Email support'],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Firm',
    price: 'PKR5,499',
    period: '/month',
    description: 'For CA firms with multiple partners.',
    features: ['Up to 300 clients', 'Multi-user access', 'Advanced GST analytics', 'Client portal', 'Phone + chat support'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large firms and corporates.',
    features: ['Unlimited clients', 'Custom workflows', 'API access', 'White-labeling', 'Dedicated account manager'],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { title: 'Patient Dashboard', tag: 'Medical', image: 'https://placehold.co/400x260/0e0e14/2563eb?text=Patient+Dashboard' },
  { title: 'Video Consultation', tag: 'Medical', image: 'https://placehold.co/400x260/0e0e14/2563eb?text=Video+Consultation' },
  { title: 'AI Prescription Panel', tag: 'Medical', image: 'https://placehold.co/400x260/0e0e14/2563eb?text=AI+Prescription' },
  { title: 'GST Filing Interface', tag: 'Accounting', image: 'https://placehold.co/400x260/0e0e14/2563eb?text=GST+Filing' },
  { title: 'Balance Sheet Generator', tag: 'Accounting', image: 'https://placehold.co/400x260/0e0e14/2563eb?text=Balance+Sheet' },
  { title: 'Client Management Hub', tag: 'Accounting', image: 'https://placehold.co/400x260/0e0e14/2563eb?text=Client+Hub' },
  { title: 'Analytics Dashboard', tag: 'Medical', image: 'https://placehold.co/400x260/0e0e14/2563eb?text=Analytics' },
  { title: 'Multi-firm Overview', tag: 'Accounting', image: 'https://placehold.co/400x260/0e0e14/2563eb?text=Multi-firm' },
]
