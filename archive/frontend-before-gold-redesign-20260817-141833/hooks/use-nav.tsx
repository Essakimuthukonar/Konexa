'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ViewId } from '@/lib/types'

interface NavState {
  view: ViewId
  setView: (v: ViewId) => void
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  collapsed: boolean
  toggleCollapsed: () => void
  paletteOpen: boolean
  setPaletteOpen: (v: boolean) => void
}

const NavContext = createContext<NavState | null>(null)

export function NavProvider({ children }: { children: ReactNode }) {
  const [view, setViewRaw] = useState<ViewId>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const setView = useCallback((v: ViewId) => {
    setViewRaw(v)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false)
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const value = useMemo<NavState>(
    () => ({
      view,
      setView,
      sidebarOpen,
      setSidebarOpen,
      collapsed,
      toggleCollapsed,
      paletteOpen,
      setPaletteOpen,
    }),
    [view, setView, sidebarOpen, collapsed, toggleCollapsed, paletteOpen],
  )

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export function useNav() {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav must be used within NavProvider')
  return ctx
}
