'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  videoSrc: string
  title?: string
}

function tryPlay(el: HTMLVideoElement | null) {
  if (!el) return
  el.muted = true
  void el.play().catch(() => {
    /* blocked or not ready — user can use controls */
  })
}

export default function DemoModal({ open, onClose, videoSrc, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const onCanPlay = useCallback(() => {
    if (!open) return
    tryPlay(videoRef.current)
  }, [open])

  // Pause when closed; reset error when src changes
  useEffect(() => {
    if (!open) {
      videoRef.current?.pause()
    }
    setLoadError(null)
  }, [open, videoSrc])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="demo-modal-layer"
          /* Do not fade the whole layer in from opacity:0 — Chromium often blocks
             muted autoplay / loading for video inside “invisible” subtrees. */
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          {/* Backdrop: its own fade does not wrap the video */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-[6px]"
          />

          {/* Modal card: motion only on scale/y, video stays in a visible subtree */}
          <motion.div
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 14, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10 w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between mb-3 px-1">
              {title && (
                <span className="text-white/60 text-sm font-medium">{title}</span>
              )}
              <button
                onClick={onClose}
                className="ml-auto w-8 h-8 rounded-lg border border-white/10 hover:border-gold/30 flex items-center justify-center text-white/50 hover:text-white transition-all"
                aria-label="Close demo"
              >
                <X size={15} />
              </button>
            </div>

            {/* Video container */}
            <div
              className="relative w-full overflow-hidden rounded-xl border border-gold/15"
              style={{ aspectRatio: '16/9', boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 40px rgba(212,175,55,0.06)' }}
            >
              {loadError && (
                <div className="absolute inset-0 z-[1] flex items-center justify-center bg-[#060609] px-6 text-center text-sm text-red-300/90">
                  {loadError}
                </div>
              )}
              <video
                ref={videoRef}
                key={videoSrc}
                src={videoSrc}
                controls
                muted
                autoPlay
                playsInline
                preload="auto"
                className="relative z-0 w-full h-full object-contain"
                style={{ background: '#060609' }}
                onCanPlay={onCanPlay}
                onLoadedData={onCanPlay}
                onError={(e) => {
                  const code = e.currentTarget.error?.code
                  const hint =
                    code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
                      ? 'Format not supported in this browser.'
                      : 'File missing (404) or blocked. Ensure public/demos/ha-engage-pro.mp4 exists, or run: npm run sync-demo'
                  setLoadError(`Demo could not be loaded. ${hint}`)
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
