import Link from 'next/link'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export default function GoldButton({ children, href, onClick, size = 'md', className = '', type = 'button', disabled }: Props) {
  // Always has a colored gradient background, so text must stay white regardless of
  // site theme — text-white alone breaks here because html.light overrides
  // --color-white to a dark navy for the rest of the page.
  const base = `inline-flex items-center justify-center font-bold bg-gradient-to-r from-gold to-gold-light rounded-[10px] transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${
    size === 'sm' ? 'text-xs px-4 py-2' : 'text-sm px-6 py-3'
  } ${className}`
  const style = { color: '#ffffff' }

  if (href) return <Link href={href} className={base} style={style}>{children}</Link>
  return <button type={type} onClick={onClick} className={base} style={style} disabled={disabled}>{children}</button>
}
