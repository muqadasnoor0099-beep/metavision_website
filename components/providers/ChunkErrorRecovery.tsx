'use client'

import { useEffect } from 'react'

/**
 * Catches stale JS-chunk 404s that happen when Vercel deploys a new build
 * while the user is mid-session. Without this, the browser shows
 * "This page couldn't load" on back-navigation because old chunk URLs
 * no longer exist on the CDN. A full location.reload() fetches fresh
 * HTML + current chunks from the new deployment instead.
 */
export default function ChunkErrorRecovery() {
  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      const msg = event.message ?? ''
      const src = (event.filename ?? '') + (event.error?.stack ?? '')
      const isChunkError =
        msg.includes('Loading chunk') ||
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        src.includes('_next/static/chunks')

      if (isChunkError) {
        // Prevent infinite reload loop — only reload once per 10 s
        const key = '__chunk_reload_ts'
        const last = Number(sessionStorage.getItem(key) ?? 0)
        if (Date.now() - last > 10_000) {
          sessionStorage.setItem(key, String(Date.now()))
          window.location.reload()
        }
      }
    }

    window.addEventListener('error', handler)
    return () => window.removeEventListener('error', handler)
  }, [])

  return null
}
