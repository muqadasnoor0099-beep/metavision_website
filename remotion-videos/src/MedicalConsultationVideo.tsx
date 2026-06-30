import React from 'react'
import {
  AbsoluteFill,
  Html5Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion'

// ─── Brand tokens ────────────────────────────────────────────────────────────

const BG      = '#020c1b'
const BLUE    = '#2563eb'
const BLUE_L  = '#60a5fa'
const CYAN    = '#22d3ee'
const PURPLE  = '#a855f7'
const GREEN   = '#10b981'
const RED     = '#ef4444'
const WHITE   = '#ffffff'
const W60     = 'rgba(255,255,255,0.60)'
const W35     = 'rgba(255,255,255,0.35)'
const W10     = 'rgba(255,255,255,0.10)'
const W05     = 'rgba(255,255,255,0.05)'
const FONT    = "'Segoe UI', system-ui, Arial, sans-serif"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function e(frame: number, delay = 0, dur = 22, from = 0, to = 1) {
  return interpolate(frame - delay, [0, dur], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

function su(frame: number, delay = 0, dur = 22): React.CSSProperties {
  return {
    opacity: e(frame, delay, dur),
    transform: `translateY(${interpolate(frame - delay, [0, dur], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
  }
}

function sf(frame: number, delay = 0, dur = 20): React.CSSProperties {
  return { opacity: e(frame, delay, dur) }
}

// ─── Scene wrapper ────────────────────────────────────────────────────────────

function Scene({ children, glow = BLUE }: { children: React.ReactNode; glow?: string }) {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, color: WHITE, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 55% at 50% -5%, ${glow}18, transparent)`,
        pointerEvents: 'none',
      }} />
      {children}
    </AbsoluteFill>
  )
}

// ─── Pill badge ───────────────────────────────────────────────────────────────

function Pill({ label, color = BLUE }: { label: string; color?: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 16px', borderRadius: 999,
      border: `1px solid ${color}55`, background: `${color}18`,
    }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>{label}</span>
    </div>
  )
}

// ─── Glass card ───────────────────────────────────────────────────────────────

function Glass({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 16,
      padding: 24,
      backdropFilter: 'blur(12px)',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Animated waveform bars ───────────────────────────────────────────────────

function Waveform({ frame, color = BLUE_L, bars = 28, height = 40 }: {
  frame: number; color?: string; bars?: number; height?: number
}) {
  const phases = React.useMemo(() =>
    Array.from({ length: bars }, () => Math.random() * Math.PI * 2), [bars])
  const freqs = React.useMemo(() =>
    Array.from({ length: bars }, () => 0.08 + Math.random() * 0.12), [bars])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height }}>
      {Array.from({ length: bars }, (_, i) => {
        const t = frame * freqs[i] + phases[i]
        const h = (0.3 + Math.abs(Math.sin(t)) * 0.7) * height
        return (
          <div
            key={i}
            style={{
              width: 4,
              height: h,
              borderRadius: 2,
              background: color,
              opacity: 0.5 + Math.abs(Math.sin(t)) * 0.5,
            }}
          />
        )
      })}
    </div>
  )
}


// ─── SCENE 0: Brand Reveal (frames 0–120, 4s) ─────────────────────────────────

function Scene0() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoScale = spring({ frame, fps, config: { stiffness: 180, damping: 20 } })
  const ring1 = e(frame, 10, 60, 0.6, 1)
  const ring2 = e(frame, 20, 60, 0.4, 1)

  return (
    <Scene>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        {/* Expanding rings */}
        {[ring1, ring2].map((r, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 200 + i * 80,
            height: 200 + i * 80,
            borderRadius: '50%',
            border: `1px solid ${BLUE}`,
            opacity: (1 - r) * 0.35,
            transform: `scale(${0.4 + r * 1.2})`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Logo badge */}
        <div style={{ transform: `scale(${logoScale})`, opacity: e(frame, 0, 14) }}>
          <div style={{
            width: 100,
            height: 100,
            background: `linear-gradient(135deg, ${BLUE}, ${BLUE_L})`,
            borderRadius: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 60px ${BLUE}66, 0 0 120px ${BLUE}22`,
          }}>
            {/* Medical cross */}
            <div style={{ position: 'relative', width: 44, height: 44 }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', width: 12, height: 44, background: WHITE, borderRadius: 3 }} />
              <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', height: 12, width: 44, background: WHITE, borderRadius: 3 }} />
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div style={{ ...su(frame, 12), textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: BLUE_L, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 12 }}>
            MetaVision presents
          </div>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.02em' }}>
            AI Medical
          </div>
          <div style={{
            fontSize: 62, fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.02em',
            background: `linear-gradient(90deg, ${BLUE_L}, ${CYAN})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Consultation Platform
          </div>
        </div>

        {/* Tagline */}
        <div style={{ ...su(frame, 26), fontSize: 18, color: W60, maxWidth: 520, textAlign: 'center', lineHeight: 1.7 }}>
          From live consultation to verified digital prescription — powered by AI, built for doctors.
        </div>

        {/* Pulse dot row */}
        <div style={{ ...sf(frame, 36), display: 'flex', gap: 10, marginTop: 8 }}>
          {[BLUE, CYAN, PURPLE].map((c, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: c,
              boxShadow: `0 0 10px ${c}`,
              animation: 'pulse 1.4s infinite',
            }} />
          ))}
        </div>
      </AbsoluteFill>
    </Scene>
  )
}

// ─── SCENE 1: Physical Hospital Examination (frames 120–330, 7s) ─────────────

const VITALS = [
  { label: 'Temp',     value: '38.7 °C', color: RED,    icon: '🌡', delay: 12 },
  { label: 'BP',       value: '128/84',  color: BLUE_L, icon: '💉', delay: 20 },
  { label: 'SpO₂',    value: '96%',     color: CYAN,   icon: '🫁', delay: 28 },
  { label: 'Pulse',    value: '94 bpm',  color: PURPLE, icon: '❤', delay: 36 },
]

function Scene1() {
  const frame = useCurrentFrame()

  return (
    <Scene glow={CYAN}>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '60px 100px', gap: 60 }}>

        {/* ── LEFT: Text + AI voice capture ── */}
        <div style={{ ...su(frame, 0), display: 'flex', flexDirection: 'column', gap: 22 }}>
          <Pill label="In-Clinic Examination" color={CYAN} />
          <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
            Doctor Examines.<br />
            <span style={{
              background: `linear-gradient(90deg, ${BLUE_L}, ${CYAN})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              AI Records Everything.
            </span>
          </div>
          <div style={{ fontSize: 16, color: W60, lineHeight: 1.75, maxWidth: 360 }}>
            While the doctor conducts the physical examination, the AI listens — capturing spoken
            findings, vitals, and observations in real time. No typing. No delays.
          </div>

          {/* Doctor voice capture panel */}
          <Glass style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `${RED}22`, border: `1px solid ${RED}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: RED,
                  boxShadow: `0 0 8px ${RED}`,
                  opacity: 0.6 + Math.sin(frame * 0.18) * 0.4,
                }} />
              </div>
              <span style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: '0.14em' }}>
                AI LISTENING · DOCTOR'S VOICE
              </span>
            </div>
            <Waveform frame={frame} color={BLUE_L} bars={32} height={42} />
            <div style={{
              marginTop: 14, padding: '10px 14px',
              background: `${BLUE}12`, borderRadius: 10,
              border: `1px solid ${BLUE}33`,
              fontSize: 13, color: W60, lineHeight: 1.7, fontStyle: 'italic' as const,
            }}>
              "Patient presents with fever of 38.7, dry persistent cough for three days,
              moderate fatigue and frontal headache..."
            </div>
          </Glass>
        </div>

        {/* ── RIGHT: Hospital room + vitals ── */}
        <div style={{ ...su(frame, 6), display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Hospital room mockup */}
          <div style={{
            background: 'linear-gradient(160deg, #071220, #0c1e35)',
            borderRadius: 20,
            border: `1px solid ${BLUE}33`,
            boxShadow: `0 0 50px ${BLUE}18`,
            padding: '28px 28px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Room number badge */}
            <div style={{
              position: 'absolute', top: 14, right: 14,
              background: `${BLUE}22`, border: `1px solid ${BLUE_L}44`,
              borderRadius: 8, padding: '4px 12px',
              fontSize: 11, color: BLUE_L, fontWeight: 700,
            }}>
              ROOM 07 · OPD
            </div>

            {/* Patient bed illustration */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 20 }}>
              {/* Bed */}
              <div style={{ position: 'relative', flex: 1 }}>
                {/* Pillow */}
                <div style={{
                  width: 70, height: 28,
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: 8, border: '1px solid rgba(255,255,255,0.10)',
                  marginBottom: 4, marginLeft: 8,
                }} />
                {/* Patient silhouette */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ fontSize: 36 }}>🤒</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Zain Ahmed, 29M</div>
                    <div style={{ fontSize: 11, color: W35 }}>Admitted · Ward B</div>
                  </div>
                </div>
                {/* Bed frame */}
                <div style={{
                  height: 12, background: 'rgba(255,255,255,0.06)',
                  borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)',
                }} />
              </div>

              {/* Doctor with tablet */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 38 }}>👨‍⚕️</div>
                {/* Tablet */}
                <div style={{
                  width: 44, height: 56,
                  background: '#0a1628',
                  border: `1px solid ${BLUE_L}55`,
                  borderRadius: 6,
                  boxShadow: `0 0 16px ${BLUE}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column' as const, gap: 3, padding: 4,
                }}>
                  {[80, 60, 70, 45].map((w, i) => (
                    <div key={i} style={{ width: `${w}%`, height: 3, background: BLUE_L, borderRadius: 2, opacity: 0.6 }} />
                  ))}
                </div>
                <div style={{ fontSize: 10, color: W35 }}>Dr. Aisha</div>
              </div>

              {/* Monitor / equipment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                <div style={{
                  width: 52, height: 40,
                  background: '#050e1c',
                  border: `1px solid ${GREEN}44`,
                  borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width={38} height={24} viewBox="0 0 38 24">
                    <polyline
                      points={`0,12 6,12 9,4 12,20 15,8 18,16 21,12 38,12`}
                      stroke={GREEN}
                      strokeWidth={1.5}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.7 + Math.sin(frame * 0.2) * 0.3}
                    />
                  </svg>
                </div>
                <div style={{ fontSize: 10, color: GREEN, fontWeight: 700 }}>ECG</div>
                {/* IV stand dots */}
                <div style={{ width: 4, height: 40, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }} />
              </div>
            </div>

            {/* AI status bar at bottom of room */}
            <div style={{
              ...sf(frame, 18),
              background: `${BLUE}14`, borderRadius: 10, padding: '8px 14px',
              border: `1px solid ${BLUE}33`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, boxShadow: `0 0 8px ${GREEN}` }} />
              <span style={{ fontSize: 11, color: BLUE_L, fontWeight: 700 }}>AI ACTIVE</span>
              <span style={{ fontSize: 11, color: W35, marginLeft: 4 }}>Capturing examination notes...</span>
            </div>
          </div>

          {/* Vitals grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {VITALS.map((v, i) => (
              <div key={i} style={su(frame, v.delay)}>
                <Glass style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{v.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: v.color }}>{v.value}</div>
                    <div style={{ fontSize: 10, color: W35, marginTop: 2 }}>{v.label}</div>
                  </div>
                </Glass>
              </div>
            ))}
          </div>
        </div>

      </AbsoluteFill>
    </Scene>
  )
}

// ─── SCENE 2: AI Symptom Extraction (frames 330–510, 6s) ─────────────────────

const CHIPS = [
  { label: 'Fever', value: '38.7 °C', color: RED,    delay: 0  },
  { label: 'Cough', value: 'Dry · Persistent', color: CYAN,  delay: 8  },
  { label: 'Fatigue', value: 'Moderate', color: PURPLE, delay: 16 },
  { label: 'Headache', value: 'Frontal · Mild', color: BLUE_L, delay: 24 },
  { label: 'Duration', value: '3 days', color: GREEN, delay: 32 },
]

function Scene2() {
  const frame = useCurrentFrame()

  return (
    <Scene glow={PURPLE}>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '60px 100px', gap: 60 }}>
        {/* Left content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={su(frame, 0)}>
            <Pill label="AI Extraction" color={PURPLE} />
          </div>
          <div style={{ ...su(frame, 8), fontSize: 44, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
            Symptoms Detected<br />
            <span style={{
              background: `linear-gradient(90deg, ${PURPLE}, ${BLUE_L})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Automatically
            </span>
          </div>
          <div style={{ ...su(frame, 16), fontSize: 16, color: W60, lineHeight: 1.75, maxWidth: 360 }}>
            As the conversation unfolds, the AI extracts every symptom, vital reading, and
            complaint — structured and ready for diagnosis in seconds.
          </div>

          {/* Transcript snippet */}
          <Glass style={{ ...su(frame, 22), padding: '16px 20px' }}>
            <div style={{ fontSize: 11, color: W35, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 12 }}>LIVE TRANSCRIPT</div>
            <div style={{ fontSize: 13, color: W60, lineHeight: 1.8 }}>
              <span style={{ color: BLUE_L, fontWeight: 700 }}>Patient: </span>
              "I've had a high fever for three days, around 38–39 degrees. I have a dry cough and feel very tired..."
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: BLUE_L, marginTop: 6 }} />
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: BLUE_L, marginTop: 6 }} />
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: BLUE_L, marginTop: 6 }} />
            </div>
          </Glass>
        </div>

        {/* Right: Chip cloud */}
        <div style={{ position: 'relative', height: 360 }}>
          {/* Centre indicator */}
          <div style={{
            ...sf(frame, 0),
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 100, height: 100, borderRadius: '50%',
            background: `radial-gradient(${PURPLE}22, transparent)`,
            border: `1px solid ${PURPLE}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: PURPLE, fontWeight: 700, textAlign: 'center' as const,
          }}>
            AI<br />SCAN
          </div>

          {CHIPS.map((chip, i) => {
            const angle = (i / CHIPS.length) * Math.PI * 2 - Math.PI / 2
            const r = 140
            const cx = 200 + Math.cos(angle) * r
            const cy = 180 + Math.sin(angle) * r
            return (
              <div key={i} style={{
                ...su(frame, chip.delay),
                position: 'absolute',
                left: cx - 70,
                top: cy - 28,
              }}>
                <div style={{
                  background: `${chip.color}14`,
                  border: `1px solid ${chip.color}44`,
                  borderRadius: 12,
                  padding: '10px 16px',
                  minWidth: 140,
                }}>
                  <div style={{ fontSize: 10, color: chip.color, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                    {chip.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, marginTop: 3 }}>
                    {chip.value}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  )
}

// ─── SCENE 3: Holographic Diagnosis Cards (frames 510–690, 6s) ───────────────

const HOLO_CARDS = [
  {
    title: 'Symptoms',
    color: RED,
    items: ['Fever 38.7 °C', 'Dry Cough', 'Fatigue', 'Frontal Headache'],
    icon: '🔴',
  },
  {
    title: 'AI Diagnosis',
    color: CYAN,
    items: ['Acute Bronchitis', 'Confidence: 94%', 'ICD-10: J20.9', 'Viral Origin'],
    icon: '🧠',
  },
  {
    title: 'Prescription',
    color: GREEN,
    items: ['Amoxicillin 500mg', 'Paracetamol 1g', 'Cough Syrup 10ml', '7-day course'],
    icon: '💊',
  },
  {
    title: 'Lab Tests',
    color: PURPLE,
    items: ['Complete Blood Count', 'CRP Level', 'Chest X-Ray', 'Sputum Culture'],
    icon: '🔬',
  },
]

function Scene3() {
  const frame = useCurrentFrame()

  return (
    <Scene glow={CYAN}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40, padding: '60px 100px' }}>
        <div style={{ ...su(frame, 0), textAlign: 'center' }}>
          <Pill label="AI Diagnosis" color={CYAN} />
          <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.02em', marginTop: 16 }}>
            Instant Clinical Overview —
            <span style={{
              background: `linear-gradient(90deg, ${BLUE_L}, ${CYAN})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {' '}All in One View
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, width: '100%' }}>
          {HOLO_CARDS.map((card, i) => (
            <div key={i} style={su(frame, 10 + i * 10)}>
              <div style={{
                background: `linear-gradient(135deg, ${card.color}12, rgba(255,255,255,0.02))`,
                border: `1px solid ${card.color}44`,
                borderRadius: 20,
                padding: 24,
                height: 220,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 0 40px ${card.color}18`,
              }}>
                {/* Glow spot */}
                <div style={{
                  position: 'absolute', top: -40, right: -40,
                  width: 120, height: 120, borderRadius: '50%',
                  background: `radial-gradient(${card.color}22, transparent)`,
                  pointerEvents: 'none',
                }} />

                <div style={{ fontSize: 28, marginBottom: 12 }}>{card.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: card.color, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 14 }}>
                  {card.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {card.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: card.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: W60 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Scene>
  )
}

// ─── SCENE 4: Digital Prescription (frames 690–870, 6s) ──────────────────────

function Scene4() {
  const frame = useCurrentFrame()
  const signProgress = e(frame, 30, 50)

  const MEDICINES = [
    { name: 'Amoxicillin Capsules', dose: '500 mg', sig: '1 cap × 3/day × 7 days', qty: '21' },
    { name: 'Paracetamol Tablets', dose: '1000 mg', sig: '1 tab × 3/day PRN fever', qty: '21' },
    { name: 'Benylin Cough Syrup', dose: '10 ml',   sig: '10 ml × 3/day × 5 days', qty: '150ml' },
  ]

  return (
    <Scene glow={GREEN}>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '60px 100px', gap: 60 }}>
        {/* Left content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={su(frame, 0)}>
            <Pill label="Digital Prescription" color={GREEN} />
          </div>
          <div style={{ ...su(frame, 8), fontSize: 44, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
            Verified Rx —<br />
            <span style={{
              background: `linear-gradient(90deg, ${GREEN}, ${CYAN})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Issued Instantly
            </span>
          </div>
          <div style={{ ...su(frame, 16), fontSize: 16, color: W60, lineHeight: 1.75, maxWidth: 380 }}>
            AI drafts the full prescription from the consultation. The doctor reviews, signs digitally,
            and the patient receives a verified PDF within seconds.
          </div>
          {['Auto-drafted from AI diagnosis', 'Drug-interaction checked', 'Digital signature & QR verified', 'Sent to patient & pharmacy'].map((pt, i) => (
            <div key={i} style={{ ...su(frame, 22 + i * 5), display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />
              <span style={{ fontSize: 15, color: W60 }}>{pt}</span>
            </div>
          ))}
        </div>

        {/* Right: Rx card */}
        <div style={su(frame, 6)}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${GREEN}44`,
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: `0 0 60px ${GREEN}18`,
          }}>
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${BLUE}22, ${BLUE_L}11)`,
              padding: '20px 24px',
              borderBottom: `1px solid rgba(255,255,255,0.07)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 10, color: BLUE_L, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>
                  Medical Prescription
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, marginTop: 4 }}>Dr. Aisha Rahman, MBBS</div>
                <div style={{ fontSize: 12, color: W35, marginTop: 2 }}>Reg. No: PMDC-12847 · Cardiologist</div>
              </div>
              <div style={{
                background: `${GREEN}22`, border: `1px solid ${GREEN}55`,
                borderRadius: 10, padding: '8px 14px',
                fontSize: 10, color: GREEN, fontWeight: 800,
                textAlign: 'center' as const,
              }}>
                ✓ VERIFIED
              </div>
            </div>

            {/* Patient info */}
            <div style={{ padding: '14px 24px', borderBottom: `1px solid ${W05}`, display: 'flex', gap: 32 }}>
              {[
                ['Patient', 'Zain Ahmed, 29M'],
                ['Date', 'May 04, 2026'],
                ['Ref #', 'RX-2026-4492'],
              ].map(([label, val], i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, color: W35, fontWeight: 700, letterSpacing: '0.1em' }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: WHITE, marginTop: 3 }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Rx symbol */}
            <div style={{ padding: '10px 24px 4px', fontSize: 28, fontWeight: 900, color: BLUE_L, opacity: 0.4 }}>℞</div>

            {/* Medicines */}
            <div style={{ padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MEDICINES.map((m, i) => (
                <div key={i} style={{
                  ...su(frame, 14 + i * 8),
                  background: W05, borderRadius: 10, padding: '12px 14px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{m.name}</span>
                    <span style={{ fontSize: 12, color: BLUE_L, fontWeight: 700 }}>{m.dose}</span>
                  </div>
                  <div style={{ fontSize: 12, color: W35, marginTop: 3 }}>{m.sig}</div>
                </div>
              ))}
            </div>

            {/* Signature + QR */}
            <div style={{
              padding: '14px 24px',
              borderTop: `1px solid ${W05}`,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 10, color: W35, marginBottom: 8, letterSpacing: '0.1em' }}>DIGITAL SIGNATURE</div>
                <svg width={120} height={30} viewBox="0 0 120 30">
                  <path
                    d="M5 20 Q15 5 25 18 Q35 30 45 15 Q55 2 65 20 Q75 35 85 12 Q95 0 115 22"
                    stroke={BLUE_L}
                    strokeWidth={2}
                    fill="none"
                    strokeDasharray={200}
                    strokeDashoffset={200 * (1 - signProgress)}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* QR placeholder */}
              <div style={{
                width: 56, height: 56,
                background: W10, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column' as const,
                gap: 2,
              }}>
                {Array.from({ length: 4 }, (_, r) => (
                  <div key={r} style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 4 }, (_, c) => (
                      <div key={c} style={{
                        width: 10, height: 10, borderRadius: 1,
                        background: ((r * 4 + c) % 3 === 0) ? WHITE : 'transparent',
                        border: `1px solid ${W35}`,
                      }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  )
}

// ─── SCENE 5: Analytics Dashboard (frames 870–1050, 6s) ──────────────────────

const WEEKLY = [62, 78, 54, 91, 67, 88, 75]
const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function Scene5() {
  const frame = useCurrentFrame()
  const barProgress = e(frame, 10, 40)

  const METRICS = [
    { label: 'Patients Today', value: '47', color: BLUE_L  },
    { label: 'Consultations',  value: '31', color: CYAN    },
    { label: 'Prescriptions',  value: '28', color: GREEN   },
    { label: 'AI Accuracy',    value: '97%', color: PURPLE },
  ]

  const PATIENTS = [
    { name: 'Zain Ahmed',   condition: 'Bronchitis',    time: '09:14 AM', status: GREEN  },
    { name: 'Sara Malik',   condition: 'Hypertension',  time: '10:32 AM', status: BLUE_L },
    { name: 'Hamid Baig',   condition: 'Diabetes T2',  time: '11:55 AM', status: PURPLE },
    { name: 'Nida Farooq',  condition: 'Asthma',        time: '02:10 PM', status: CYAN   },
  ]

  return (
    <Scene glow={BLUE}>
      <AbsoluteFill style={{ padding: '50px 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Header */}
        <div style={{ ...su(frame, 0), display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Pill label="Analytics Dashboard" />
            <div style={{ fontSize: 36, fontWeight: 800, marginTop: 12, letterSpacing: '-0.02em' }}>
              Practice Overview —
              <span style={{ color: BLUE_L }}> May 2026</span>
            </div>
          </div>
          <div style={{
            background: `${GREEN}18`, border: `1px solid ${GREEN}44`,
            borderRadius: 999, padding: '8px 18px',
            fontSize: 13, color: GREEN, fontWeight: 700,
          }}>
            ● Live
          </div>
        </div>

        {/* Metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {METRICS.map((m, i) => (
            <div key={i} style={su(frame, 6 + i * 6)}>
              <Glass style={{ textAlign: 'center' as const, padding: '20px 16px' }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 12, color: W35, marginTop: 6, letterSpacing: '0.05em' }}>{m.label}</div>
              </Glass>
            </div>
          ))}
        </div>

        {/* Chart + patients */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1 }}>
          {/* Bar chart */}
          <div style={su(frame, 20)}>
            <Glass style={{ height: '100%' }}>
              <div style={{ fontSize: 11, color: BLUE_L, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 20 }}>
                WEEKLY CONSULTATIONS
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 130 }}>
                {WEEKLY.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 11, color: W35 }}>{Math.round(h * barProgress)}</div>
                    <div style={{
                      width: '100%',
                      height: h * barProgress,
                      background: i === 3
                        ? `linear-gradient(to top, ${BLUE}, ${BLUE_L})`
                        : `linear-gradient(to top, ${BLUE}55, ${BLUE_L}33)`,
                      borderRadius: '4px 4px 0 0',
                      maxHeight: 100,
                    }} />
                    <div style={{ fontSize: 10, color: W35 }}>{DAYS[i]}</div>
                  </div>
                ))}
              </div>
            </Glass>
          </div>

          {/* Recent patients */}
          <div style={su(frame, 26)}>
            <Glass style={{ height: '100%' }}>
              <div style={{ fontSize: 11, color: CYAN, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 16 }}>
                RECENT PATIENTS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {PATIENTS.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '11px 0',
                    borderBottom: i < PATIENTS.length - 1 ? `1px solid ${W05}` : 'none',
                    ...su(frame, 28 + i * 6),
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: `${p.status}22`,
                      border: `1px solid ${p.status}55`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, flexShrink: 0,
                    }}>👤</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: W35, marginTop: 2 }}>{p.condition}</div>
                    </div>
                    <div style={{ fontSize: 11, color: W35 }}>{p.time}</div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.status, boxShadow: `0 0 6px ${p.status}` }} />
                  </div>
                ))}
              </div>
            </Glass>
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  )
}

// ─── SCENE 6: CTA Outro (frames 1050–1200, 5s) ───────────────────────────────

const FEATURES = [
  { icon: '📹', label: 'HD Live Consult'   },
  { icon: '🧠', label: 'AI Diagnosis'      },
  { icon: '💊', label: 'Digital Rx'        },
  { icon: '📊', label: 'Analytics'         },
  { icon: '🔒', label: 'Encrypted'         },
  { icon: '📱', label: 'Mobile Ready'      },
]

function Scene6() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const logoScale = spring({ frame, fps, config: { stiffness: 160, damping: 18 } })

  return (
    <Scene>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36, padding: '0 120px' }}>
        {/* Logo */}
        <div style={{ ...sf(frame, 0), transform: `scale(${logoScale})` }}>
          <div style={{
            width: 80, height: 80,
            background: `linear-gradient(135deg, ${BLUE}, ${BLUE_L})`,
            borderRadius: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 60px ${BLUE}55`,
          }}>
            <div style={{ position: 'relative', width: 34, height: 34 }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', width: 9, height: 34, background: WHITE, borderRadius: 2 }} />
              <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', height: 9, width: 34, background: WHITE, borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ ...su(frame, 8), textAlign: 'center' }}>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            Transform the way you
          </div>
          <div style={{
            fontSize: 58, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em',
            background: `linear-gradient(90deg, ${BLUE_L}, ${CYAN})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            practice medicine.
          </div>
        </div>

        {/* Feature grid */}
        <div style={{ ...su(frame, 16), display: 'flex', gap: 14, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: W05, border: `1px solid ${W10}`,
              borderRadius: 12, padding: '12px 18px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span style={{ fontSize: 13, color: W60, fontWeight: 600 }}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ ...su(frame, 24), display: 'flex', gap: 16 }}>
          <div style={{
            padding: '16px 40px',
            background: `linear-gradient(90deg, ${BLUE}, ${BLUE_L})`,
            borderRadius: 14, fontSize: 16, fontWeight: 700, color: WHITE,
            boxShadow: `0 0 30px ${BLUE}55`,
          }}>
            Get Started Free
          </div>
          <div style={{
            padding: '16px 40px',
            border: `1px solid ${BLUE_L}44`,
            borderRadius: 14, fontSize: 16, fontWeight: 600, color: W60,
          }}>
            Book a Demo
          </div>
        </div>

        {/* URL */}
        <div style={{ ...sf(frame, 34), fontSize: 14, color: W35, letterSpacing: '0.06em' }}>
          metavision.pk / medical
        </div>
      </AbsoluteFill>
    </Scene>
  )
}

// ─── Root composition ─────────────────────────────────────────────────────────

// Scene timing for 72s total (2160 frames @ 30fps):
// Scene0:  0  – 180   (6s)  Brand Reveal
// Scene1:  180 – 570  (13s) Physical Examination
// Scene2:  570 – 870  (10s) AI Extraction
// Scene3:  870 – 1170 (10s) Holographic Cards
// Scene4: 1170 – 1470 (10s) Digital Prescription
// Scene5: 1470 – 1770 (10s) Dashboard
// Scene6: 1770 – 2160 (13s) CTA Outro

export const MedicalConsultationVideo: React.FC = () => {
  return (
    <>
      <Html5Audio
        src={staticFile('audio/medical-consultation-vo.mp3')}
        volume={1.0}
        pauseWhenBuffering={false}
      />
      <Sequence from={0}    durationInFrames={180}><Scene0 /></Sequence>
      <Sequence from={180}  durationInFrames={390}><Scene1 /></Sequence>
      <Sequence from={570}  durationInFrames={300}><Scene2 /></Sequence>
      <Sequence from={870}  durationInFrames={300}><Scene3 /></Sequence>
      <Sequence from={1170} durationInFrames={300}><Scene4 /></Sequence>
      <Sequence from={1470} durationInFrames={300}><Scene5 /></Sequence>
      <Sequence from={1770} durationInFrames={390}><Scene6 /></Sequence>
    </>
  )
}
