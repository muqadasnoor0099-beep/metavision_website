# MetaVision Website — Design Spec
_Date: 2026-04-14_

---

## 1. Project Overview

A premium, futuristic marketing website for **MetaVision**, an IT company with two flagship software products:

1. **Medical Software** — AI-powered doctor–patient real-time consultation + AI prescription system
2. **CA Workflow Software** — Chartered Accountant workflow and financial management platform

The site must feel like a top-tier SaaS product page: cinematic dark theme, gold accents, 3D visuals, and smooth animations throughout.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 — App Router (`app/` directory) |
| Styling | Tailwind CSS v3 (config, not CDN) |
| Animations | Framer Motion |
| 3D | React Three Fiber (R3F) + @react-three/drei |
| Fonts | `Space Grotesk` (headings) + `Inter` (body) via next/font |
| Icons | Lucide React |
| Deployment target | Static export (`next export`) — deployable on Vercel/Netlify |

---

## 3. Design System

### Colors
```
Background:      #060609   (near-black)
Surface:         #0e0e14   (elevated card)
Surface-high:    #16161f   (floating / modal)
Gold-primary:    #d4af37
Gold-light:      #f5d060
Gold-dim:        rgba(212, 175, 55, 0.15)
Text-primary:    #ffffff
Text-secondary:  rgba(255,255,255,0.55)
Text-muted:      rgba(255,255,255,0.35)
Border:          rgba(212,175,55,0.12)
Border-active:   rgba(212,175,55,0.3)
```

### Typography
- **Display / H1:** Space Grotesk, 800 weight, `letter-spacing: -0.03em`, `line-height: 1.08`
- **H2:** Space Grotesk, 700 weight, `letter-spacing: -0.02em`
- **H3:** Space Grotesk, 600 weight
- **Body:** Inter, 400 weight, `line-height: 1.7`
- **Label/Overline:** Inter, 600 weight, `letter-spacing: 0.12em`, uppercase, 11px

### Spacing tokens
Use consistent 8px base grid: `8, 16, 24, 32, 48, 64, 80, 96px`

### Glassmorphism recipe
```css
background: rgba(14, 14, 20, 0.75);
border: 1px solid rgba(212, 175, 55, 0.18);
backdrop-filter: blur(14px);
border-radius: 12px;
```

### Shadows
```css
/* Card glow */
box-shadow: 0 0 40px rgba(212,175,55,0.06), 0 1px 0 rgba(255,255,255,0.04) inset;

/* Floating element */
box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(212,175,55,0.08);
```

### Animations
- Only animate `transform` and `opacity` — never `transition-all`
- Spring easing: `{ type: "spring", stiffness: 300, damping: 30 }`
- Page entrance: fade up `y: 20 → 0`, `opacity: 0 → 1`, duration `0.5s`
- Every interactive element must have `hover`, `focus-visible`, and `active` states

---

## 4. Site Structure

```
/                → Landing page (home)
/about           → Company page
/products        → Products overview
/products/medical      → Medical Software detail
/products/accounting   → CA Software detail
/portfolio       → Demo / mockup gallery
/contact         → Contact form
```

### Navigation (shared `<Header>` component)
- Sticky, `position: fixed`, `top: 0`, full width
- Background: `rgba(6,6,9,0.92)` + `backdrop-filter: blur(12px)` + bottom gold border `1px`
- Logo: "MV" golden square icon + "MetaVision" wordmark
- Links: Home, About, Products (dropdown), Portfolio, Contact
- CTA button: "Get Demo" — gold gradient, 8px radius
- Mobile: hamburger → full-screen overlay menu with slide-in animation

---

## 5. Landing Page

### 5.1 Hero Section

**Layout:** Two-column split. Left = content, Right = 3D canvas. Min-height `100vh`.

**Left column content (top → bottom):**
1. **Pill toggle** — `Medical Software` | `Accounting Software`. Active tab: gold gradient pill. Inactive: muted text. Clicking instantly switches mode; auto-switches every 5 seconds with smooth crossfade.
2. **Overline label** — gold dot + uppercase tag (e.g. "AI-Powered Healthcare Platform")
3. **Headline** — two lines, first line white, second line gold gradient
4. **Description** — 2–3 sentences, `text-secondary` color, max-width 380px
5. **CTA row** — "Explore Software" (gold button) + "▶ Watch Demo" (ghost button)
6. **Stats row** — 3 metrics separated by thin gold divider line

**Mode content:**

| Field | Medical Mode | Accounting Mode |
|---|---|---|
| Overline | AI-Powered Healthcare Platform | Intelligent CA Workflow Suite |
| H1 line 1 | Real-Time Doctor–Patient | Streamline Your Practice |
| H1 line 2 | Consultation & AI Rx | With AI-Driven Accounting |
| Description | Seamless live video consultations with intelligent AI prescription suggestions — built for modern healthcare workflows. | End-to-end chartered accountant workflow: GST, ITR, balance sheets, and client management — all in one intelligent platform. |
| CTA | Explore Medical Software | Explore CA Software |
| Stat 1 | 500+ Clinics | 1,200+ CA Firms |
| Stat 2 | 98% Uptime SLA | 99.9% Accuracy |
| Stat 3 | 2M+ Consultations | 50M+ Records Processed |

**Right column — 3D canvas (React Three Fiber):**

_Medical mode — Brain / Neural Network:_
- Anatomical brain mesh (low-poly wireframe) with glowing gold edges
- Outer orbit rings rotating slowly on Y and Z axes
- Neural network particle nodes floating around the brain, connected by faint lines
- Ambient gold point light from upper-left; soft white fill from below
- Floating glassmorphic cards anchored in world space: "AI Analysis — 97.4%" and "Neural Activity" bar chart
- Subtle continuous rotation on Y axis; parallax shift on mouse move

_Accounting mode — Financial Dashboard:_
- 3D floating dashboard plane (slightly tilted) with animated bar charts and line graph
- Rising bar columns animated with spring easing
- Orbiting data cubes / coin icons
- Floating cards: "Revenue +24%" and "Reports Generated: 3,847"
- Cooler gold/white color treatment vs medical's warmer glow

**Mode transition animation:**
- Canvas: `opacity 0 → 1` crossfade over `0.6s` + slight `scale 0.95 → 1`
- Left text: each element staggers out `y: 0 → -10, opacity: 1 → 0` then new content fades in `y: 10 → 0`
- Total transition: 600ms

**Background:**
- Radial gradient behind the 3D panel: `rgba(212,175,55,0.09)` center → transparent
- Subtle animated particle field (canvas-based, ~60 dots, slow drift) across the full hero
- Horizontal scan lines overlay at 4px intervals, 1.5% opacity

---

### 5.2 Features Section

- Title: "Everything You Need. Nothing You Don't."
- 6 feature cards in a `3×2` grid (desktop), `2×3` (tablet), `1×6` (mobile)
- Each card: gold icon, bold title, 1-line description
- Cards use glassmorphism recipe, hover: `border-color` brightens + subtle `y: -4px` lift

**Medical features:** Live Video Consult, AI Prescription, Patient Records, Appointment Scheduling, Lab Integration, Telemedicine Portal

**Accounting features:** GST Filing, ITR Preparation, Balance Sheet Automation, Client Management, Audit Trail, Multi-firm Dashboard

> Both sets visible simultaneously on Products page. On landing page, show the active mode's features only (switches with pill toggle).

---

### 5.3 Why Choose Us

- 3-column layout with large numbers / icons
- "Trusted by 1,700+ professionals", "Built for Pakistan's compliance landscape", "AI-first — not an afterthought"
- Subtle animated counter on scroll-enter (0 → final value)

---

### 5.4 Testimonials

- Horizontal scroll carousel, 3 cards visible on desktop
- Each card: quote, name, role, company name, gold star rating
- Auto-scrolls every 6s, manual swipe/arrow controls

---

### 5.5 CTA Banner

- Full-width dark band with gold gradient text headline
- "Ready to Transform Your Practice?"
- Two buttons: "Start Free Trial" (gold) + "Book a Demo" (ghost)
- Background: layered radial gradients for depth

---

### 5.6 Footer

- 4-column layout: Logo + tagline | Products | Company | Contact
- Bottom bar: copyright + social icons (LinkedIn, Twitter, GitHub)
- Gold top border `1px`
- Background: `#060609`

---

## 6. About Page (`/about`)

- **Hero:** Full-width headline "We Build Software That Thinks" + short paragraph. No 3D — just strong typography and background gradient.
- **Mission & Vision:** Two glassmorphic cards side by side
- **Story section:** Timeline-style layout, 4 milestones
- **Team section:** 3-column card grid (placeholder avatars, name, role)
- **What makes us unique:** 3 points with large icons and short copy

---

## 7. Products Page (`/products`)

Two full-page sections stacked vertically, each with:
- Section header (overline + large title + description)
- Feature grid (6 items, icon + title + body)
- UI preview strip (3 glassmorphic mockup cards showing app screens)
- CTA: "Learn More" → individual product detail page

### Medical Software Detail (`/products/medical`)
- Hero with 3D brain (reuse from landing)
- Deep-dive feature list (8 features)
- How it works: 3-step flow diagram
- Pricing tier cards (3 tiers)

### CA Software Detail (`/products/accounting`)
- Hero with 3D dashboard (reuse from landing)
- Deep-dive feature list (8 features)
- How it works: 3-step flow diagram
- Pricing tier cards (3 tiers)

---

## 8. Portfolio Page (`/portfolio`)

- Section title: "See It In Action"
- Masonry-style grid of 8 product mockup cards
- Each card: screenshot/UI preview image (placeholder), product tag, hover overlay with "View Demo" CTA
- Hover: scale `1.0 → 1.03` + gold border glows + overlay fades in

---

## 9. Contact Page (`/contact`)

- Two-column layout: form left, info right
- **Form fields:** Name, Email, Phone, Company, Message, Product Interest (select: Medical / Accounting / Both)
- **Submit button:** Gold gradient, full-width on mobile
- **Right side:** Address, email, phone with gold icon bullets
- **Map placeholder:** Static image or embedded Google Maps iframe
- Form validation: inline error messages, no submission to real backend (console.log for now)

---

## 10. Component Architecture

```
app/
  layout.tsx            ← shared HTML shell, fonts, metadata
  page.tsx              ← Landing page
  about/page.tsx
  products/page.tsx
  products/medical/page.tsx
  products/accounting/page.tsx
  portfolio/page.tsx
  contact/page.tsx

components/
  layout/
    Header.tsx          ← sticky nav, mobile menu
    Footer.tsx
  home/
    HeroSection.tsx     ← pill toggle, text content, 3D canvas
    FeaturesSection.tsx
    WhyUsSection.tsx
    TestimonialsSection.tsx
    CTABanner.tsx
  3d/
    BrainCanvas.tsx     ← R3F scene: medical mode
    DashboardCanvas.tsx ← R3F scene: accounting mode
    ParticleField.tsx   ← background particles
  ui/
    GlassCard.tsx       ← reusable glassmorphic card
    GoldButton.tsx      ← primary CTA button
    GhostButton.tsx     ← secondary CTA button
    SectionHeader.tsx   ← overline + title + subtitle
    StatCounter.tsx     ← animated counter on scroll
  products/
    ProductHero.tsx
    FeatureGrid.tsx
    HowItWorks.tsx
    PricingCards.tsx
  portfolio/
    MockupCard.tsx
  contact/
    ContactForm.tsx
```

---

## 11. Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, hamburger nav, 3D canvas hidden or reduced |
| Tablet | 640–1024px | 2-col grid where applicable, 3D canvas at 50% size |
| Desktop | > 1024px | Full layout as designed |

On mobile, the 3D canvas in the hero is replaced by a 2D animated SVG version (same design language, no WebGL overhead).

---

## 12. Performance Notes

- 3D canvas only loads client-side (`dynamic(() => import(...), { ssr: false })`)
- Fonts loaded via `next/font/google` (no layout shift)
- Images use `next/image` with proper sizes
- Framer Motion `LazyMotion` with `domAnimation` feature set only
- Particle field canvas uses `requestAnimationFrame` with cleanup on unmount
