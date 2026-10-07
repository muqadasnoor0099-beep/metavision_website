'use client'

import { createContext, useContext, useEffect, useState, useSyncExternalStore, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'light', toggle: () => {}, mounted: false })

export function useTheme() {
  return useContext(ThemeContext)
}

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Reads the theme straight off <html>, which the blocking inline script in
// app/layout.tsx already sets correctly before hydration — so this is a pure
// read of already-settled DOM state, not a redundant localStorage lookup.
function getSnapshot(): Theme {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

function getServerSnapshot(): Theme {
  return 'light'
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [mounted, setMounted] = useState(false)

  // Purely a "has the client taken over from the SSR shell yet" flag for
  // consumers that need to defer theme-dependent rendering — no external
  // system to synchronize with, so it doesn't fit useSyncExternalStore. This
  // is React's own documented hydration-flag pattern (see react.dev's
  // "A common way to avoid hydration mismatches" example); there's no
  // external-store equivalent for "has hydration finished".
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('mv-theme', next)
    document.documentElement.classList.toggle('light', next === 'light')
    listeners.forEach((l) => l())
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}
