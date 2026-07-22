'use client'

import { useEffect, useState } from 'react'
import { BadgeCheck, Search, Bell } from 'lucide-react'

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function TopHeader() {
  const now = useClock()
  const time = now
    ? now.toLocaleTimeString('en-US', { hour12: false })
    : '--:--:--'
  const date = now
    ? now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : '—'

  return (
    <header className="animate-rise flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      {/* Brand */}
      <div className="flex items-center gap-4">
        <div className="animated-border glass flex h-14 w-14 items-center justify-center rounded-2xl">
          <span className="font-heading text-xl font-black tracking-tight text-neon-teal text-glow-teal">
            K
          </span>
        </div>
        <div>
          <h1 className="font-heading text-2xl font-extrabold uppercase leading-none tracking-[0.3em] text-foreground sm:text-3xl">
            KONE<span className="text-neon-teal text-glow-teal">XA</span>
          </h1>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:text-xs">
            Enterprise DevOps Operations Platform
          </p>
        </div>
      </div>

      {/* Right cluster: search + clock + profile */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="glass glass-hover flex h-11 items-center gap-2 rounded-2xl px-4 text-sm text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search operations</span>
          <kbd className="ml-2 hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            /
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

        {/* Live clock */}
        <div className="glass hidden h-11 items-center gap-3 rounded-2xl px-4 sm:flex">
          <span className="font-mono text-base font-semibold tabular-nums tracking-widest text-neon-teal">
            {time}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {date}
          </span>
        </div>

        {/* Profile card */}
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
              Founder &amp; Project Owner · v1.0 Foundation
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
