'use client'

import dynamic from 'next/dynamic'

const GestureFXSection = dynamic(() => import('./GestureFXSection'), { ssr: false })

export default function GestureFXWrapper() {
  return <GestureFXSection />
}
