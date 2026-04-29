import Link from 'next/link'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md'
  className?: string
  type?: 'button' | 'submit'
}

export default function GoldButton({ children, href, onClick, size = 'md', className = '', type = 'button' }: Props) {
  const base = `inline-flex items-center justify-center font-bold bg-gradient-to-r from-gold to-gold-light text-white rounded-[10px] transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 ${
    size === 'sm' ? 'text-xs px-4 py-2' : 'text-sm px-6 py-3'
  } ${className}`

  if (href) return <Link href={href} className={base}>{children}</Link>
  return <button type={type} onClick={onClick} className={base}>{children}</button>
}
