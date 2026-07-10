import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'var(--bg-body, #060b1f)' }}
    >
      <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">404</p>
      <h1
        className="font-heading font-extrabold text-white mb-4"
        style={{ fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1 }}
      >
        Page not found.
      </h1>
      <p className="text-white/50 text-sm mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
        style={{ background: '#2563eb', color: '#ffffff' }}
      >
        Go Home
      </Link>
    </div>
  )
}
