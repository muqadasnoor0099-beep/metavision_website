'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.7,
      // expo ease-out — starts fast, feathers to rest for a longer, glidier tail
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: true,
      infinite: false,
    })

    // Keep GSAP ScrollTrigger's scroll measurements in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    // Run Lenis inside GSAP's single RAF loop instead of its own
    const gsapTicker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(gsapTicker)

    // Prevent GSAP from inserting artificial lag frames on fast scrolls
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger after Lenis is ready so pin calculations are correct
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(gsapTicker)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
