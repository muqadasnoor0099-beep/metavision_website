interface Props {
  overline?: string
  title: string
  titleGold?: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeader({ overline, title, titleGold, subtitle, centered = true }: Props) {
  return (
    <div className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : 'items-start'}`}>
      {overline && (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          <span className="text-gold text-[11px] font-semibold tracking-widest uppercase">{overline}</span>
        </div>
      )}
      <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight font-heading">
        <span className="text-white">{title} </span>
        {titleGold && (
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{titleGold}</span>
        )}
      </h2>
      {subtitle && <p className="text-white/50 text-sm leading-relaxed max-w-lg">{subtitle}</p>}
    </div>
  )
}
