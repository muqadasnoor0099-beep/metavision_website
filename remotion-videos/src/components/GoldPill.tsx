import React from 'react'
import { GOLD, GOLD_LIGHT } from '../design'

export function GoldPill({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 16px',
        borderRadius: 999,
        border: `1px solid rgba(212,175,55,0.35)`,
        background: 'rgba(212,175,55,0.1)',
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, boxShadow: `0 0 8px ${GOLD}` }} />
      <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  )
}

export function GoldGradientText({ children, size = 48 }: { children: string; size?: number }) {
  return (
    <span
      style={{
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.08,
      }}
    >
      {children}
    </span>
  )
}
