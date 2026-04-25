import React from 'react'
import { glass } from '../design'

export function GlassCard({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div style={{ ...glass, padding: 24, ...style }}>
      {children}
    </div>
  )
}
