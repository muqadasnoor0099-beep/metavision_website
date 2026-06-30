import type { ProductMode, HeroContent, Feature, Testimonial, NavLink, Step, PricingPlan, ServiceItem } from './types'

export const HERO_CONTENT: Record<ProductMode, HeroContent> = {
  medical: {
    overline: 'NexLink MedAI · AI-Powered Healthcare Platform',
    headline1: 'Real-Time Doctor–Patient',
    headline2: 'Consultation & AI Prescription',
    description:
      'Seamless live video consultations with intelligent AI prescription suggestions — built for modern healthcare workflows.',
    ctaLabel: 'Explore NexLink MedAI',
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
    ctaLabel: 'Explore Workflow Management System',
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
    title: 'NexLink MedAI — platform demo',
  },
  accounting: {
    src: '/demos/accounting-explainer.mp4',
    title: 'Workflow Management System — platform overview',
  },
}

export const MEDICAL_FEATURES: Feature[] = [
  {
    icon: 'Mic',
    title: 'Sonic Scribe',
    subtitle: 'Audio-First Capture',
    description: 'Ditch the keyboard. Capture every word between doctor and patient as high-fidelity intelligence. No notes missed, no details lost.',
  },
  {
    icon: 'FileEdit',
    title: 'EHR Auto-Pilot',
    subtitle: 'The Smart Scribe',
    description: 'Auto-build clinical notes as you talk. We handle complaints, assessments, and ICD-10 codes so you can focus on the patient.',
  },
  {
    icon: 'Zap',
    title: 'The 10s Snapshot',
    subtitle: 'Instant Clinical Context',
    description: "Master a patient's entire history in seconds. Meds, allergies, and red flags distilled into a single, high-impact overview.",
  },
  {
    icon: 'HeartHandshake',
    title: 'Health Companion',
    subtitle: '24/7 Patient Concierge',
    description: 'A 24/7 AI co-pilot for patients. Explain treatments and answer questions instantly to keep patients supported and informed.',
  },
  {
    icon: 'ScanLine',
    title: 'Zero-Friction Intake',
    subtitle: 'Smart OCR Prep',
    description: 'AI-powered intake. We automatically read and index patient-uploaded reports, giving doctors the "inside scoop" before the visit starts.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Clinical Guardrails',
    subtitle: 'Autonomous Compliance',
    description: 'Safety on cruise control. AI audits every encounter against your rules to ensure 100% clinical compliance and risk detection.',
  },
  {
    icon: 'Search',
    title: 'Deep Discovery',
    subtitle: 'Population Intelligence',
    description: 'Search your practice like Google. Find trends and risks across all transcripts instantly. What took months now takes seconds.',
  },
  {
    icon: 'Landmark',
    title: 'Payer Integrity',
    subtitle: 'The Trust Bridge',
    description: 'Accelerate revenue with AI-verified claims. We anchor every bill to clinical evidence, making insurance denials a thing of the past.',
  },
  {
    icon: 'Rocket',
    title: 'Auth-Accelerate',
    subtitle: 'Prior-Auth on Autopilot',
    description: 'Prior-auths on autopilot. Auto-generate data-backed packets for high-cost tests to secure instant, undeniable approvals from payers.',
  },
  {
    icon: 'ClipboardCheck',
    title: 'Compliance Command',
    subtitle: 'Automated Safety Audits',
    description: 'Real-time regulatory oversight. AI audits every encounter against clinical guardrails to ensure 100% compliance and eliminate practice risk.',
  },
  {
    icon: 'ListChecks',
    title: 'Pre-Visit Pulse',
    subtitle: 'The Pre-Visit QA Bridge',
    description: 'Walk in fully prepared. Patients submit questions early, allowing doctors to review and "tick" off concerns during the live visit.',
  },
  {
    icon: 'MessagesSquare',
    title: 'Chronicle Chat',
    subtitle: 'Context-Aware History Query',
    description: 'Query the past instantly. Both patients and doctors can chat with the entire medical history to get answers from years of data in seconds.',
  },
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
  { value: '1,700+', label: 'Professionals', description: 'Trusted by doctors and CAs worldwide.' },
  { value: 'AI-First', label: 'Philosophy', description: 'Not bolted on — AI is core to every workflow.' },
  { value: '100%', label: 'Compliance', description: 'Built for evolving data protection and tax regulations.' },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "MetaVision's medical platform cut our prescription errors by 80%. The AI suggestions are remarkably accurate.",
    name: 'Dr. Fatima Malik',
    role: 'Senior Physician',
    company: 'Shifa International Hospital',
    rating: 5,
  },
  {
    quote: 'Filing 200+ tax returns used to take a week. Now it takes a day. MetaVision is a game-changer for our firm.',
    name: 'CA Bilal Ahmed',
    role: 'Founding Partner',
    company: 'Ahmed & Partners',
    rating: 5,
  },
  {
    quote: 'The telemedicine portal was live in 48 hours. Patient satisfaction scores went up 30% in the first month.',
    name: 'Dr. Tariq Hussain',
    role: 'Hospital Director',
    company: 'Aga Khan Hospital',
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
      { label: 'NexLink MedAI', href: '/products/medical' },
      { label: 'Workflow Management System', href: '/products/accounting' },
    ],
  },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
]

export const SERVICES: ServiceItem[] = [
  {
    icon: 'Network',
    title: 'IT Consultant Services',
    tags: ['Infrastructure Design', 'Sizing', 'Security'],
  },
  {
    icon: 'Users',
    title: 'Staff Augmentation',
    tags: ['Software Developers', 'Database Administrators'],
  },
  {
    icon: 'Code2',
    title: 'Software Development',
    tags: ['Business Intelligence', 'SQL', 'AI', 'Tableau', 'Mobile Applications', 'Web Applications', 'Desktop Applications'],
  },
  {
    icon: 'BrainCircuit',
    title: 'Machine Learning & Data Analytics',
    tags: ['Regression', 'Classification', 'Neural Networks', 'Large Language Models'],
  },
  {
    icon: 'ShieldCheck',
    title: 'Technical Audits',
    tags: ['ISO 27001'],
  },
  {
    icon: 'LifeBuoy',
    title: 'Disaster Recovery & Business Continuity Planning',
    description: 'Resilience strategies and recovery plans that keep your business running through disruption.',
  },
  {
    icon: 'DatabaseBackup',
    title: 'Backup Strategies',
    description: 'Reliable backup architectures designed around your recovery time and recovery point objectives.',
  },
  {
    icon: 'Server',
    title: 'Data Centre Design',
    description: 'End-to-end data centre planning — layout, power, cooling, and redundancy.',
  },
  {
    icon: 'Cloud',
    title: 'Cloud Services',
    description: 'Cloud architecture, migration, and managed operations across AWS, Azure, and GCP.',
  },
]

export const HOW_IT_WORKS_MEDICAL: Step[] = [
  {
    number: '01',
    title: 'Pre-Visit Prep',
    subtitle: 'Patient Empowerment',
    description: 'Patients upload labs and list questions in their portal. AI pre-reads everything so the doctor walks in fully loaded.',
  },
  {
    number: '02',
    title: 'Clinical Preview',
    subtitle: 'The 10s Huddle',
    description: "Before entering, the doctor reviews a high-impact, AI-distilled snapshot of the patient's history and current needs.",
  },
  {
    number: '03',
    title: 'Sonic Capture',
    subtitle: 'Hands-Free Consultation',
    description: 'Just talk. NexLink MedAI ingests the entire conversation naturally, allowing the doctor to focus 100% on the patient.',
  },
  {
    number: '04',
    title: 'Instant Scribe',
    subtitle: 'Real-Time Record Creation',
    description: 'As you speak, AI builds the EHR. We automate chief complaints, assessments, and coding before the visit even ends.',
  },
  {
    number: '05',
    title: 'Live QA Sync',
    subtitle: 'Closing the Loop',
    description: "The system detects when patient questions are answered and “ticks” them off the doctor's checklist in real-time.",
  },
  {
    number: '06',
    title: 'Doctor Verify',
    subtitle: 'Final Clinical Review',
    description: 'The doctor reviews the AI-generated note, makes any “human” adjustments, and saves the visit to the permanent record.',
  },
  {
    number: '07',
    title: 'Patient Clarity',
    subtitle: 'The Simplified Summary',
    description: 'The patient gets a plain-language summary in their portal, with AI-extracted answers to every question they asked.',
  },
  {
    number: '08',
    title: 'Smart Audit',
    subtitle: 'Invisible Governance',
    description: 'Admins set safety guardrails; the AI automatically audits every visit to ensure total compliance and risk detection.',
  },
  {
    number: '09',
    title: 'Instant Payer Trust',
    subtitle: 'Frictionless Approvals',
    description: 'Claims are auto-verified against the visit transcript, creating an undeniable “Trust Bridge” for immediate insurance approval.',
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

export const MEDICAL_PRICING: PricingPlan = {
  name: 'Built Around Your Clinic',
  description: 'From solo practitioners to hospital networks — every NexLink MedAI plan is configured around your team size, patient volume, and compliance needs.',
  features: [
    'AI-powered prescription suggestions',
    'Live video consultations & patient portal',
    'Lab integration & e-prescriptions',
    'Custom branding for your clinic',
    'Dedicated infrastructure & security audits',
    'Priority, round-the-clock support',
  ],
  cta: 'Contact Sales',
}

export const ACCOUNTING_PRICING: PricingPlan = {
  name: 'Built Around Your Firm',
  description: 'From solo practitioners to large accounting firms — every Workflow Management System plan is configured around your client base, team size, and integration needs.',
  features: [
    'GST + ITR filing automation',
    'Balance sheet automation & audit trail',
    'Multi-user access & client portal',
    'Advanced GST analytics & reporting',
    'API access & custom workflow integrations',
    'White-labeling & dedicated account manager',
  ],
  cta: 'Contact Sales',
}
