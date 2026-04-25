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

function RadialBg({ color = GOLD, opacity = 0.06 }: { color?: string; opacity?: number }) {
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
            CA Workflow Software
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.06 }}>
            <GoldGradientText size={56}>Professional Practice Management</GoldGradientText>
          </div>
        </div>

        <div style={{ ...slideUp(frame, 22), fontSize: 18, color: TEXT_MUTED, maxWidth: 560, textAlign: 'center', lineHeight: 1.7 }}>
          End-to-end workflow platform for chartered accountants —
          GST filing, ITR preparation, balance sheets, and client management all in one place.
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 2: The Problem (frames 120–269 = 4s–9s) ──────────────────────────

function SceneProblem() {
  const frame = useCurrentFrame()

  const PROBLEMS = [
    { icon: '📑', text: 'Managing hundreds of client files across different spreadsheets and folders' },
    { icon: '⏰', text: 'GST and ITR deadlines missed due to manual tracking and reminders' },
    { icon: '🔁', text: 'Repetitive data re-entry across government portals, Excel, and email' },
    { icon: '🔍', text: 'No central audit trail — finding who changed what is a manual nightmare' },
  ]

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 140px', gap: 40 }}>
        <div style={slideUp(frame, 0)}>
          <GoldPill label="The Problem" />
          <div style={{ fontSize: 42, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 18, lineHeight: 1.1 }}>
            CA practice management<br />
            <GoldGradientText size={42}>is still manual.</GoldGradientText>
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

// ─── Scene 3: The Solution (frames 270–449 = 9s–15s) ────────────────────────

function SceneSolution() {
  const frame = useCurrentFrame()

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0 100px', gap: 60 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={slideUp(frame, 0)}>
            <GoldPill label="The Solution" />
          </div>
          <div style={{ ...slideUp(frame, 8), fontSize: 44, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.08 }}>
            One workspace.<br />
            <GoldGradientText size={44}>Every client.</GoldGradientText>
          </div>
          <div style={{ ...slideUp(frame, 16), fontSize: 16, color: TEXT_MUTED, lineHeight: 1.75, maxWidth: 400 }}>
            MetaVision CA Software brings client data, GST filing, ITR preparation,
            and balance sheets into a single organised platform — so you spend time
            on advisory, not administration.
          </div>
        </div>

        {/* Dashboard mock */}
        <div style={{ ...slideUp(frame, 10) }}>
          <GlassCard style={{ padding: 28 }}>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
              Firm Overview
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              {[{ label: 'Active Clients', val: '247' }, { label: 'GST Due This Week', val: '18' }, { label: 'ITRs Filed (Apr)', val: '63' }].map((s, i) => (
                <div key={i} style={{ flex: 1, background: SURFACE_HIGH, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: GOLD }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <BarChart startFrame={20} height={80} />
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(212,175,55,0.08)', borderRadius: 8, border: '1px solid rgba(212,175,55,0.2)' }}>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>DEADLINE ALERT</div>
              <div style={{ fontSize: 14, color: TEXT, fontWeight: 600, marginTop: 4 }}>18 GST returns due in 3 days · 4 pending review</div>
            </div>
          </GlassCard>
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 4: Feature 1 — GST Filing (frames 450–629 = 15s–21s) ─────────────

function SceneFeatureGST() {
  const frame = useCurrentFrame()

  const clients = [
    { name: 'Mehta Traders', turnover: '₹42L', status: 'Filed', color: '#22c55e' },
    { name: 'Khan Enterprises', turnover: '₹18L', status: 'Ready', color: GOLD },
    { name: 'Raza & Co.', turnover: '₹91L', status: 'Draft', color: '#f97316' },
    { name: 'Singh Logistics', turnover: '₹55L', status: 'Filed', color: '#22c55e' },
  ]

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0 100px', gap: 60 }}>
        {/* GST panel */}
        <div style={slideUp(frame, 0)}>
          <GlassCard>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.14em', marginBottom: 18 }}>GST FILING QUEUE</div>
            {clients.map((c, i) => (
              <div key={i} style={{
                ...slideUp(frame, 8 + i * 6),
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < clients.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>Turnover: {c.turnover}</div>
                </div>
                <div style={{
                  padding: '4px 12px', borderRadius: 999,
                  background: `${c.color}18`,
                  border: `1px solid ${c.color}44`,
                  fontSize: 12, fontWeight: 700, color: c.color,
                }}>
                  {c.status}
                </div>
              </div>
            ))}
          </GlassCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 6)}>
            <GoldPill label="Feature 01" />
          </div>
          <div style={{ ...slideUp(frame, 12), fontSize: 40, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.1 }}>
            GST Return<br />
            <GoldGradientText size={40}>Filing & Tracking</GoldGradientText>
          </div>
          <div style={{ ...slideUp(frame, 18), fontSize: 16, color: TEXT_MUTED, lineHeight: 1.75 }}>
            Prepare and file GSTR-1, GSTR-3B, and annual returns for all clients from one dashboard.
            Track filing status, deadlines, and acknowledgements in real time.
          </div>
          {['GSTR-1, 3B, 9 & 9C support', 'Bulk filing for multiple clients', 'Auto-reconciliation with purchase data', 'Direct e-filing to GST portal'].map((pt, i) => (
            <div key={i} style={{ ...slideUp(frame, 24 + i * 4), display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
              <span style={{ fontSize: 15, color: TEXT_MUTED }}>{pt}</span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 5: Feature 2 — ITR Preparation (frames 630–809 = 21s–27s) ────────

function SceneFeatureITR() {
  const frame = useCurrentFrame()

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0 100px', gap: 60 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 0)}>
            <GoldPill label="Feature 02" />
          </div>
          <div style={{ ...slideUp(frame, 8), fontSize: 40, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.1 }}>
            ITR Preparation<br />
            <GoldGradientText size={40}>& e-Filing</GoldGradientText>
          </div>
          <div style={{ ...slideUp(frame, 14), fontSize: 16, color: TEXT_MUTED, lineHeight: 1.75 }}>
            Prepare income tax returns accurately for individuals, firms, and corporates.
            Built-in validation checks flag errors and missing fields before you file.
          </div>
          {['ITR-1 through ITR-7 forms', 'Income head-wise data entry', 'Tax liability & refund computation', 'Direct e-filing with acknowledgement'].map((pt, i) => (
            <div key={i} style={{ ...slideUp(frame, 20 + i * 4), display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
              <span style={{ fontSize: 15, color: TEXT_MUTED }}>{pt}</span>
            </div>
          ))}
        </div>

        {/* ITR mock form */}
        <div style={slideUp(frame, 6)}>
          <GlassCard>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.14em', marginBottom: 18 }}>ITR PREPARATION — CLIENT DETAIL</div>
            {[
              { label: 'Client Name', val: 'Rajesh Kumar Mehta' },
              { label: 'PAN', val: 'ABCPM1234R' },
              { label: 'Assessment Year', val: '2025–26' },
              { label: 'Gross Total Income', val: '₹18,42,500' },
              { label: 'Total Tax Liability', val: '₹2,84,300' },
            ].map((row, i) => (
              <div key={i} style={{
                ...slideUp(frame, 10 + i * 5),
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <span style={{ fontSize: 13, color: TEXT_MUTED }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{row.val}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: '10px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, fontSize: 13, color: '#22c55e', fontWeight: 600 }}>
              ✓ Validation passed — Ready to file
            </div>
          </GlassCard>
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 6: Feature 3 — Balance Sheets (frames 810–989 = 27s–33s) ─────────

function SceneFeatureBalanceSheet() {
  const frame = useCurrentFrame()

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0 100px', gap: 60 }}>
        {/* Balance sheet mock */}
        <div style={slideUp(frame, 0)}>
          <GlassCard>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.14em', marginBottom: 18 }}>BALANCE SHEET — FY 2025–26</div>

            <div style={{ fontSize: 13, color: GOLD, fontWeight: 700, marginBottom: 10 }}>ASSETS</div>
            {[['Fixed Assets', '₹38,00,000'], ['Current Assets', '₹21,40,000'], ['Cash & Bank', '₹4,80,000']].map(([k, v], i) => (
              <div key={i} style={{ ...slideUp(frame, 8 + i * 5), display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 13, color: TEXT_MUTED }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{v}</span>
              </div>
            ))}

            <div style={{ fontSize: 13, color: GOLD, fontWeight: 700, marginTop: 16, marginBottom: 10 }}>LIABILITIES</div>
            {[['Share Capital', '₹25,00,000'], ['Reserves & Surplus', '₹28,20,000'], ['Current Liabilities', '₹11,00,000']].map(([k, v], i) => (
              <div key={i} style={{ ...slideUp(frame, 20 + i * 5), display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 13, color: TEXT_MUTED }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{v}</span>
              </div>
            ))}
          </GlassCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 6)}>
            <GoldPill label="Feature 03" />
          </div>
          <div style={{ ...slideUp(frame, 12), fontSize: 40, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.1 }}>
            Balance Sheet<br />
            <GoldGradientText size={40}>Automation</GoldGradientText>
          </div>
          <div style={{ ...slideUp(frame, 18), fontSize: 16, color: TEXT_MUTED, lineHeight: 1.75 }}>
            Generate accurate balance sheets, P&L statements, and cash flow reports
            directly from imported transaction data — formatted and ready to share with clients.
          </div>
          {['Schedule VI compliant format', 'Auto-pulled from ledger entries', 'Export to PDF or Excel', 'Compare across financial years'].map((pt, i) => (
            <div key={i} style={{ ...slideUp(frame, 24 + i * 4), display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
              <span style={{ fontSize: 15, color: TEXT_MUTED }}>{pt}</span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 7: Feature 4 — Client Management (frames 990–1169 = 33s–39s) ─────

function SceneFeatureClients() {
  const frame = useCurrentFrame()

  const clients = [
    { name: 'Mehta & Sons', type: 'Pvt. Ltd.', tasks: 4, next: 'GST · Apr 30' },
    { name: 'Khan Enterprises', type: 'Partnership', tasks: 2, next: 'ITR · Jul 31' },
    { name: 'Raza Traders', type: 'Sole Prop.', tasks: 6, next: 'Audit · May 15' },
    { name: 'Singh & Co.', type: 'LLP', tasks: 1, next: 'GST · Apr 30' },
  ]

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0 100px', gap: 60 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={slideUp(frame, 0)}>
            <GoldPill label="Feature 04" />
          </div>
          <div style={{ ...slideUp(frame, 8), fontSize: 40, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.1 }}>
            Client<br />
            <GoldGradientText size={40}>Management Hub</GoldGradientText>
          </div>
          <div style={{ ...slideUp(frame, 14), fontSize: 16, color: TEXT_MUTED, lineHeight: 1.75 }}>
            Keep every client's documents, deadlines, communication, and task status in one place.
            Never miss a filing or lose a document again.
          </div>
          {['Centralised client database', 'Task & deadline tracking per client', 'Document storage & version control', 'Shared client portal for approvals'].map((pt, i) => (
            <div key={i} style={{ ...slideUp(frame, 20 + i * 4), display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
              <span style={{ fontSize: 15, color: TEXT_MUTED }}>{pt}</span>
            </div>
          ))}
        </div>

        {/* Client list mock */}
        <div style={slideUp(frame, 6)}>
          <GlassCard>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.14em', marginBottom: 18 }}>CLIENT LIST</div>
            {clients.map((c, i) => (
              <div key={i} style={{
                ...slideUp(frame, 10 + i * 6),
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0',
                borderBottom: i < clients.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${GOLD}18`, border: `1px solid ${GOLD}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏢</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{c.type} · Next: {c.next}</div>
                </div>
                <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, background: `${GOLD}12`, padding: '3px 10px', borderRadius: 999 }}>
                  {c.tasks} tasks
                </div>
              </div>
            ))}
          </GlassCard>
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 8: Stats / Social Proof (frames 1170–1349 = 39s–45s) ─────────────

function SceneStats() {
  const frame = useCurrentFrame()

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
        <div style={{ ...slideUp(frame, 0), textAlign: 'center' }}>
          <GoldPill label="Proven Results" />
          <div style={{ fontSize: 46, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 18 }}>
            Trusted by CA firms across Pakistan
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <StatBadge value="1,200+" label="CA Firms" delay={8} />
          <Divider />
          <StatBadge value="50M+" label="Records Processed" delay={14} />
          <Divider />
          <StatBadge value="99.9%" label="Filing Accuracy" delay={20} />
          <Divider />
          <StatBadge value="7x" label="Faster GST Filing" delay={26} />
        </div>

        <div style={{ ...slideUp(frame, 32), maxWidth: 700, textAlign: 'center' }}>
          <GlassCard>
            <div style={{ fontSize: 17, color: TEXT_MUTED, lineHeight: 1.8, fontStyle: 'italic' }}>
              "Filing 200+ GST returns used to take a week. Now it takes a day. MetaVision is a game-changer for our firm."
            </div>
            <div style={{ marginTop: 16, fontSize: 14, fontWeight: 700, color: GOLD }}>CA Rajesh Mehta</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>Founding Partner, Mehta & Associates, Delhi</div>
          </GlassCard>
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Scene 9: How It Works (frames 1350–1559 = 45s–52s) ─────────────────────

function SceneHowItWorks() {
  const frame = useCurrentFrame()

  const steps = [
    { num: '01', title: 'Import Client Data', body: 'Connect existing records via CSV or API. The platform auto-categorises transactions and organises them by client.' },
    { num: '02', title: 'Review & Approve', body: 'The platform compiles GST returns, ITR drafts, and balance sheets from imported data. You review and approve in one click.' },
    { num: '03', title: 'File & Report', body: 'Direct e-filing to government portals. Share branded reports with clients from the dashboard.' },
  ]

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 120px', gap: 52 }}>
        <div style={{ ...slideUp(frame, 0), textAlign: 'center' }}>
          <GoldPill label="How It Works" />
          <div style={{ fontSize: 44, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 16 }}>
            From import to filing in <GoldGradientText size={44}>3 steps</GoldGradientText>
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

// ─── Scene 10: Pricing (frames 1560–1769 = 52s–59s) ─────────────────────────

function ScenePricing() {
  const frame = useCurrentFrame()

  const tiers = [
    { name: 'Solo', price: '₹1,999', period: '/mo', features: ['50 clients', 'GST + ITR filing', 'Balance sheet automation', 'Audit trail'], highlight: false },
    { name: 'Firm', price: '₹5,499', period: '/mo', features: ['300 clients', 'Multi-user access', 'Advanced GST analytics', 'Client portal'], highlight: true },
    { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited clients', 'Custom workflows', 'API access', 'White-labeling'], highlight: false },
  ]

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 100px', gap: 44 }}>
        <div style={{ ...slideUp(frame, 0), textAlign: 'center' }}>
          <GoldPill label="Pricing" />
          <div style={{ fontSize: 44, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 16 }}>
            Plans for every <GoldGradientText size={44}>practice size</GoldGradientText>
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

// ─── Scene 11: CTA / Outro (frames 1770–2699 = 59s–90s) ─────────────────────

function SceneOutro() {
  const frame = useCurrentFrame()

  return (
    <SceneWrapper>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        <div style={{ ...slideUp(frame, 0), display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#000' }}>
            MV
          </div>
          <span style={{ fontSize: 28, fontWeight: 800, fontFamily: FONT_HEADING }}>MetaVision</span>
        </div>

        <div style={{ ...slideUp(frame, 8), textAlign: 'center' }}>
          <div style={{ fontSize: 52, fontWeight: 800, fontFamily: FONT_HEADING, lineHeight: 1.06 }}>
            Ready to streamline<br />
            <GoldGradientText size={52}>your practice?</GoldGradientText>
          </div>
        </div>

        <div style={{ ...slideUp(frame, 18), fontSize: 18, color: TEXT_MUTED, textAlign: 'center', maxWidth: 520, lineHeight: 1.7 }}>
          Start a free trial today — no credit card required.<br />
          Join 1,200+ CA firms already on MetaVision.
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
          metavision.in/products/accounting
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  )
}

// ─── Root composition ────────────────────────────────────────────────────────

export const AccountingExplainer: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={120}><SceneIntro /></Sequence>
      <Sequence from={120} durationInFrames={150}><SceneProblem /></Sequence>
      <Sequence from={270} durationInFrames={180}><SceneSolution /></Sequence>
      <Sequence from={450} durationInFrames={180}><SceneFeatureGST /></Sequence>
      <Sequence from={630} durationInFrames={180}><SceneFeatureITR /></Sequence>
      <Sequence from={810} durationInFrames={180}><SceneFeatureBalanceSheet /></Sequence>
      <Sequence from={990} durationInFrames={180}><SceneFeatureClients /></Sequence>
      <Sequence from={1170} durationInFrames={180}><SceneStats /></Sequence>
      <Sequence from={1350} durationInFrames={210}><SceneHowItWorks /></Sequence>
      <Sequence from={1560} durationInFrames={210}><ScenePricing /></Sequence>
      <Sequence from={1770} durationInFrames={930}><SceneOutro /></Sequence>
    </>
  )
}
