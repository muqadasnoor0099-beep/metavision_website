import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function GlassCard({ children, className = '', hover = false }: Props) {
  return (
    <div
      className={`glass-card p-6 ${
        hover
          ? 'transition-all duration-300 hover:border-gold/30 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_40px_rgba(37,99,235,0.07)]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
