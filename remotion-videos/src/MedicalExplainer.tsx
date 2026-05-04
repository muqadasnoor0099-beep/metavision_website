import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Sequence,
} from 'remotion'
import { BG, GOLD, GOLD_LIGHT, SURFACE, SURFACE_HIGH, TEXT, TEXT_MUTED, FONT_HEADING, FONT_BODY } from './design'
import { GoldPill, GoldGradientText } from './components/GoldPill'
import { GlassCard } from './components/GlassCard'
import { BarChart } from './components/BarChart'

// ─── helpers ────────────────────────────────────────────────────────────────

function fadeIn(frame: number, from = 0, delay = 0, duration = 20) {
  return interpolate(frame - delay, [0, duration], [from, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

function slideUp(frame: number, delay = 0, duration = 22) {
  const y = interpolate(frame - delay, [0, duration], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return { transform: `translateY(${y}px)`, opacity }
}

function RadialBg({ color = GOLD, opacity = 0.07 }: { color?: string; opacity?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 70% 60% at 50% 10%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, transparent)`,
        pointerEvents: 'none',
      }}
    />
  )
}

function SceneWrapper({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        fontFamily: FONT_BODY,
        color: TEXT,
        overflow: 'hidden',
        ...style,
      }}
    >
      <RadialBg />
      {children}
    </AbsoluteFill>
  )
}

function StatBadge({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  const frame = useCurrentFrame()
  return (
    <div style={{ ...slideUp(frame, delay), textAlign: 'center' }}>
      <div style={{ fontSize: 32, fontWeight: 800, color: GOLD, fontFamily: FONT_HEADING }}>{value}</div>
      <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 4, letterSpacing: '0.06em' }}>{label}</div>
    </div>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 44, background: `rgba(212,175,55,0.2)`, margin: '0 28px' }} />
}

// ─── Scene 1: Title / Brand intro (0–4s = frames 0–119) ─────────────────────

function SceneIntro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoScale = spring({ frame, fps, config: { stiffness: 200, damping: 22 } })

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
        {/* Logo */}
        <div style={{ transform: `scale(${logoScale})`, opacity: fadeIn(frame, 0) }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 900,
              color: '#000',
              fontFamily: FONT_HEADING,
              boxShadow: `0 0 48px rgba(212,175,55,0.35)`,
            }}
          >
            MV
          </div>
        </div>

        <div style={{ ...slideUp(frame, 10), textAlign: 'center' }}>
          <div style={{ fontSize: 16, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
            MetaVision presents
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, fontFamily: FONT_HEADING, color: TEXT, lineHeight: 1.06 }}>
            Medical Software
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.06 }}>
            <GoldGradientText size={56}>AI-Powered Healthcare Platform</GoldGradientText>
          </div>
        </div>

        <div style={{ ...slideUp(frame, 22), fontSize: 18, color: TEXT_MUTED, maxWidth: 540, textAlign: 'center', lineHeight: 1.7 }}>
          Real-time doctor–patient video consultations with intelligent prescription support,
          patient records, and lab integration — all in one platform.
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 2: The Problem (frames 120–269 = 4s–9s) ──────────────────────────

function SceneProblem() {
  const frame = useCurrentFrame()

  const PROBLEMS = [
    { icon: '⏱', text: 'Patients wait weeks for specialist appointments' },
    { icon: '📋', text: 'Paper records scattered across multiple files and clinics' },
    { icon: '💊', text: 'Prescription errors from manual drug-interaction checks' },
    { icon: '📞', text: 'No remote care option — every consultation requires physical presence' },
  ]

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 140px', gap: 40 }}>
        <div style={slideUp(frame, 0)}>
          <GoldPill label="The Problem" />
          <div style={{ fontSize: 42, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 18, lineHeight: 1.1 }}>
            Healthcare workflows<br />
            <GoldGradientText size={42}>are broken.</GoldGradientText>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {PROBLEMS.map((p, i) => (
            <div key={i} style={{ ...slideUp(frame, 10 + i * 8) }}>
              <GlassCard style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '18px 28px' }}>
                <span style={{ fontSize: 28 }}>{p.icon}</span>
                <span style={{ fontSize: 17, color: TEXT_MUTED, lineHeight: 1.5 }}>{p.text}</span>
              </GlassCard>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 3: The Solution hero (frames 270–449 = 9s–15s) ───────────────────

function SceneSolution() {
  const frame = useCurrentFrame()
  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0 100px', gap: 60 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={slideUp(frame, 0)}>
            <GoldPill label="The Solution" />
          </div>
          <div style={{ ...slideUp(frame, 8), fontSize: 44, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.08 }}>
            One platform.<br />
            <GoldGradientText size={44}>Every touchpoint.</GoldGradientText>
          </div>
          <div style={{ ...slideUp(frame, 16), fontSize: 16, color: TEXT_MUTED, lineHeight: 1.75, maxWidth: 400 }}>
            MetaVision Medical Software connects doctors and patients in real time,
            and keeps every record, prescription, and lab result in one unified workspace.
          </div>
        </div>

        {/* Right — mock dashboard */}
        <div style={{ ...slideUp(frame, 10) }}>
          <GlassCard style={{ padding: 28 }}>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
              Live Dashboard
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              {[{ label: 'Active Patients', val: '48' }, { label: 'Today\'s Consults', val: '23' }, { label: 'Prescriptions', val: '31' }].map((s, i) => (
                <div key={i} style={{ flex: 1, background: SURFACE_HIGH, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: GOLD }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <BarChart startFrame={20} height={80} />
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(212,175,55,0.08)', borderRadius: 8, border: '1px solid rgba(212,175,55,0.2)' }}>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>AI ANALYSIS</div>
              <div style={{ fontSize: 15, color: TEXT, fontWeight: 600, marginTop: 4 }}>Diagnosis Ready · Confidence: 97.4%</div>
            </div>
          </GlassCard>
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 4: Feature 1 — Live Video Consult (frames 450–629 = 15s–21s) ─────

function SceneFeatureVideo() {
  const frame = useCurrentFrame()
  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0 100px', gap: 60 }}>
        {/* Video call mock */}
        <div style={slideUp(frame, 0)}>
          <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: '#0d0d18', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD}33, ${SURFACE_HIGH})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                👨‍⚕️
              </div>
              <div style={{ position: 'absolute', bottom: 10, right: 10, width: 52, height: 52, borderRadius: 8, background: SURFACE_HIGH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                👤
              </div>
              {/* Recording indicator */}
              <div style={{ position: 'absolute', top: 10, left: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                <span style={{ fontSize: 11, color: TEXT_MUTED }}>LIVE</span>
              </div>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', gap: 10 }}>
              {['🎤', '📹', '🖥', '📞'].map((ic, i) => (
                <div key={i} style={{ flex: 1, height: 36, borderRadius: 8, background: SURFACE_HIGH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  {ic}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 6)}>
            <GoldPill label="Feature 01" />
          </div>
          <div style={{ ...slideUp(frame, 12), fontSize: 40, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.1 }}>
            HD Live Video<br />
            <GoldGradientText size={40}>Consultations</GoldGradientText>
          </div>
          <div style={{ ...slideUp(frame, 18), fontSize: 16, color: TEXT_MUTED, lineHeight: 1.75 }}>
            Doctors and patients connect face-to-face over encrypted HD video — from any device,
            any location. Built-in screen sharing lets doctors review reports together in real time.
          </div>
          {['End-to-end encrypted calls', 'Works on mobile & desktop', 'Share screen & reports live'].map((pt, i) => (
            <div key={i} style={{ ...slideUp(frame, 22 + i * 4), display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
              <span style={{ fontSize: 15, color: TEXT_MUTED }}>{pt}</span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 5: Feature 2 — AI Prescription (frames 630–809 = 21s–27s) ────────

function SceneFeatureAI() {
  const frame = useCurrentFrame()

  const suggestions = [
    { drug: 'Amoxicillin 500mg', match: '96%', safe: true },
    { drug: 'Ibuprofen 400mg', match: '91%', safe: true },
    { drug: 'Metformin 850mg', match: '78%', safe: false },
  ]

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0 100px', gap: 60 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 0)}>
            <GoldPill label="Feature 02" />
          </div>
          <div style={{ ...slideUp(frame, 8), fontSize: 40, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.1 }}>
            AI Prescription<br />
            <GoldGradientText size={40}>Suggestions</GoldGradientText>
          </div>
          <div style={{ ...slideUp(frame, 14), fontSize: 16, color: TEXT_MUTED, lineHeight: 1.75 }}>
            As the consultation progresses, the AI analyses symptoms, patient history, and known
            allergies — then surfaces the most suitable medications ranked by confidence score.
          </div>
          {['Flags drug-drug interactions instantly', 'Dosage recommendations by weight & age', 'Full audit trail per prescription'].map((pt, i) => (
            <div key={i} style={{ ...slideUp(frame, 20 + i * 4), display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
              <span style={{ fontSize: 15, color: TEXT_MUTED }}>{pt}</span>
            </div>
          ))}
        </div>

        {/* AI panel mock */}
        <div style={slideUp(frame, 6)}>
          <GlassCard>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.14em', marginBottom: 18 }}>AI PRESCRIPTION ENGINE</div>
            {suggestions.map((s, i) => (
              <div key={i} style={{
                ...slideUp(frame, 10 + i * 8),
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', marginBottom: 10,
                background: s.safe ? 'rgba(212,175,55,0.06)' : 'rgba(239,68,68,0.06)',
                border: `1px solid ${s.safe ? 'rgba(212,175,55,0.2)' : 'rgba(239,68,68,0.2)'}`,
                borderRadius: 8,
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{s.drug}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>{s.safe ? '✓ No interactions found' : '⚠ Interaction detected'}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.safe ? GOLD : '#ef4444' }}>{s.match}</div>
              </div>
            ))}
            <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <div style={{ width: '97%', height: '100%', background: `linear-gradient(to right, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 6, textAlign: 'right' }}>Overall Confidence: 97.4%</div>
          </GlassCard>
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 6: Feature 3 — Patient Records (frames 810–989 = 27s–33s) ─────────

function SceneFeatureRecords() {
  const frame = useCurrentFrame()

  const records = [
    { name: 'Ali Hassan', age: 34, last: 'Apr 12, 2026', condition: 'Hypertension' },
    { name: 'Fatima Khan', age: 28, last: 'Apr 18, 2026', condition: 'Diabetes Type 2' },
    { name: 'Usman Raza', age: 51, last: 'Apr 19, 2026', condition: 'Asthma' },
  ]

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0 100px', gap: 60 }}>
        {/* Records mock */}
        <div style={slideUp(frame, 0)}>
          <GlassCard>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.14em', marginBottom: 18 }}>PATIENT RECORDS</div>
            {records.map((r, i) => (
              <div key={i} style={{
                ...slideUp(frame, 8 + i * 7),
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0',
                borderBottom: i < records.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD}33, ${SURFACE_HIGH})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{r.name}, {r.age}</div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{r.condition} · Last: {r.last}</div>
                </div>
                <div style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>View →</div>
              </div>
            ))}
          </GlassCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 6)}>
            <GoldPill label="Feature 03" />
          </div>
          <div style={{ ...slideUp(frame, 12), fontSize: 40, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.1 }}>
            Unified Patient<br />
            <GoldGradientText size={40}>Records</GoldGradientText>
          </div>
          <div style={{ ...slideUp(frame, 18), fontSize: 16, color: TEXT_MUTED, lineHeight: 1.75 }}>
            Every consultation, prescription, lab result, and appointment note is stored securely
            and accessible from any device in seconds — no paper files, no lost history.
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 7: Stats / Social Proof (frames 990–1169 = 33s–39s) ───────────────

function SceneStats() {
  const frame = useCurrentFrame()

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
        <div style={{ ...slideUp(frame, 0), textAlign: 'center' }}>
          <GoldPill label="Proven Results" />
          <div style={{ fontSize: 46, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 18 }}>
            Trusted across Pakistan
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <StatBadge value="500+" label="Clinics Onboarded" delay={8} />
          <Divider />
          <StatBadge value="2M+" label="Consultations" delay={14} />
          <Divider />
          <StatBadge value="98%" label="Uptime SLA" delay={20} />
          <Divider />
          <StatBadge value="80%" label="Fewer Prescription Errors" delay={26} />
        </div>

        <div style={{ ...slideUp(frame, 32), maxWidth: 700, textAlign: 'center' }}>
          <GlassCard>
            <div style={{ fontSize: 17, color: TEXT_MUTED, lineHeight: 1.8, fontStyle: 'italic' }}>
              "MetaVision's medical platform cut our prescription errors by 80%. The AI suggestions are remarkably accurate."
            </div>
            <div style={{ marginTop: 16, fontSize: 14, fontWeight: 700, color: GOLD }}>Dr. Priya Sharma</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>Senior Physician, Apollo Clinics</div>
          </GlassCard>
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 8: How It Works (frames 1170–1439 = 39s–48s) ─────────────────────

function SceneHowItWorks() {
  const frame = useCurrentFrame()

  const steps = [
    { num: '01', title: 'Register & Set Up', body: 'Create your practice profile, add doctors, and configure patient intake forms in minutes.' },
    { num: '02', title: 'Start Consultations', body: 'Patients book via the portal. Doctors join the HD video call with one click.' },
    { num: '03', title: 'AI-Assisted Diagnosis', body: 'The AI suggests prescriptions, flags interactions, and generates the prescription PDF automatically.' },
  ]

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 120px', gap: 52 }}>
        <div style={{ ...slideUp(frame, 0), textAlign: 'center' }}>
          <GoldPill label="How It Works" />
          <div style={{ fontSize: 44, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 16 }}>
            Up and running in <GoldGradientText size={44}>3 steps</GoldGradientText>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, width: '100%' }}>
          {steps.map((s, i) => (
            <div key={i} style={slideUp(frame, 10 + i * 10)}>
              <GlassCard style={{ height: '100%' }}>
                <div style={{ fontSize: 42, fontWeight: 900, color: GOLD, opacity: 0.3, fontFamily: FONT_HEADING, marginBottom: 14 }}>{s.num}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.7 }}>{s.body}</div>
              </GlassCard>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 9: Pricing (frames 1440–1649 = 48s–55s) ──────────────────────────

function ScenePricing() {
  const frame = useCurrentFrame()

  const tiers = [
    { name: 'Starter', price: 'PKR 2,999', period: '/mo', features: ['5 doctors', '500 consults/mo', 'AI prescriptions', 'Patient portal'], highlight: false },
    { name: 'Professional', price: 'PKR 7,999', period: '/mo', features: ['25 doctors', 'Unlimited consults', 'Lab integration', 'Priority support'], highlight: true },
    { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited doctors', 'Dedicated infra', 'HIPAA audit', '24/7 support'], highlight: false },
  ]

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 100px', gap: 44 }}>
        <div style={{ ...slideUp(frame, 0), textAlign: 'center' }}>
          <GoldPill label="Pricing" />
          <div style={{ fontSize: 44, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 16 }}>
            Simple, transparent <GoldGradientText size={44}>plans</GoldGradientText>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, width: '100%' }}>
          {tiers.map((t, i) => (
            <div key={i} style={slideUp(frame, 10 + i * 8)}>
              <GlassCard
                style={{
                  border: t.highlight ? `1px solid rgba(212,175,55,0.45)` : undefined,
                  boxShadow: t.highlight ? `0 0 40px rgba(212,175,55,0.1)` : undefined,
                  position: 'relative',
                }}
              >
                {t.highlight && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: 999, padding: '3px 14px', fontSize: 10, fontWeight: 700, color: '#000' }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{t.name}</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: GOLD, fontFamily: FONT_HEADING }}>
                  {t.price}<span style={{ fontSize: 14, color: TEXT_MUTED, fontWeight: 400 }}>{t.period}</span>
                </div>
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {t.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: TEXT_MUTED }}>{f}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 10: CTA / Outro (frames 1650–2699 = 55s–90s) ─────────────────────

function SceneOutro() {
  const frame = useCurrentFrame()

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        {/* Logo */}
        <div style={{ ...slideUp(frame, 0), display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#000' }}>
            MV
          </div>
          <span style={{ fontSize: 28, fontWeight: 800, fontFamily: FONT_HEADING }}>MetaVision</span>
        </div>

        <div style={{ ...slideUp(frame, 8), textAlign: 'center' }}>
          <div style={{ fontSize: 52, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.06 }}>
            Ready to transform<br />
            <GoldGradientText size={52}>your practice?</GoldGradientText>
          </div>
        </div>

        <div style={{ ...slideUp(frame, 18), fontSize: 18, color: TEXT_MUTED, textAlign: 'center', maxWidth: 500, lineHeight: 1.7 }}>
          Start a free trial today — no credit card required.<br />
          Join 500+ clinics already on MetaVision.
        </div>

        <div style={{ ...slideUp(frame, 26), display: 'flex', gap: 18 }}>
          <div style={{ padding: '14px 36px', background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: 12, fontSize: 16, fontWeight: 700, color: '#000' }}>
            Start Free Trial
          </div>
          <div style={{ padding: '14px 36px', border: `1px solid rgba(212,175,55,0.3)`, borderRadius: 12, fontSize: 16, fontWeight: 600, color: TEXT_MUTED }}>
            Book a Demo
          </div>
        </div>

        <div style={{ ...slideUp(frame, 34), fontSize: 14, color: TEXT_MUTED, marginTop: 8 }}>
          metavision.in/products/medical
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Root composition ────────────────────────────────────────────────────────

export const MedicalExplainer: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={120}><SceneIntro /></Sequence>
      <Sequence from={120} durationInFrames={150}><SceneProblem /></Sequence>
      <Sequence from={270} durationInFrames={180}><SceneSolution /></Sequence>
      <Sequence from={450} durationInFrames={180}><SceneFeatureVideo /></Sequence>
      <Sequence from={630} durationInFrames={180}><SceneFeatureAI /></Sequence>
      <Sequence from={810} durationInFrames={180}><SceneFeatureRecords /></Sequence>
      <Sequence from={990} durationInFrames={180}><SceneStats /></Sequence>
      <Sequence from={1170} durationInFrames={270}><SceneHowItWorks /></Sequence>
      <Sequence from={1440} durationInFrames={210}><ScenePricing /></Sequence>
      <Sequence from={1650} durationInFrames={1050}><SceneOutro /></Sequence>
    </>
  )
}
