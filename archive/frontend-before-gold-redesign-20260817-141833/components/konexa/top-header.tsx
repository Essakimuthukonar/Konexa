'use client'

import { useEffect, useState } from 'react'
import { BadgeCheck, Search, Bell, Menu, ChevronDown, Command, Circle } from 'lucide-react'
import { useNav } from '@/hooks/use-nav'
import { useNow } from '@/hooks/use-query'
import { StatusBadge } from './status-badge'
import { cn } from '@/lib/utils'

const ENVIRONMENTS = ['Production', 'Staging', 'Development']

export function TopHeader() {
  const { setSidebarOpen, setPaletteOpen } = useNav()
  const now = useNow()
  const [envOpen, setEnvOpen] = useState(false)
  const [env, setEnv] = useState('Production')

  const time = now ? now.toLocaleTimeString('en-US', { hour12: false }) : '--:--:--'
  const date = now
    ? now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : '—'

  useEffect(() => {
    const close = () => setEnvOpen(false)
    if (envOpen) {
      window.addEventListener('click', close)
      return () => window.removeEventListener('click', close)
    }
  }, [envOpen])

  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-3">
        {/* mobile menu */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
          className="glass glass-hover flex h-11 w-11 items-center justify-center rounded-2xl text-muted-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* environment selector */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setEnvOpen((o) => !o)}
            className="glass glass-hover flex h-11 items-center gap-2.5 rounded-2xl px-4 text-sm font-medium text-foreground"
            aria-haspopup="listbox"
            aria-expanded={envOpen}
          >
            <Circle className="h-2 w-2 fill-neon-green text-neon-green shadow-[0_0_8px_#00ff9d]" />
            {env}
            <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', envOpen && 'rotate-180')} />
          </button>
          {envOpen && (
            <ul
              role="listbox"
              className="glass absolute left-0 top-13 z-50 mt-2 w-44 rounded-2xl p-1.5"
            >
              {ENVIRONMENTS.map((e) => (
                <li key={e}>
                  <button
                    type="button"
                    onClick={() => { setEnv(e); setEnvOpen(false) }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors',
                      e === env ? 'bg-neon-teal/10 text-neon-teal' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                    )}
                  >
                    {e}
                    {e === env && <Circle className="h-2 w-2 fill-current" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass hidden h-11 items-center gap-3 rounded-2xl px-4 sm:flex">
          <StatusBadge state="OPERATIONAL" />
        </div>

        {/* live clock */}
        <div className="glass hidden h-11 items-center gap-3 rounded-2xl px-4 md:flex">
          <span className="font-mono text-base font-semibold tabular-nums tracking-widest text-neon-teal">
            {time}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {date}
          </span>
        </div>
      </div>

      {/* right cluster */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="glass glass-hover flex h-11 items-center gap-2 rounded-2xl px-4 text-sm text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search operations</span>
          <kbd className="ml-2 hidden items-center gap-0.5 rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="glass glass-hover relative flex h-11 w-11 items-center justify-center rounded-2xl text-muted-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-neon-pink shadow-[0_0_8px_#ff3e81]" />
        </button>

        <div className="glass glass-hover flex items-center gap-3 rounded-2xl px-3 py-2">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-teal/30 to-neon-purple/30 font-heading text-sm font-bold text-foreground">
              EK
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-neon-green shadow-[0_0_8px_#00ff9d]">
              <span className="absolute inset-0 animate-ping rounded-full bg-neon-green opacity-60" />
            </span>
          </div>
          <div className="pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold leading-none text-foreground">
                Essakimuthu Konar
              </span>
              <BadgeCheck className="h-4 w-4 text-neon-teal" />
            </div>
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Founder &amp; Creator · v1.0 Foundation
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
