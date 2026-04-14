'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  value: string
  label: string
}

export default function StatCounter({ value, label }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState('0')

  useEffect(() => {
    if (!isInView) return
    const match = value.match(/^([\d,.]+)(.*)$/)
    if (!match) {
      setDisplayed(value)
      return
    }
    const num = parseFloat(match[1].replace(/,/g, ''))
    const suffix = match[2]
    const duration = 1400
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(num * eased).toLocaleString() + suffix)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, value])

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl lg:text-4xl font-extrabold text-gold font-heading">{displayed}</div>
      <div className="text-white/40 text-xs mt-1 uppercase tracking-widest">{label}</div>
    </div>
  )
}
