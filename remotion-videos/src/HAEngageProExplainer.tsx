import React from 'react'
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion'

// ─── Brand tokens ────────────────────────────────────────────────────────────

const DARK = '#07080f'
const ACCENT = '#2563eb'       // HA EngagePro blue
const ACCENT_LIGHT = '#60a5fa'
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

function fadeIn(frame: number, delay = 0, dur = 20) {
  return { opacity: ease(frame, delay, dur) }
}

// ─── Shared wrapper ───────────────────────────────────────────────────────────

function Dark({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK, fontFamily: FONT, color: WHITE, overflow: 'hidden', ...style }}>
      {/* Subtle radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 65% 55% at 50% 0%, rgba(37,99,235,0.09), transparent)`, pointerEvents: 'none' }} />
      {children}
    </AbsoluteFill>
  )
}

// Pill badge
function Pill({ label, color = ACCENT }: { label: string; color?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, border: `1px solid ${color}55`, background: `${color}14` }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  )
}

// Gold gradient headline
function Headline({ children, size = 52 }: { children: string; size?: number }) {
  return (
    <span style={{
      background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.08,
      display: 'inline',
    }}>
      {children}
    </span>
  )
}

// Blue gradient headline (brand color)
function BlueHeadline({ children, size = 52 }: { children: string; size?: number }) {
  return (
    <span style={{
      background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.08,
      display: 'inline',
    }}>
      {children}
    </span>
  )
}

// Badge overlay for screenshots
function CalloutBadge({ label, value, x, y, frame, delay = 0 }: { label: string; value: string; x: string; y: string; frame: number; delay?: number }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      ...fadeIn(frame, delay),
      background: 'rgba(7,8,15,0.88)',
      border: `1px solid rgba(37,99,235,0.4)`,
      borderRadius: 10,
      padding: '8px 14px',
      backdropFilter: 'blur(10px)',
      zIndex: 10,
    }}>
      <div style={{ fontSize: 10, color: ACCENT_LIGHT, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: WHITE, marginTop: 2 }}>{value}</div>
    </div>
  )
}

// ─── Screenshot frame component ──────────────────────────────────────────────

function ScreenFrame({
  src,
  frame,
  delay = 0,
  // Ken Burns: subtle zoom from 1→1.04 over the scene duration
  zoomStart = 1,
  zoomEnd = 1.04,
  zoomDuration = 180,
  children,
}: {
  src: string
  frame: number
  delay?: number
  zoomStart?: number
  zoomEnd?: number
  zoomDuration?: number
  children?: React.ReactNode
}) {
  const scale = interpolate(frame - delay, [0, zoomDuration], [zoomStart, zoomEnd], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      borderRadius: 14,
      border: '1px solid rgba(37,99,235,0.25)',
      boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
      ...fadeIn(frame, delay, 25),
    }}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      />
      {children}
    </div>
  )
}

// ─── SCENE 1: Brand Intro (0–150f = 0–5s) ────────────────────────────────────

function SceneIntro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const logoScale = spring({ frame, fps, config: { stiffness: 180, damping: 20 } })

  return (
    <Dark>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        {/* Logo pill */}
        <div style={{ transform: `scale(${logoScale})`, ...fadeIn(frame, 0) }}>
          <div style={{
            padding: '10px 28px',
            background: `linear-gradient(135deg, ${ACCENT}22, ${ACCENT}44)`,
            border: `1.5px solid ${ACCENT}66`,
            borderRadius: 14,
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: `0 0 48px rgba(37,99,235,0.22)`,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: WHITE }}>HA</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: WHITE, letterSpacing: '-0.02em' }}>EngagePro</span>
          </div>
        </div>

        <div style={{ ...slideUp(frame, 12), textAlign: 'center', lineHeight: 1.1 }}>
          <div style={{ fontSize: 14, color: ACCENT_LIGHT, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>
            Presented by HarAik Global
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.06 }}>
            <Headline size={58}>Client Lifecycle Management</Headline>
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, color: WHITE, lineHeight: 1.06 }}>
            for Finance Firms
          </div>
        </div>

        <div style={{ ...slideUp(frame, 24), fontSize: 18, color: WHITE_60, maxWidth: 580, textAlign: 'center', lineHeight: 1.72 }}>
          A management platform built for finance companies — from onboarding to delivery, all in one place.
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE 2: Projects — Client Lifecycle (150–450f = 5–15s) ─────────────────

function SceneProjects() {
  const frame = useCurrentFrame()

  return (
    <Dark>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 56, padding: '56px 80px', alignItems: 'center' }}>
        {/* Left: copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 0)}><Pill label="Client Lifecycle" /></div>
          <div style={{ ...slideUp(frame, 8), fontSize: 42, fontWeight: 800, lineHeight: 1.1 }}>
            From onboarding to<br /><BlueHeadline size={42}>delivery — tracked.</BlueHeadline>
          </div>
          <div style={{ ...slideUp(frame, 16), fontSize: 16, color: WHITE_60, lineHeight: 1.75 }}>
            HA EngagePro streamlines the entire client lifecycle — project initiation,
            KYC, milestones, and outputs — so nothing falls through the cracks.
          </div>
          {/* Stat pills */}
          {[
            { label: 'Active', val: '30', color: ACCENT },
            { label: 'Under Setup', val: '10', color: '#f59e0b' },
            { label: 'Completed', val: '8', color: '#22c55e' },
          ].map((s, i) => (
            <div key={i} style={{ ...slideUp(frame, 24 + i * 6), display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
              <span style={{ fontSize: 15, color: WHITE_60 }}>{s.label} Projects</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: s.color, marginLeft: 'auto' }}>{s.val}</span>
            </div>
          ))}
        </div>

        {/* Right: screenshot */}
        <div style={{ ...fadeIn(frame, 6, 30), height: 480, position: 'relative' }}>
          <ScreenFrame src={staticFile('screenshots/projects.jpeg')} frame={frame} delay={6} zoomDuration={270}>
            <CalloutBadge label="Total Projects" value="62" x="8px" y="8px" frame={frame} delay={30} />
            <CalloutBadge label="KYC Pending" value="14" x="8px" y="80px" frame={frame} delay={38} />
          </ScreenFrame>
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE 3: Task Board — Team Collaboration (450–720f = 15–24s) ────────────

function SceneTaskBoard() {
  const frame = useCurrentFrame()

  return (
    <Dark>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 56, padding: '56px 80px', alignItems: 'center' }}>
        {/* Left: screenshot */}
        <div style={{ ...fadeIn(frame, 0, 30), height: 460, position: 'relative' }}>
          <ScreenFrame src={staticFile('screenshots/taskboard.jpeg')} frame={frame} delay={0} zoomDuration={240}>
            <CalloutBadge label="Tasks Due" value="17 overdue" x="8px" y="8px" frame={frame} delay={22} />
            <CalloutBadge label="Statuses" value="Done · In Review" x="8px" y="80px" frame={frame} delay={30} />
          </ScreenFrame>
        </div>

        {/* Right: copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 4)}><Pill label="Team Collaboration" /></div>
          <div style={{ ...slideUp(frame, 12), fontSize: 42, fontWeight: 800, lineHeight: 1.1 }}>
            One board.<br /><BlueHeadline size={42}>Zero scattered tools.</BlueHeadline>
          </div>
          <div style={{ ...slideUp(frame, 20), fontSize: 16, color: WHITE_60, lineHeight: 1.75 }}>
            Clients submit information directly. Teams pick up tasks, track milestones, and
            collaborate — all without switching between emails, spreadsheets, or chat apps.
          </div>
          {['Task assignment with due dates', 'Status tracking: To Do → Done', 'Client submissions in the same board', 'Reporter & assignee roles per task'].map((pt, i) => (
            <div key={i} style={{ ...slideUp(frame, 28 + i * 5), display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
              <span style={{ fontSize: 15, color: WHITE_60 }}>{pt}</span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE 4: Actionable Items — Personal Queue (720–930f = 24–31s) ──────────

function SceneActionable() {
  const frame = useCurrentFrame()

  return (
    <Dark>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 56, padding: '56px 80px', alignItems: 'center' }}>
        {/* Left: copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 0)}><Pill label="Cross-Firm Consultations" /></div>
          <div style={{ ...slideUp(frame, 8), fontSize: 40, fontWeight: 800, lineHeight: 1.1 }}>
            Every person knows<br /><BlueHeadline size={40}>exactly what's next.</BlueHeadline>
          </div>
          <div style={{ ...slideUp(frame, 16), fontSize: 16, color: WHITE_60, lineHeight: 1.75 }}>
            The platform supports consultations across firms, enabling broader collaboration.
            Each user's personalised queue shows Pending, Worked On, and Assigned items — instantly.
          </div>
          {[
            { label: 'Pending Items', val: '8' },
            { label: 'Worked On This Month', val: '37' },
            { label: 'Assigned to Me', val: '20' },
          ].map((s, i) => (
            <div key={i} style={{ ...slideUp(frame, 24 + i * 6), display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 9 }}>
              <span style={{ fontSize: 14, color: WHITE_60 }}>{s.label}</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: ACCENT_LIGHT }}>{s.val}</span>
            </div>
          ))}
        </div>

        {/* Right: screenshot */}
        <div style={{ ...fadeIn(frame, 6, 30), height: 460, position: 'relative' }}>
          <ScreenFrame src={staticFile('screenshots/actionable.jpeg')} frame={frame} delay={6} zoomDuration={200}>
            <CalloutBadge label="Action Required" value="8 pending" x="8px" y="8px" frame={frame} delay={28} />
          </ScreenFrame>
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE 5: Opportunities — Leadership Analytics (930–1200f = 31–40s) ──────

function SceneOpportunities() {
  const frame = useCurrentFrame()

  return (
    <Dark>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 56, padding: '56px 80px', alignItems: 'center' }}>
        {/* Left: screenshot */}
        <div style={{ ...fadeIn(frame, 0, 30), height: 480, position: 'relative' }}>
          <ScreenFrame src={staticFile('screenshots/opportunities.jpeg')} frame={frame} delay={0} zoomEnd={1.05} zoomDuration={250}>
            <CalloutBadge label="Win Rate Tracked" value="0.0% → grow" x="8px" y="8px" frame={frame} delay={25} />
            <CalloutBadge label="Pipeline" value="7 opps" x="8px" y="80px" frame={frame} delay={34} />
          </ScreenFrame>
        </div>

        {/* Right: copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 4)}><Pill label="Leadership Analytics" /></div>
          <div style={{ ...slideUp(frame, 12), fontSize: 42, fontWeight: 800, lineHeight: 1.1 }}>
            Insights from<br /><BlueHeadline size={42}>board to operations.</BlueHeadline>
          </div>
          <div style={{ ...slideUp(frame, 20), fontSize: 16, color: WHITE_60, lineHeight: 1.75 }}>
            Powerful analytics give senior leadership a full view of the pipeline —
            from opportunities and win rates down to per-client KYC status and submission tracking.
          </div>
          {['Opportunity pipeline & win/loss tracking', 'Status distribution charts', 'KYC submission status per client', 'Real-time activity feed'].map((pt, i) => (
            <div key={i} style={{ ...slideUp(frame, 28 + i * 5), display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
              <span style={{ fontSize: 15, color: WHITE_60 }}>{pt}</span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE 6: Project Dashboard — Role-Based UX (1200–1440f = 40–48s) ────────

function SceneDashboard() {
  const frame = useCurrentFrame()

  return (
    <Dark>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 56, padding: '56px 80px', alignItems: 'center' }}>
        {/* Left: copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 0)}><Pill label="Role-Based Experience" /></div>
          <div style={{ ...slideUp(frame, 8), fontSize: 42, fontWeight: 800, lineHeight: 1.1 }}>
            Every user sees<br /><BlueHeadline size={42}>what they need.</BlueHeadline>
          </div>
          <div style={{ ...slideUp(frame, 16), fontSize: 16, color: WHITE_60, lineHeight: 1.75 }}>
            Each user's experience is tailored based on their role. A partner sees the full picture;
            a team member sees their queue. Efficiency and security built in by design.
          </div>
          {['Summary · Kanban · Milestones · Deliverables', 'Information Requests & Communication Box', 'Contract status per project', 'Task & milestone donut analytics'].map((pt, i) => (
            <div key={i} style={{ ...slideUp(frame, 24 + i * 5), display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, flexShrink: 0, marginTop: 6 }} />
              <span style={{ fontSize: 14, color: WHITE_60, lineHeight: 1.55 }}>{pt}</span>
            </div>
          ))}
        </div>

        {/* Right: screenshot */}
        <div style={{ ...fadeIn(frame, 6, 30), height: 470, position: 'relative' }}>
          <ScreenFrame src={staticFile('screenshots/dashboard.jpeg')} frame={frame} delay={6} zoomDuration={220}>
            <CalloutBadge label="Milestones" value="7 tracked" x="8px" y="8px" frame={frame} delay={26} />
            <CalloutBadge label="Project Tabs" value="7 views" x="8px" y="80px" frame={frame} delay={34} />
          </ScreenFrame>
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── SCENE 7: Security (1440–1680f = 48–56s) ─────────────────────────────────

function SceneSecurity() {
  const frame = useCurrentFrame()

  const badges = [
    { icon: '🔒', title: 'VAPT Approved', sub: 'Vulnerability & penetration tested' },
    { icon: '🛡', title: 'Industry Auth', sub: 'SSO & standard authentication' },
    { icon: '👤', title: 'Role-Based Access', sub: 'Granular permission per user' },
    { icon: '📋', title: 'Audit Trail', sub: 'Every action logged & traceable' },
  ]

  return (
    <Dark>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48, padding: '0 120px' }}>
        <div style={{ ...slideUp(frame, 0), textAlign: 'center' }}>
          <Pill label="Security & Compliance" />
          <div style={{ fontSize: 48, fontWeight: 800, marginTop: 20, lineHeight: 1.1 }}>
            <Headline size={48}>VAPT-Approved.</Headline>{' '}
            <span style={{ color: WHITE }}>Scalable.</span>
          </div>
          <div style={{ fontSize: 18, color: WHITE_60, marginTop: 14, lineHeight: 1.7 }}>
            HA EngagePro is integrated with industry-standard authentication systems —
            secure from the ground up, ready to grow with your firm.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20, width: '100%' }}>
          {badges.map((b, i) => (
            <div key={i} style={{
              ...slideUp(frame, 12 + i * 7),
              padding: '22px 18px',
              background: 'rgba(37,99,235,0.07)',
              border: '1px solid rgba(37,99,235,0.22)',
              borderRadius: 14,
              textAlign: 'center',
            }}>
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

// ─── SCENE 8: Outro + Watch Demo CTA (1680–2100f = 56–70s) ───────────────────

function SceneOutro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const btnScale = spring({ frame: Math.max(0, frame - 28), fps, config: { stiffness: 200, damping: 18 } })

  return (
    <Dark>
      {/* Background accent */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 55%, rgba(37,99,235,0.10), transparent)`, pointerEvents: 'none' }} />

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
        {/* Logo */}
        <div style={{ ...slideUp(frame, 0), display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 32px rgba(37,99,235,0.4)` }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: WHITE }}>HA</span>
          </div>
          <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>EngagePro</span>
        </div>

        {/* Headline */}
        <div style={{ ...slideUp(frame, 8), textAlign: 'center', lineHeight: 1.08 }}>
          <div style={{ fontSize: 54, fontWeight: 800 }}>
            Ready to streamline your
          </div>
          <Headline size={54}>client operations?</Headline>
        </div>

        {/* Tagline */}
        <div style={{ ...slideUp(frame, 16), fontSize: 18, color: WHITE_60, textAlign: 'center', maxWidth: 520, lineHeight: 1.72 }}>
          Built for finance firms. Trusted by HarAik Global.<br />
          Secure, scalable, and live today.
        </div>

        {/* ── Watch Demo Button ── */}
        <div style={{ transform: `scale(${btnScale})`, ...fadeIn(frame, 28, 20), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 8 }}>
          {/* Primary CTA */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '15px 36px',
              background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})`,
              borderRadius: 12,
              fontSize: 17,
              fontWeight: 700,
              color: WHITE,
              boxShadow: `0 8px 32px rgba(37,99,235,0.35)`,
              cursor: 'pointer',
            }}>
              {/* Play icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Watch Demo
            </div>
            <div style={{
              padding: '15px 36px',
              border: `1.5px solid rgba(37,99,235,0.45)`,
              borderRadius: 12,
              fontSize: 17,
              fontWeight: 600,
              color: WHITE_60,
              cursor: 'pointer',
            }}>
              Request Access
            </div>
          </div>

          <div style={{ fontSize: 14, color: WHITE_35, marginTop: 4 }}>
            haraik.com/engage-pro
          </div>
        </div>

        {/* Five screenshots row — mini thumbnails */}
        <div style={{ ...fadeIn(frame, 36, 25), display: 'flex', gap: 10, marginTop: 16 }}>
          {['projects', 'taskboard', 'opportunities', 'actionable', 'dashboard'].map((name, i) => (
            <div key={i} style={{
              width: 130,
              height: 74,
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid rgba(37,99,235,0.28)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              opacity: 0.85,
            }}>
              <Img
                src={staticFile(`screenshots/${name}.jpeg`)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Dark>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export const HAEngageProExplainer: React.FC = () => {
  return (
    <>
      <Html5Audio src={staticFile('audio/background-music.mp3')} volume={0.12} loop pauseWhenBuffering={false} />
      <Html5Audio src={staticFile('audio/voiceover.mp3')} volume={1.0} pauseWhenBuffering={false} />
      <Sequence from={0}   durationInFrames={150}><SceneIntro /></Sequence>
      <Sequence from={150} durationInFrames={300}><SceneProjects /></Sequence>
      <Sequence from={450} durationInFrames={270}><SceneTaskBoard /></Sequence>
      <Sequence from={720} durationInFrames={210}><SceneActionable /></Sequence>
      <Sequence from={930} durationInFrames={270}><SceneOpportunities /></Sequence>
      <Sequence from={1200} durationInFrames={240}><SceneDashboard /></Sequence>
      <Sequence from={1440} durationInFrames={240}><SceneSecurity /></Sequence>
      <Sequence from={1680} durationInFrames={420}><SceneOutro /></Sequence>
    </>
  )
}
