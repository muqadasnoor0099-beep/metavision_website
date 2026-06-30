import React from 'react'
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'

// ─── Brand tokens ────────────────────────────────────────────────────────────

const DARK = '#06070d'
const ACCENT = '#2563eb'
const ACCENT_LIGHT = '#60a5fa'
const ACCENT_CYAN = '#22d3ee'
const GOLD = '#d4af37'
const GOLD_LIGHT = '#f5d060'
const WHITE = '#ffffff'
const WHITE_60 = 'rgba(255,255,255,0.60)'
const WHITE_35 = 'rgba(255,255,255,0.35)'
const FONT = "'Segoe UI', Arial, sans-serif"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ease(frame: number, delay = 0, dur = 24, from = 0, to = 1) {
  return interpolate(frame - delay, [0, dur], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

function slideUp(frame: number, delay = 0, dur = 22) {
  return {
    opacity: ease(frame, delay, dur),
    transform: `translateY(${interpolate(frame - delay, [0, dur], [28, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
  }
}

function slideX(frame: number, delay = 0, dur = 22, from = 40) {
  return {
    opacity: ease(frame, delay, dur),
    transform: `translateX(${interpolate(frame - delay, [0, dur], [from, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
  }
}

function fadeIn(frame: number, delay = 0, dur = 20) {
  return { opacity: ease(frame, delay, dur) }
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function Counter({ value, frame, delay = 0, duration = 45, suffix = '' }: { value: number; frame: number; delay?: number; duration?: number; suffix?: string }) {
  const n = Math.round(interpolate(frame - delay, [0, duration], [0, value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
  return <>{n.toLocaleString()}{suffix}</>
}

// ─── Ambient particles (deterministic, no per-frame randomness) ──────────────

const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 97.3) % 100,
  r: 1 + (i % 4) * 0.6,
  speed: 0.15 + (i % 5) * 0.05,
  phase: i * 0.7,
}))

function Particles({ frame }: { frame: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {PARTICLES.map((p, i) => {
        const y = (p.y + frame * p.speed * 0.06) % 100
        const tw = 0.4 + 0.3 * Math.sin(frame * 0.04 + p.phase)
        return (
          <div key={i} style={{
            position: 'absolute', left: `${p.x}%`, top: `${y}%`,
            width: p.r, height: p.r, borderRadius: '50%',
            background: ACCENT_LIGHT, opacity: Math.max(0.08, tw * 0.35),
            boxShadow: `0 0 ${p.r * 3}px ${ACCENT_LIGHT}`,
          }} />
        )
      })}
    </div>
  )
}

// ─── Shared dark scene wrapper ─────────────────────────────────────────────────

function Dark({ children, frame }: { children: React.ReactNode; frame: number }) {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK, fontFamily: FONT, color: WHITE, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 65% 55% at 50% 0%, rgba(37,99,235,0.10), transparent)`, pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '34px 34px',
      }} />
      <Particles frame={frame} />
      {children}
    </AbsoluteFill>
  )
}

function Pill({ label, color = ACCENT, frame, delay = 0 }: { label: string; color?: string; frame: number; delay?: number }) {
  return (
    <div style={{ ...slideUp(frame, delay), display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, border: `1px solid ${color}55`, background: `${color}14`, width: 'fit-content' }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  )
}

function Headline({ children, size = 52 }: { children: React.ReactNode; size?: number }) {
  return (
    <span style={{
      background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      fontSize: size, fontWeight: 800, lineHeight: 1.08, display: 'inline',
    }}>{children}</span>
  )
}

function BlueHeadline({ children, size = 52 }: { children: React.ReactNode; size?: number }) {
  return (
    <span style={{
      background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})`,
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      fontSize: size, fontWeight: 800, lineHeight: 1.08, display: 'inline',
    }}>{children}</span>
  )
}

function CalloutBadge({ label, value, x, y, frame, delay = 0 }: { label: string; value: React.ReactNode; x: string; y: string; frame: number; delay?: number }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      ...fadeIn(frame, delay),
      background: 'rgba(6,7,13,0.90)', border: `1px solid rgba(37,99,235,0.4)`, borderRadius: 10,
      padding: '8px 14px', backdropFilter: 'blur(10px)', zIndex: 10,
    }}>
      <div style={{ fontSize: 10, color: ACCENT_LIGHT, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: WHITE, marginTop: 2 }}>{value}</div>
    </div>
  )
}

function BulletList({ items, frame, delay = 0 }: { items: string[]; frame: number; delay?: number }) {
  return (
    <>
      {items.map((pt, i) => (
        <div key={i} style={{ ...slideUp(frame, delay + i * 5), display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 15, color: WHITE_60 }}>{pt}</span>
        </div>
      ))}
    </>
  )
}

// ─── Browser-chrome wrapped screenshot (matches website laptop-hero styling) ──

function BrowserChrome({
  src, url, frame, delay = 0, zoomEnd = 1.05, zoomDuration = 220, children,
}: {
  src: string; url: string; frame: number; delay?: number; zoomEnd?: number; zoomDuration?: number; children?: React.ReactNode
}) {
  const scale = interpolate(frame - delay, [0, zoomDuration], [1, zoomEnd], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const entry = spring({ frame: Math.max(0, frame - delay), fps: 30, config: { stiffness: 120, damping: 18 } })

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid rgba(37,99,235,0.28)',
      boxShadow: '0 34px 100px rgba(0,0,0,0.78), 0 0 0 1px rgba(255,255,255,0.04)',
      opacity: ease(frame, delay, 24),
      transform: `scale(${0.94 + entry * 0.06}) translateY(${(1 - entry) * 18}px)`,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Chrome bar */}
      <div style={{
        height: 36, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
        <div style={{
          flex: 1, marginLeft: 10, height: 22,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 12px',
          fontSize: 12, color: 'rgba(255,255,255,0.42)', fontFamily: FONT,
        }}>{url}</div>
      </div>
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transform: `scale(${scale})`, transformOrigin: 'top center' }} />
        {children}
      </div>
    </div>
  )
}

// ─── SCENE: Intro ─────────────────────────────────────────────────────────────

function SceneIntro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const logoScale = spring({ frame, fps, config: { stiffness: 160, damping: 20 } })
  const ringScale = interpolate(frame, [0, 60], [0.8, 1.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const ringOpacity = interpolate(frame, [0, 20, 60], [0, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <Dark frame={frame}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        {/* Expanding ring pulse behind logo */}
        <div style={{
          position: 'absolute', width: 220, height: 220, borderRadius: '50%',
          border: `1.5px solid ${ACCENT_LIGHT}`, opacity: ringOpacity,
          transform: `scale(${ringScale})`,
        }} />

        <div style={{ transform: `scale(${logoScale})`, ...fadeIn(frame, 0) }}>
          <div style={{
            padding: '10px 28px', background: `linear-gradient(135deg, ${ACCENT}22, ${ACCENT}44)`,
            border: `1.5px solid ${ACCENT}66`, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: `0 0 60px rgba(37,99,235,0.28)`,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: WHITE }}>HA</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: WHITE, letterSpacing: '-0.02em' }}>EngagePro</span>
          </div>
        </div>

        <div style={{ ...slideUp(frame, 14), textAlign: 'center', lineHeight: 1.1 }}>
          <div style={{ fontSize: 14, color: ACCENT_LIGHT, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>
            Presented by HarAik Global
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.06 }}>
            <Headline size={56}>Client Lifecycle Management</Headline>
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, color: WHITE, lineHeight: 1.06 }}>
            for Finance Firms
          </div>
        </div>

        <div style={{ ...slideUp(frame, 28), fontSize: 18, color: WHITE_60, maxWidth: 600, textAlign: 'center', lineHeight: 1.72 }}>
          From the first opportunity to project delivery — every workflow, in one platform.
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE: Opportunities Dashboard ───────────────────────────────────────────

function SceneOpportunities() {
  const frame = useCurrentFrame()
  return (
    <Dark frame={frame}>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 56, padding: '56px 80px', alignItems: 'center' }}>
        <div style={{ height: 490, position: 'relative' }}>
          <BrowserChrome src={staticFile('screenshots/opportunities.jpeg')} url="app.haengagepro.com/opportunities" frame={frame} delay={0} zoomDuration={250}>
            <CalloutBadge label="Win Rate" value={<Counter value={49} frame={frame} delay={26} suffix="%" />} x="8px" y="8px" frame={frame} delay={26} />
            <CalloutBadge label="Pipeline" value="110 opportunities" x="8px" y="80px" frame={frame} delay={34} />
          </BrowserChrome>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Pill label="Opportunities Dashboard" frame={frame} delay={4} />
          <div style={{ ...slideUp(frame, 12), fontSize: 42, fontWeight: 800, lineHeight: 1.1 }}>
            Every deal, tracked<br /><BlueHeadline size={42}>from first contact.</BlueHeadline>
          </div>
          <div style={{ ...slideUp(frame, 20), fontSize: 16, color: WHITE_60, lineHeight: 1.75 }}>
            View all opportunities listings and analytics — pipeline value, win rate,
            and status at a glance, broken down by currency and fiscal year.
          </div>
          <BulletList frame={frame} delay={28} items={[
            'Total opportunities & win/loss tracking',
            'Pipeline value by currency',
            'Status filters: Active, Won, Lost',
            'Create new opportunities in one click',
          ]} />
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE: Create Opportunity ─────────────────────────────────────────────────

function SceneCreateOpportunity() {
  const frame = useCurrentFrame()
  const steps = ['Client Selection', 'Client Information', 'Opportunity Details']

  return (
    <Dark frame={frame}>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 56, padding: '56px 80px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Pill label="New Business Workflow" frame={frame} delay={0} />
          <div style={{ ...slideUp(frame, 8), fontSize: 42, fontWeight: 800, lineHeight: 1.1 }}>
            Capture every deal,<br /><BlueHeadline size={42}>step by step.</BlueHeadline>
          </div>
          <div style={{ ...slideUp(frame, 16), fontSize: 16, color: WHITE_60, lineHeight: 1.75 }}>
            A guided multi-step workflow keeps new business consistent — from the
            first client touchpoint to a fully scoped opportunity, ready to convert.
          </div>

          {/* Step progress visual */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            {steps.map((s, i) => {
              const active = ease(frame, 26 + i * 14, 1) > 0.5
              return (
                <React.Fragment key={s}>
                  <div style={{ ...slideUp(frame, 26 + i * 14), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 84 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: active ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})` : 'rgba(255,255,255,0.06)',
                      border: active ? 'none' : '1px solid rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800, color: active ? WHITE : WHITE_35,
                      boxShadow: active ? `0 0 16px rgba(37,99,235,0.5)` : 'none',
                    }}>{i + 1}</div>
                    <span style={{ fontSize: 11, color: active ? WHITE_60 : WHITE_35, textAlign: 'center', lineHeight: 1.3 }}>{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 28, height: 2, background: 'rgba(37,99,235,0.3)', marginBottom: 22 }} />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          <div style={{ ...slideUp(frame, 70), fontSize: 14, color: ACCENT_LIGHT, marginTop: 8 }}>
            Converts directly into a project once won →
          </div>
        </div>

        <div style={{ height: 490, position: 'relative' }}>
          <BrowserChrome src={staticFile('screenshots/create-opportunity.jpeg')} url="app.haengagepro.com/opportunities/manage" frame={frame} delay={6} zoomDuration={230}>
            <CalloutBadge label="Step" value="1 of 3 — Client Selection" x="8px" y="8px" frame={frame} delay={30} />
          </BrowserChrome>
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE: Projects Dashboard ─────────────────────────────────────────────────

function SceneProjects() {
  const frame = useCurrentFrame()
  return (
    <Dark frame={frame}>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 56, padding: '56px 80px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Pill label="Projects Dashboard" frame={frame} delay={0} />
          <div style={{ ...slideUp(frame, 8), fontSize: 42, fontWeight: 800, lineHeight: 1.1 }}>
            Every project,<br /><BlueHeadline size={42}>one clear view.</BlueHeadline>
          </div>
          <div style={{ ...slideUp(frame, 16), fontSize: 16, color: WHITE_60, lineHeight: 1.75 }}>
            View all project listings and analytics — overdue, completed, pending,
            and under setup — so nothing falls through the cracks.
          </div>
          {[
            { label: 'Active', val: 28, color: ACCENT },
            { label: 'Under Setup', val: 14, color: '#f59e0b' },
            { label: 'Completed', val: 12, color: '#22c55e' },
            { label: 'Overdue', val: 17, color: '#ef4444' },
          ].map((s, i) => (
            <div key={s.label} style={{ ...slideUp(frame, 28 + i * 6), display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
              <span style={{ fontSize: 15, color: WHITE_60 }}>{s.label} Projects</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: s.color, marginLeft: 'auto' }}>
                <Counter value={s.val} frame={frame} delay={28 + i * 6} duration={35} />
              </span>
            </div>
          ))}
        </div>

        <div style={{ height: 490, position: 'relative' }}>
          <BrowserChrome src={staticFile('screenshots/projects.jpeg')} url="app.haengagepro.com/projects" frame={frame} delay={6} zoomDuration={260}>
            <CalloutBadge label="Total Projects" value="68" x="8px" y="8px" frame={frame} delay={32} />
          </BrowserChrome>
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE: Project Setup Workflow ──────────────────────────────────────────────

function SceneProjectSetup() {
  const frame = useCurrentFrame()
  const stages = [
    { label: 'Project Setup', sub: 'Details & Deadline' },
    { label: 'Project Execution', sub: 'Contracts → Milestones → Info Requests' },
  ]

  return (
    <Dark frame={frame}>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 56, padding: '56px 80px', alignItems: 'center' }}>
        <div style={{ height: 490, position: 'relative' }}>
          <BrowserChrome src={staticFile('screenshots/project-setup.jpeg')} url="app.haengagepro.com/projects/setup" frame={frame} delay={0} zoomDuration={260}>
            <CalloutBadge label="Stage" value="Project Execution" x="8px" y="8px" frame={frame} delay={30} />
          </BrowserChrome>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Pill label="Opportunity → Project" frame={frame} delay={4} />
          <div style={{ ...slideUp(frame, 12), fontSize: 40, fontWeight: 800, lineHeight: 1.1 }}>
            From won deal to<br /><BlueHeadline size={40}>live project — instantly.</BlueHeadline>
          </div>
          <div style={{ ...slideUp(frame, 20), fontSize: 16, color: WHITE_60, lineHeight: 1.75 }}>
            Once an opportunity is won, convert it into a project through a guided
            setup flow — no manual re-entry, nothing lost in translation.
          </div>

          {/* Two-stage pipeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
            {stages.map((s, i) => (
              <div key={s.label} style={{ ...slideX(frame, 32 + i * 16, 22, -30), display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: WHITE, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: WHITE }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: WHITE_35, marginTop: 1 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE: Client Consultations (icon/mockup — no screenshot yet) ────────────

function SceneConsultations() {
  const frame = useCurrentFrame()
  const requests = [
    { initials: 'AK', name: 'Ahmed Khan', topic: 'GCC Impairment Testing', status: 'Pending', color: '#f59e0b' },
    { initials: 'SJ', name: 'Sara Javed', topic: 'Sukuk Valuation Review', status: 'In Progress', color: ACCENT_LIGHT },
    { initials: 'BM', name: 'Bilal Malik', topic: 'KYC Documentation', status: 'Resolved', color: '#22c55e' },
  ]

  return (
    <Dark frame={frame}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36, padding: '0 100px' }}>
        <div style={{ ...slideUp(frame, 0), textAlign: 'center' }}>
          <Pill label="Client Consultations" frame={frame} delay={0} />
          <div style={{ fontSize: 46, fontWeight: 800, marginTop: 18, lineHeight: 1.1 }}>
            <span style={{ color: WHITE }}>When clients need help,</span><br />
            <Headline size={46}>your team is one click away.</Headline>
          </div>
          <div style={{ fontSize: 17, color: WHITE_60, marginTop: 14, lineHeight: 1.7, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
            Clients raise consultation requests directly from their portal — your technical
            team sees every request, prioritised and ready to action.
          </div>
        </div>

        {/* Mock request inbox */}
        <div style={{ width: 760, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {requests.map((r, i) => (
            <div key={r.name} style={{
              ...slideX(frame, 30 + i * 10, 24, i % 2 === 0 ? -40 : 40),
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '14px 18px', borderRadius: 12,
              background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: WHITE,
              }}>{r.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: WHITE }}>{r.name}</div>
                <div style={{ fontSize: 13, color: WHITE_35, marginTop: 1 }}>{r.topic}</div>
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 999,
                color: r.color, background: `${r.color}18`, border: `1px solid ${r.color}40`,
              }}>{r.status}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE: Actionable Items ────────────────────────────────────────────────────

function SceneActionable() {
  const frame = useCurrentFrame()
  return (
    <Dark frame={frame}>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 56, padding: '56px 80px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Pill label="Actionable Items" frame={frame} delay={0} />
          <div style={{ ...slideUp(frame, 8), fontSize: 40, fontWeight: 800, lineHeight: 1.1 }}>
            Every person knows<br /><BlueHeadline size={40}>exactly what's next.</BlueHeadline>
          </div>
          <div style={{ ...slideUp(frame, 16), fontSize: 16, color: WHITE_60, lineHeight: 1.75 }}>
            View every item that requires your action across all modules and tasks —
            one personalised queue, always up to date.
          </div>
          {[
            { label: 'Pending Items', val: 8 },
            { label: 'Worked On This Month', val: 37 },
            { label: 'Assigned to Me', val: 20 },
          ].map((s, i) => (
            <div key={s.label} style={{ ...slideUp(frame, 24 + i * 6), display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 9 }}>
              <span style={{ fontSize: 14, color: WHITE_60 }}>{s.label}</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: ACCENT_LIGHT }}>
                <Counter value={s.val} frame={frame} delay={24 + i * 6} duration={30} />
              </span>
            </div>
          ))}
        </div>

        <div style={{ height: 460, position: 'relative' }}>
          <BrowserChrome src={staticFile('screenshots/actionable.jpeg')} url="app.haengagepro.com/actionable" frame={frame} delay={6} zoomDuration={210}>
            <CalloutBadge label="Action Required" value="8 pending" x="8px" y="8px" frame={frame} delay={30} />
          </BrowserChrome>
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE: Task Board ──────────────────────────────────────────────────────────

function SceneTaskBoard() {
  const frame = useCurrentFrame()
  return (
    <Dark frame={frame}>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 56, padding: '56px 80px', alignItems: 'center' }}>
        <div style={{ height: 470, position: 'relative' }}>
          <BrowserChrome src={staticFile('screenshots/taskboard.jpeg')} url="app.haengagepro.com/tasks" frame={frame} delay={0} zoomDuration={240}>
            <CalloutBadge label="Tasks Due" value="6 overdue" x="8px" y="8px" frame={frame} delay={24} />
          </BrowserChrome>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Pill label="Task Board" frame={frame} delay={4} />
          <div style={{ ...slideUp(frame, 12), fontSize: 42, fontWeight: 800, lineHeight: 1.1 }}>
            One board.<br /><BlueHeadline size={42}>Every task, all in sync.</BlueHeadline>
          </div>
          <div style={{ ...slideUp(frame, 20), fontSize: 16, color: WHITE_60, lineHeight: 1.75 }}>
            View and update every task across all projects — or general tasks not
            linked to any project. Filter by project, status, assignee, or reporter.
          </div>
          <BulletList frame={frame} delay={28} items={[
            'Project tasks & general tasks, one view',
            'Filter by status, assignee, reporter',
            'Update status with the right permission',
            'Due-date tracking: overdue, due today, this week',
          ]} />
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE: Security & Compliance ────────────────────────────────────────────────

function SceneSecurity() {
  const frame = useCurrentFrame()
  const badges = [
    { icon: '🔒', title: 'VAPT Approved', sub: 'Vulnerability & penetration tested' },
    { icon: '🛡', title: 'Industry Auth', sub: 'SSO & standard authentication' },
    { icon: '👤', title: 'Role-Based Access', sub: 'Granular permission per user' },
    { icon: '📋', title: 'Audit Trail', sub: 'Every action logged & traceable' },
  ]
  return (
    <Dark frame={frame}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48, padding: '0 120px' }}>
        <div style={{ ...slideUp(frame, 0), textAlign: 'center' }}>
          <Pill label="Security & Compliance" frame={frame} delay={0} />
          <div style={{ fontSize: 48, fontWeight: 800, marginTop: 20, lineHeight: 1.1 }}>
            <Headline size={48}>VAPT-Approved.</Headline>{' '}
            <span style={{ color: WHITE }}>Scalable.</span>
          </div>
          <div style={{ fontSize: 18, color: WHITE_60, marginTop: 14, lineHeight: 1.7 }}>
            Integrated with industry-standard authentication — secure from the
            ground up, ready to grow with your firm.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20, width: '100%' }}>
          {badges.map((b, i) => (
            <div key={b.title} style={{ ...slideUp(frame, 12 + i * 7), padding: '22px 18px', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.22)', borderRadius: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 6 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: WHITE_35, lineHeight: 1.55 }}>{b.sub}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE: Outro ───────────────────────────────────────────────────────────────

function SceneOutro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const btnScale = spring({ frame: Math.max(0, frame - 28), fps, config: { stiffness: 200, damping: 18 } })
  const thumbs = ['projects', 'opportunities', 'create-opportunity', 'project-setup', 'actionable', 'taskboard']

  return (
    <Dark frame={frame}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 55%, rgba(37,99,235,0.10), transparent)`, pointerEvents: 'none' }} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
        <div style={{ ...slideUp(frame, 0), display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 32px rgba(37,99,235,0.4)` }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: WHITE }}>HA</span>
          </div>
          <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>EngagePro</span>
        </div>

        <div style={{ ...slideUp(frame, 8), textAlign: 'center', lineHeight: 1.08 }}>
          <div style={{ fontSize: 52, fontWeight: 800 }}>Ready to streamline your</div>
          <Headline size={52}>client operations?</Headline>
        </div>

        <div style={{ ...slideUp(frame, 16), fontSize: 18, color: WHITE_60, textAlign: 'center', maxWidth: 520, lineHeight: 1.72 }}>
          Built for finance firms. Trusted by HarAik Global.<br />
          Secure, scalable, and live today.
        </div>

        <div style={{ transform: `scale(${btnScale})`, ...fadeIn(frame, 28, 20), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 4 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 36px', background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})`, borderRadius: 12, fontSize: 17, fontWeight: 700, color: WHITE, boxShadow: `0 8px 32px rgba(37,99,235,0.35)` }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
              Watch Demo
            </div>
            <div style={{ padding: '15px 36px', border: `1.5px solid rgba(37,99,235,0.45)`, borderRadius: 12, fontSize: 17, fontWeight: 600, color: WHITE_60 }}>
              Request Access
            </div>
          </div>
          <div style={{ fontSize: 14, color: WHITE_35 }}>haraik.com/engage-pro</div>
        </div>

        <div style={{ ...fadeIn(frame, 40, 25), display: 'flex', gap: 10, marginTop: 14 }}>
          {thumbs.map((name, i) => (
            <div key={name} style={{ width: 122, height: 70, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(37,99,235,0.28)', boxShadow: '0 4px 16px rgba(0,0,0,0.5)', opacity: 0.88 }}>
              <Img src={staticFile(`screenshots/${name}.jpeg`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── Root: crossfade-linked TransitionSeries ───────────────────────────────────

const T = 20 // crossfade duration in frames

export const HAEngageProPro: React.FC = () => {
  return (
    <>
      <Html5Audio src={staticFile('audio/background-music.mp3')} volume={0.12} loop pauseWhenBuffering={false} />
      <Html5Audio src={staticFile('audio/voiceover.mp3')} volume={1.0} pauseWhenBuffering={false} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={150}><SceneIntro /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={270}><SceneOpportunities /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={240}><SceneCreateOpportunity /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={270}><SceneProjects /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={270}><SceneProjectSetup /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={240}><SceneConsultations /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={210}><SceneActionable /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={240}><SceneTaskBoard /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={240}><SceneSecurity /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={420}><SceneOutro /></TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  )
}

// Total duration = sum(durations) - (9 transitions * T)
// 150+270+240+270+270+240+210+240+240+420 = 2550; minus 9*20=180 → 2370 frames (79s @ 30fps)
export const HA_ENGAGE_PRO_PRO_DURATION = 2370
