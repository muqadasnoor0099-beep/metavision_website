import React from 'react'
import { interpolate, useCurrentFrame } from 'remotion'
import { GOLD, GOLD_LIGHT } from '../design'

const BARS = [0.45, 0.65, 0.5, 0.85, 0.7, 0.9, 1.0, 0.8]

export function BarChart({ startFrame = 0, height = 100 }: { startFrame?: number; height?: number }) {
  const frame = useCurrentFrame()
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height }}>
      {BARS.map((ratio, i) => {
        const progress = interpolate(frame - startFrame - i * 3, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        return (
          <div
            key={i}
            style={{
              width: 18,
              height: height * ratio * progress,
              background: `linear-gradient(to top, ${GOLD}, ${GOLD_LIGHT})`,
              borderRadius: '3px 3px 0 0',
              opacity: 0.85 + ratio * 0.15,
            }}
          />
        )
      })}
    </div>
  )
}
