'use client'

import Image from 'next/image'
import { useTheme } from '@/components/providers/ThemeProvider'

interface Props {
  className?: string
}

export default function Logo({ className = 'h-9 w-auto' }: Props) {
  const { theme } = useTheme()
  const src = theme === 'dark' ? '/logos/dark-mode-logo.png' : '/logos/light-mode-logo-main.png'

  return (
    <Image
      src={src}
      alt="MetaVision"
      width={493}
      height={100}
      priority
      className={className}
    />
  )
}
