'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  // Reset to top on every page navigation — prevents Lenis from restoring
  // a stale scroll position while the incoming page is still mounting,
  // which is what causes the back-button crash on Vercel/production.
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
    // Re-measure pinned/scrolled elements after the new page renders
    ScrollTrigger.refresh()
  }, [pathname])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
    })

    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const gsapTicker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(gsapTicker)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(gsapTicker)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
