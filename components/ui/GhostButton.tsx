import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
}

export default function GhostButton({ children, onClick, className = '', type = 'button' }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded-[10px] text-sm px-5 py-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${className}`}
    >
      {children}
    </button>
  )
}
