'use client'

import { useEffect } from 'react'

const CHUNK_PATTERNS = [
  'Loading chunk',
  'Failed to fetch dynamically imported module',
  'Importing a module script failed',
  'ChunkLoadError',
  '_next/static/chunks',
]

function isChunkError(msg: string, src = ''): boolean {
  return CHUNK_PATTERNS.some((p) => msg.includes(p) || src.includes(p))
}

function tryReload() {
  const key = '__chunk_reload_ts'
  const last = Number(sessionStorage.getItem(key) ?? 0)
  if (Date.now() - last > 10_000) {
    sessionStorage.setItem(key, String(Date.now()))
    window.location.reload()
  }
}

export default function ChunkErrorRecovery() {
  useEffect(() => {
    // Synchronous script errors
    const onError = (event: ErrorEvent) => {
      const msg = event.message ?? ''
      const src = (event.filename ?? '') + (event.error?.stack ?? '')
      if (isChunkError(msg, src)) tryReload()
    }

    // Dynamic import rejections — the most common cause of the back-nav 404 flash
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const msg = reason?.message ?? String(reason ?? '')
      const src = reason?.stack ?? ''
      if (isChunkError(msg, src)) {
        event.preventDefault()
        tryReload()
      }
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onUnhandledRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onUnhandledRejection)
    }
  }, [])

  return null
}
