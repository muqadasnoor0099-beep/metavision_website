'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'

// ─── Constants ────────────────────────────────────────────────────────────────
const SCENE_DURATION = 5000
const TOTAL_SCENES = 7

const C = {
  bg:     '#020c1b',
  blue:   '#0ea5e9',
  cyan:   '#22d3ee',
  purple: '#a855f7',
  green:  '#10b981',
  red:    '#f43f5e',
  white:  '#f0f9ff',
  muted:  'rgba(240,249,255,0.55)',
  dim:    'rgba(240,249,255,0.28)',
  glass:  'rgba(14,165,233,0.07)',
  border: 'rgba(14,165,233,0.22)',
  glow:   'rgba(14,165,233,0.18)',
}

const ease = [0.25, 0.46, 0.45, 0.94] as const

// ─── Scene meta — right-column copy ──────────────────────────────────────────
const SCENES = [
  {
    label: 'AI CONSULTATION INTELLIGENCE',
    title: 'The Future of Medical\nDocumentation',
    body:  'Our AI listens, understands, and captures everything in a live doctor-patient consultation — automatically, in real time.',
    bullets: [],
  },
  {
    label: 'LIVE CAPTURE',
    title: 'Every Word.\nEvery Detail.',
    body:  'The moment a consultation begins, our clinical NLP engine activates and starts structuring the entire conversation.',
    bullets: ['Real-time transcription', 'Speaker identification', 'Clinical terminology recognition', 'Zero manual input required'],
  },
  {
    label: 'AI EXTRACTION',
    title: 'Intelligent Data\nExtraction',
    body:  'Symptoms, diagnoses, medicines, dosages, and lab recommendations are automatically identified and tagged by the AI.',
    bullets: ['Symptom detection & severity', 'ICD-10 diagnosis mapping', 'Drug name & dosage parsing', 'Lab test recommendations'],
  },
  {
    label: 'HOLOGRAPHIC RECORDS',
    title: 'Complete Patient\nIntelligence',
    body:  'Structured patient data emerges instantly — a full medical picture from a single conversation, no typing required.',
    bullets: ['Patient history auto-linked', 'Chronic condition flags', 'Allergy & interaction checks', 'Previous visit summaries'],
  },
  {
    label: 'DIGITAL PRESCRIPTION',
    title: 'Auto-Generated.\nDoctor-Verified.',
    body:  'A formatted digital prescription is generated the moment the consultation ends — ready to sign, send, or print in one tap.',
    bullets: ['Prescription auto-populated', 'Dosage & frequency structured', 'Doctor e-signature support', 'Pharmacy-ready digital Rx'],
  },
  {
    label: 'HEALTH RECORDS',
    title: 'Complete Digital\nHealth Ecosystem',
    body:  'Every consultation feeds a living patient record — searchable, shareable, and accessible across your entire practice.',
    bullets: ['Consultation history timeline', 'AI-powered trend analysis', 'Cross-clinic record sharing', 'HIPAA-compliant storage'],
  },
  {
    label: 'TRANSFORM HEALTHCARE',
    title: 'Turning Conversations\nInto Intelligent Care',
    body:  'Join the next generation of AI-powered healthcare. From consultation room to digital record — in seconds, not hours.',
    bullets: [],
  },
]

// ─── Waveform Canvas ──────────────────────────────────────────────────────────
function WaveformCanvas({ active, color = C.cyan, height = 40, bars = 32 }: {
  active: boolean; color?: string; height?: number; bars?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef<number>(0)
  const tRef      = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      if (!active) { frameRef.current = requestAnimationFrame(draw); return }
      tRef.current += 0.06
      const barW = W / bars
      for (let i = 0; i < bars; i++) {
        const phase = i / bars * Math.PI * 4 + tRef.current
        const amp   = (Math.sin(phase) * 0.5 + 0.5) * (0.3 + Math.random() * 0.05)
        const h     = amp * H
        const x     = i * barW + barW * 0.15
        const y     = (H - h) / 2
        const grad  = ctx.createLinearGradient(0, y, 0, y + h)
        grad.addColorStop(0, color + '44')
        grad.addColorStop(0.5, color)
        grad.addColorStop(1, color + '44')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect(x, y, barW * 0.7, h, 2)
        ctx.fill()
      }
      frameRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frameRef.current)
  }, [active, color, bars, height])

  return <canvas ref={canvasRef} width={300} height={height} style={{ width: '100%', height }} />
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────
function PhoneMockup({ children, glow = true }: { children?: React.ReactNode; glow?: boolean }) {
  return (
    <div style={{ position: 'relative', width: 180, margin: '0 auto' }}>
      {glow && (
        <div style={{
          position: 'absolute', inset: -28, borderRadius: 48,
          background: `radial-gradient(ellipse at 50% 50%, rgba(14,165,233,0.22), transparent 70%)`,
          filter: 'blur(18px)', pointerEvents: 'none',
        }} />
      )}
      {/* Phone body */}
      <div style={{
        position: 'relative', width: 180, height: 360, borderRadius: 32,
        background: 'linear-gradient(145deg, #0f1f35, #071428)',
        border: '1.5px solid rgba(14,165,233,0.35)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(14,165,233,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}>
        {/* Notch */}
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 60, height: 10, background: '#020c1b', borderRadius: 8, zIndex: 10 }} />
        {/* Side buttons */}
        <div style={{ position: 'absolute', right: -3, top: 80, width: 3, height: 30, background: 'rgba(14,165,233,0.4)', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: -3, top: 70, width: 3, height: 20, background: 'rgba(14,165,233,0.3)', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: -3, top: 100, width: 3, height: 20, background: 'rgba(14,165,233,0.3)', borderRadius: 2 }} />
        {/* Screen */}
        <div style={{
          position: 'absolute', inset: 4, borderRadius: 29,
          background: 'linear-gradient(160deg, #030e1e 0%, #020c1b 100%)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          {/* Status bar */}
          <div style={{ padding: '18px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: C.muted, fontWeight: 700 }}>9:41</span>
            <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <div style={{ width: 10, height: 6, border: `1px solid ${C.muted}`, borderRadius: 1.5, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 1, top: 1, bottom: 1, width: '70%', background: C.green, borderRadius: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 8 }}>
                {[3,5,7,9].map(h => <div key={h} style={{ width: 2, height: h, background: C.muted, borderRadius: 1 }} />)}
              </div>
            </div>
          </div>
          {/* Screen content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>{children}</div>
          {/* Home bar */}
          <div style={{ padding: '6px 0 10px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 50, height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Floating Data Chip ───────────────────────────────────────────────────────
function DataChip({ icon, label, value, color, delay, x, y }: {
  icon: string; label: string; value: string; color: string; delay: number; x: string; y: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay, duration: 0.5, ease }}
      style={{
        position: 'absolute', left: x, top: y,
        background: `rgba(2,12,27,0.92)`,
        border: `1px solid ${color}55`,
        borderRadius: 10, padding: '7px 11px',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 4px 20px ${color}22`,
        minWidth: 130,
        zIndex: 20,
      }}
    >
      <div style={{ fontSize: 9, color: color, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{value}</span>
      </div>
    </motion.div>
  )
}

// ─── Holographic Card ─────────────────────────────────────────────────────────
function HoloCard({ title, icon, lines, color, delay, style }: {
  title: string; icon: string; lines: string[]; color: string; delay: number; style?: React.CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateX: 15 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay, duration: 0.55, ease }}
      style={{
        position: 'absolute',
        background: 'rgba(4,16,32,0.9)',
        border: `1px solid ${color}40`,
        borderRadius: 12,
        padding: '10px 12px',
        backdropFilter: 'blur(16px)',
        boxShadow: `0 8px 32px ${color}18, 0 0 0 1px ${color}15`,
        width: 140,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</span>
      </div>
      {lines.map((l, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, opacity: 0.7, flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: C.muted, lineHeight: 1.4 }}>{l}</span>
        </div>
      ))}
    </motion.div>
  )
}

// ─── Scene 0: Brand Reveal ────────────────────────────────────────────────────
function Scene0() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Particle field */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {Array.from({ length: 28 }).map((_, i) => (
          <motion.div key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0], y: [0, -80] }}
            transition={{ delay: i * 0.18, duration: 3 + Math.random() * 2, repeat: Infinity, repeatDelay: Math.random() * 2 }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${40 + Math.random() * 50}%`,
              width: 2 + Math.random() * 2,
              height: 2 + Math.random() * 2,
              borderRadius: '50%',
              background: i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.purple : C.blue,
            }}
          />
        ))}
      </div>

      {/* Concentric rings */}
      {[220, 160, 100].map((s, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.08 + i * 0.04, scale: 1 }}
          transition={{ delay: i * 0.15, duration: 1.2 }}
          style={{
            position: 'absolute', width: s, height: s,
            borderRadius: '50%', border: `1px solid ${C.blue}`,
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          }}
        />
      ))}

      {/* Phone */}
      <motion.div
        initial={{ opacity: 0, rotateY: -40, scale: 0.8 }}
        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
        transition={{ duration: 1.1, ease }}
        style={{ perspective: 800 }}
      >
        <PhoneMockup>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 14px' }}>
            {/* Medical cross */}
            <motion.div
              animate={{ boxShadow: [`0 0 20px ${C.blue}66`, `0 0 40px ${C.cyan}88`, `0 0 20px ${C.blue}66`] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <rect x="9" y="2" width="6" height="20" rx="2"/>
                <rect x="2" y="9" width="20" height="6" rx="2"/>
              </svg>
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.white, lineHeight: 1.3 }}>MediScribe AI</div>
              <div style={{ fontSize: 9, color: C.cyan, marginTop: 3, letterSpacing: '0.08em' }}>Ready to Listen</div>
            </div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: `rgba(34,211,238,0.12)`, border: `1px solid ${C.cyan}44` }}
            >
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} />
              <span style={{ fontSize: 8, color: C.cyan, fontWeight: 700 }}>AI ACTIVE</span>
            </motion.div>
          </div>
        </PhoneMockup>
      </motion.div>
    </div>
  )
}

// ─── Scene 1: Live Consultation ───────────────────────────────────────────────
function Scene1() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      {/* Recording badge */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 20, background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.35)' }}>
        <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
          style={{ width: 7, height: 7, borderRadius: '50%', background: C.red }} />
        <span style={{ fontSize: 9, fontWeight: 800, color: C.red, letterSpacing: '0.15em' }}>RECORDING LIVE</span>
      </motion.div>

      {/* Consultation scene */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, position: 'relative' }}>
        {/* Doctor */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ position: 'relative' }}>
            <motion.div animate={{ boxShadow: [`0 0 0 0 ${C.blue}44`, `0 0 0 10px transparent`] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${C.blue}55, ${C.blue}22)`, border: `2px solid ${C.blue}66`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Doctor SVG */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="7" r="4" fill={C.blue} opacity="0.9"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={C.blue} opacity="0.7"/>
                <path d="M16 14l2 4M18 14l2 4" stroke={C.cyan} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.white }}>Dr. Ahmed</div>
            <div style={{ fontSize: 8, color: C.blue }}>Physician</div>
          </div>
        </motion.div>

        {/* Waveform between them */}
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.6, duration: 0.7 }}
          style={{ width: 110, marginBottom: 28 }}>
          <WaveformCanvas active={true} color={C.cyan} height={36} bars={22} />
        </motion.div>

        {/* Patient */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ position: 'relative' }}>
            <motion.div animate={{ boxShadow: [`0 0 0 0 ${C.purple}44`, `0 0 0 10px transparent`] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }}
              style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${C.purple}55, ${C.purple}22)`, border: `2px solid ${C.purple}66`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="7" r="4" fill={C.purple} opacity="0.9"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={C.purple} opacity="0.7"/>
              </svg>
            </motion.div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.white }}>Ali Hassan</div>
            <div style={{ fontSize: 8, color: C.purple }}>Patient</div>
          </div>
        </motion.div>
      </div>

      {/* Phone below */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} style={{ transform: 'scale(0.7)', transformOrigin: 'top center', marginTop: -30 }}>
        <PhoneMockup glow={false}>
          <div style={{ padding: '8px 10px', height: '100%' }}>
            <div style={{ fontSize: 8, color: C.cyan, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>LIVE TRANSCRIPTION</div>
            {['Patient: "I have had fever..."', 'Dr: "Since when?"', 'Patient: "Three days, 102°F"'].map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.4 }}
                style={{ fontSize: 8, color: i % 2 === 0 ? C.muted : C.blue, marginBottom: 5, lineHeight: 1.4, padding: '3px 5px', borderRadius: 4, background: 'rgba(14,165,233,0.05)' }}>
                {line}
              </motion.div>
            ))}
          </div>
        </PhoneMockup>
      </motion.div>
    </div>
  )
}

// ─── Scene 2: AI Extraction ───────────────────────────────────────────────────
function Scene2() {
  const chips = [
    { icon: '🌡️', label: 'Symptom Detected',    value: 'Fever 102°F',         color: C.red,    delay: 0.4, x: '-5%',  y: '8%'  },
    { icon: '🫁', label: 'Symptom Detected',    value: 'Dry Cough · 5 days',  color: C.blue,   delay: 0.7, x: '55%',  y: '2%'  },
    { icon: '🔬', label: 'Diagnosis Identified', value: 'Acute Bronchitis',    color: C.cyan,   delay: 1.0, x: '-8%',  y: '55%' },
    { icon: '💊', label: 'Prescription',         value: 'Amoxicillin 500mg',   color: C.green,  delay: 1.3, x: '52%',  y: '58%' },
    { icon: '🧪', label: 'Lab Recommended',      value: 'Blood CBC + CRP',     color: C.purple, delay: 1.6, x: '18%',  y: '82%' },
  ]

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Phone center */}
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <PhoneMockup>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '6px 8px', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 6px', borderRadius: 6, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill={C.cyan}><circle cx="12" cy="12" r="10"/></svg>
              </motion.div>
              <span style={{ fontSize: 8, color: C.cyan, fontWeight: 700 }}>AI PROCESSING</span>
            </div>
            <WaveformCanvas active={true} color={C.blue} height={28} bars={18} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {['Symptoms: Fever, Cough', 'Duration: 3-5 days', 'Dx: Acute Bronchitis', 'Rx: Amoxicillin 500mg', 'Lab: CBC + CRP'].map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.25 }}
                  style={{ fontSize: 8, color: i < 2 ? C.muted : i === 2 ? C.cyan : i === 3 ? C.green : C.purple, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                  {line}
                </motion.div>
              ))}
            </div>
          </div>
        </PhoneMockup>
      </motion.div>

      {/* Floating chips */}
      {chips.map((c, i) => <DataChip key={i} {...c} />)}
    </div>
  )
}

// ─── Scene 3: Holographic Cards ───────────────────────────────────────────────
function Scene3() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ transform: 'scale(0.75)', transformOrigin: 'center' }}>
        <PhoneMockup>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 10px' }}>
            <div style={{ fontSize: 9, color: C.cyan, fontWeight: 700 }}>PATIENT PROFILE</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.white, textAlign: 'center' }}>Ali Hassan</div>
            <div style={{ width: '100%', height: 1, background: `linear-gradient(to right, transparent, ${C.blue}66, transparent)` }} />
            <div style={{ fontSize: 8, color: C.muted, textAlign: 'center', lineHeight: 1.6 }}>Age: 28 · M<br />Blood: O+<br />Last Visit: Apr 28</div>
          </div>
        </PhoneMockup>
      </motion.div>

      {/* 4 orbit cards */}
      <HoloCard title="Symptoms" icon="🌡️" color={C.red} delay={0.3}
        lines={['Fever 102°F – High', 'Dry Cough – 5 days', 'Chest tightness – mild', 'Fatigue – moderate']}
        style={{ top: '5%', left: '-2%' }} />
      <HoloCard title="Diagnosis" icon="🔬" color={C.cyan} delay={0.55}
        lines={['Acute Bronchitis', 'ICD-10: J20.9', 'Severity: Moderate', 'Infectious origin']}
        style={{ top: '5%', right: '-2%' }} />
      <HoloCard title="Prescription" icon="💊" color={C.green} delay={0.8}
        lines={['Amoxicillin 500mg × 7d', 'Paracetamol 500mg PRN', 'Cough syrup 10ml TDS', 'Vitamin C 1000mg OD']}
        style={{ bottom: '8%', left: '-2%' }} />
      <HoloCard title="Lab Tests" icon="🧪" color={C.purple} delay={1.05}
        lines={['Blood CBC + CRP', 'Chest X-ray if no imp.', 'Sputum culture (opt.)', 'Follow-up: 7 days']}
        style={{ bottom: '8%', right: '-2%' }} />
    </div>
  )
}

// ─── Scene 4: Digital Prescription ───────────────────────────────────────────
function Scene4() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease }}
        style={{
          width: 240, background: 'linear-gradient(145deg, #041020, #030d1a)',
          border: `1px solid ${C.blue}44`, borderRadius: 16,
          padding: '16px', boxShadow: `0 24px 60px rgba(14,165,233,0.18), 0 0 0 1px ${C.blue}22`,
        }}
      >
        {/* Rx header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.white }}>Digital Rx</div>
              <div style={{ fontSize: 8, color: C.cyan }}>MediScribe AI</div>
            </div>
          </div>
          <div style={{ fontSize: 8, color: C.green, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>VERIFIED</div>
        </div>

        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${C.blue}44, transparent)`, marginBottom: 10 }} />

        {/* Doctor info */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 8, color: C.muted, marginBottom: 2 }}>PRESCRIBING PHYSICIAN</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.white }}>Dr. Ahmed Malik, MBBS</div>
          <div style={{ fontSize: 8, color: C.blue }}>Reg. No: PMC-12345 · General Physician</div>
        </div>

        {/* Medicines */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 8, color: C.muted, marginBottom: 6 }}>PRESCRIBED MEDICINES</div>
          {[
            { name: 'Amoxicillin', dose: '500mg', freq: '3× daily · 7 days' },
            { name: 'Paracetamol', dose: '500mg', freq: 'As needed · 5 days' },
            { name: 'Bromhexine Syrup', dose: '10ml', freq: '3× daily · 5 days' },
          ].map((med, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.2 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 7px', borderRadius: 6, background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.12)', marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.white }}>{med.name} <span style={{ color: C.cyan }}>{med.dose}</span></div>
                <div style={{ fontSize: 7, color: C.muted }}>{med.freq}</div>
              </div>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill={C.green}><path d="M5 13l4 4L19 7"/></svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Signature */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          style={{ borderTop: `1px dashed ${C.blue}33`, paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9, color: C.blue, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Dr. A. Malik</div>
            <div style={{ fontSize: 7, color: C.dim }}>E-Signed · {new Date().toLocaleDateString()}</div>
          </div>
          {/* QR placeholder */}
          <div style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${C.blue}44`, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, padding: 2 }}>
            {Array.from({length:16}).map((_,i) => <div key={i} style={{ background: Math.random() > 0.5 ? C.blue : 'transparent', borderRadius: 1 }} />)}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── Scene 5: Dashboard ───────────────────────────────────────────────────────
function Scene5() {
  const metrics = [
    { label: 'Total Patients',        value: '1,247', color: C.blue,   icon: '👥' },
    { label: 'Consultations Today',   value: '89',    color: C.cyan,   icon: '🩺' },
    { label: 'Prescriptions Generated', value: '312', color: C.green,  icon: '💊' },
    { label: 'AI Accuracy',           value: '98.7%', color: C.purple, icon: '🤖' },
  ]
  const bars = [55, 72, 61, 88, 74, 92, 85]

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
      <div style={{ width: '100%', maxWidth: 300 }}>
        {/* Metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
          {metrics.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              style={{ background: 'rgba(4,16,32,0.85)', border: `1px solid ${m.color}33`, borderRadius: 10, padding: '8px 10px', boxShadow: `0 4px 16px ${m.color}10` }}
            >
              <div style={{ fontSize: 12, marginBottom: 3 }}>{m.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 8, color: C.dim, lineHeight: 1.3, marginTop: 1 }}>{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mini bar chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          style={{ background: 'rgba(4,16,32,0.85)', border: `1px solid ${C.border}`, borderRadius: 10, padding: '8px 10px' }}>
          <div style={{ fontSize: 8, color: C.blue, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>WEEKLY CONSULTATIONS</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 36 }}>
            {['M','T','W','T','F','S','S'].map((day, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <motion.div
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                  transition={{ delay: 0.8 + i * 0.08, duration: 0.5 }}
                  style={{ width: '100%', height: bars[i] * 0.36, background: i === 5 ? C.blue : `${C.blue}44`, borderRadius: '2px 2px 0 0', transformOrigin: 'bottom' }}
                />
                <span style={{ fontSize: 7, color: C.dim }}>{day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent patients */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
          style={{ background: 'rgba(4,16,32,0.85)', border: `1px solid ${C.border}`, borderRadius: 10, padding: '8px 10px', marginTop: 6 }}>
          <div style={{ fontSize: 8, color: C.cyan, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>RECENT CONSULTATIONS</div>
          {[['Ali Hassan','Acute Bronchitis','2m ago'], ['Sara Khan','Hypertension F/U','18m ago'], ['Omar Farooq','Diabetes Review','1h ago']].map(([n, d, t], i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 + i * 0.15 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < 2 ? 5 : 0, borderBottom: i < 2 ? `1px solid rgba(14,165,233,0.08)` : 'none', marginBottom: i < 2 ? 5 : 0 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.white }}>{n}</div>
                <div style={{ fontSize: 7, color: C.blue }}>{d}</div>
              </div>
              <span style={{ fontSize: 7, color: C.dim }}>{t}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ─── Scene 6: CTA ─────────────────────────────────────────────────────────────
function Scene6() {
  const features = [
    'Live consultation transcription', 'Automatic diagnosis extraction',
    'Digital prescription generation', 'Smart health record management',
    'Multi-doctor clinic support',     'HIPAA-compliant AI infrastructure',
  ]

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 12px' }}>
      {/* Central glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${C.blue}18, transparent 70%)`, pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
        style={{ padding: '4px 14px', borderRadius: 20, background: `rgba(14,165,233,0.1)`, border: `1px solid ${C.blue}44`, fontSize: 9, color: C.cyan, fontWeight: 700, letterSpacing: '0.12em' }}>
        AI HEALTHCARE PLATFORM
      </motion.div>

      {/* Animated logo */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
        style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 32px ${C.blue}55` }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <rect x="9" y="2" width="6" height="20" rx="2"/>
          <rect x="2" y="9" width="20" height="6" rx="2"/>
        </svg>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
        style={{ textAlign: 'center', lineHeight: 1.2 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.white, lineHeight: 1.25 }}>MediScribe AI</div>
        <div style={{ fontSize: 10, color: C.cyan, marginTop: 3 }}>Intelligent Care Platform</div>
      </motion.div>

      {/* Feature grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, width: '100%' }}>
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 7px', borderRadius: 6, background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.12)' }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.cyan, flexShrink: 0 }} />
            <span style={{ fontSize: 8, color: C.muted, lineHeight: 1.3 }}>{f}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Scene components map ─────────────────────────────────────────────────────
const SCENE_COMPONENTS = [Scene0, Scene1, Scene2, Scene3, Scene4, Scene5, Scene6]

// ─── Progress bar ─────────────────────────────────────────────────────────────
function SceneProgress({ scene, duration }: { scene: number; duration: number }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: TOTAL_SCENES }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, overflow: 'hidden', background: 'rgba(14,165,233,0.15)' }}>
          {i < scene && <div style={{ width: '100%', height: '100%', background: C.blue }} />}
          {i === scene && (
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              style={{ height: '100%', background: `linear-gradient(to right, ${C.blue}, ${C.cyan})` }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function MedicalShowcaseSection() {
  const [scene, setScene]     = useState(0)
  const [playing, setPlaying] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const isInView   = useInView(sectionRef, { once: true, margin: '-15%' })

  const nextScene = useCallback(() => {
    setScene(s => (s + 1) % TOTAL_SCENES)
  }, [])

  // Autoplay on scroll entry
  useEffect(() => {
    if (!isInView) return
    setPlaying(true)
  }, [isInView])

  // Advance scenes
  useEffect(() => {
    if (!playing) return
    timerRef.current = setInterval(nextScene, SCENE_DURATION)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [playing, nextScene])

  const SceneComp = SCENE_COMPONENTS[scene]
  const meta      = SCENES[scene]

  return (
    <section
      ref={sectionRef}
      style={{
        background: `linear-gradient(180deg, #020c1b 0%, #030e1f 60%, #020c1b 100%)`,
        position: 'relative', overflow: 'hidden',
        padding: '80px 0',
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: `linear-gradient(${C.blue} 1px, transparent 1px), linear-gradient(90deg, ${C.blue} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* Top edge glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${C.blue}55, transparent)` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${C.blue}33, transparent)` }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 16px', borderRadius: 20, background: 'rgba(14,165,233,0.08)', border: `1px solid ${C.blue}33`, marginBottom: 18 }}>
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.cyan, boxShadow: `0 0 8px ${C.cyan}` }} />
            </motion.div>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.cyan, letterSpacing: '0.15em', textTransform: 'uppercase' }}>New Product</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: C.white, lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
            AI Medical Consultation{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Intelligence
            </span>
          </h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            A smart mobile platform that listens to doctor-patient consultations and converts every conversation into structured clinical records — instantly.
          </p>
        </motion.div>

        {/* Main showcase grid */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center', minHeight: 460 }}
          className="medical-showcase-grid"
        >
          {/* LEFT: Animation stage */}
          <div style={{
            position: 'relative', height: 440,
            background: 'linear-gradient(145deg, #030f20, #020c1b)',
            borderRadius: 20, border: `1px solid ${C.blue}28`,
            boxShadow: `0 0 80px rgba(14,165,233,0.06), inset 0 1px 0 rgba(14,165,233,0.08)`,
            overflow: 'hidden',
          }}>
            {/* Corner accents */}
            {['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'].map((pos, i) => (
              <div key={i} style={{
                position: 'absolute',
                top:    pos.includes('top') ? 0 : 'auto',
                bottom: pos.includes('bottom') ? 0 : 'auto',
                left:   pos.includes('left') ? 0 : 'auto',
                right:  pos.includes('right') ? 0 : 'auto',
                width: 20, height: 20,
                borderTop:    pos.includes('top')    ? `2px solid ${C.blue}55` : 'none',
                borderBottom: pos.includes('bottom') ? `2px solid ${C.blue}55` : 'none',
                borderLeft:   pos.includes('left')   ? `2px solid ${C.blue}55` : 'none',
                borderRight:  pos.includes('right')  ? `2px solid ${C.blue}55` : 'none',
                borderTopLeftRadius:     pos === 'top-0 left-0'     ? 20 : 0,
                borderTopRightRadius:    pos === 'top-0 right-0'    ? 20 : 0,
                borderBottomLeftRadius:  pos === 'bottom-0 left-0'  ? 20 : 0,
                borderBottomRightRadius: pos === 'bottom-0 right-0' ? 20 : 0,
              }} />
            ))}

            {/* Progress bar */}
            <div style={{ position: 'absolute', top: 12, left: 14, right: 14, zIndex: 30 }}>
              <SceneProgress scene={scene} duration={SCENE_DURATION} />
            </div>

            {/* Scene stage */}
            <div style={{ position: 'absolute', inset: 0, top: 28 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <SceneComp />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Scene dots nav */}
            <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6, zIndex: 30 }}>
              {Array.from({ length: TOTAL_SCENES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setScene(i); if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = setInterval(nextScene, SCENE_DURATION) } }}
                  style={{ width: i === scene ? 16 : 6, height: 6, borderRadius: 3, background: i === scene ? C.blue : `${C.blue}44`, border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Scene copy */}
          <div style={{ padding: '0 8px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={scene}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.45, ease }}
              >
                {/* Scene label */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: `rgba(14,165,233,0.08)`, border: `1px solid ${C.blue}33`, marginBottom: 16 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.cyan }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: C.cyan, letterSpacing: '0.14em' }}>{meta.label}</span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: 'clamp(20px,2.8vw,30px)', fontWeight: 800, color: C.white, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px', whiteSpace: 'pre-line' }}>
                  {meta.title}
                </h3>

                {/* Body */}
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, margin: '0 0 22px' }}>
                  {meta.body}
                </p>

                {/* Bullets */}
                {meta.bullets.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {meta.bullets.map((b, i) => (
                      <motion.div
                        key={b}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                      >
                        <div style={{ width: 20, height: 20, borderRadius: 6, background: `rgba(14,165,233,0.1)`, border: `1px solid ${C.blue}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill={C.cyan}><path d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <span style={{ fontSize: 13, color: C.muted }}>{b}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* CTA on last scene */}
                {scene === TOTAL_SCENES - 1 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                    style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                    <Link href="/products/medical" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '11px 24px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                      background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`,
                      color: '#fff', textDecoration: 'none',
                      boxShadow: `0 8px 28px rgba(14,165,233,0.35)`,
                    }}>
                      Explore Platform
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                    <Link href="/contact" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '11px 24px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                      border: `1.5px solid ${C.blue}55`, color: C.muted, textDecoration: 'none',
                    }}>
                      Book a Demo
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom feature strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 48 }}
          className="medical-feature-strip"
        >
          {[
            { icon: '🎙️', label: 'Voice-to-Record', desc: 'Real-time AI transcription' },
            { icon: '🧠', label: 'Clinical NLP',    desc: 'ICD-10 diagnostic mapping'  },
            { icon: '📋', label: 'Smart Rx',        desc: 'Auto-prescription builder'  },
            { icon: '🔐', label: 'HIPAA Secure',    desc: 'End-to-end encrypted vault' },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              style={{
                padding: '16px', borderRadius: 12, textAlign: 'center',
                background: 'rgba(14,165,233,0.04)',
                border: `1px solid ${C.blue}22`,
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.4 }}>{item.desc}</div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .medical-showcase-grid { grid-template-columns: 1fr !important; }
          .medical-feature-strip { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  )
}
