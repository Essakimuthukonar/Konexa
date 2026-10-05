'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  LayoutDashboard,
  Blocks,
  Server,
  Rocket,
  HardDrive,
  Activity,
  ScrollText,
  Settings,
  Info,
  Search,
  CornerDownLeft,
  type LucideIcon,
} from 'lucide-react'
import { useNav } from '@/hooks/use-nav'
import { cn } from '@/lib/utils'
import type { ViewId } from '@/lib/types'

type Command = {
  id: ViewId
  label: string
  hint: string
  icon: LucideIcon
  keywords: string
}

const COMMANDS: Command[] = [
  { id: 'overview', label: 'Go to Overview', hint: 'Command center summary', icon: LayoutDashboard, keywords: 'overview dashboard home' },
  { id: 'infrastructure', label: 'View Infrastructure', hint: 'VPC & resource topology', icon: Blocks, keywords: 'infrastructure vpc subnet topology' },
  { id: 'servers', label: 'View Servers', hint: 'EC2 instances & health', icon: Server, keywords: 'servers ec2 compute instances' },
  { id: 'applications', label: 'View Applications', hint: 'App status & versions', icon: Rocket, keywords: 'applications apps status versions' },
  { id: 'deployments', label: 'View Deployments', hint: 'CI/CD pipeline history', icon: Rocket, keywords: 'deployments ci cd pipeline releases' },
  { id: 'backups', label: 'View Backups', hint: 'S3 backup operations', icon: HardDrive, keywords: 'backups s3 archive restore' },
  { id: 'monitoring', label: 'Open Monitoring', hint: 'Live metric charts', icon: Activity, keywords: 'monitoring metrics charts cpu memory' },
  { id: 'logs', label: 'View Logs', hint: 'Terminal log stream', icon: ScrollText, keywords: 'logs terminal audit stream' },
  { id: 'settings', label: 'Open Settings', hint: 'Platform configuration', icon: Settings, keywords: 'settings config preferences' },
  { id: 'about', label: 'System Health & About', hint: 'Platform & founder', icon: Info, keywords: 'about health founder platform' },
]

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setView } = useNav()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COMMANDS
    return COMMANDS.filter((c) =>
      c.label.toLowerCase().includes(q) ||
      c.keywords.includes(q) ||
      c.hint.toLowerCase().includes(q),
    )
  }, [query])

  useEffect(() => {
    if (paletteOpen) {
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [paletteOpen])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    if (!paletteOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((a) => Math.min(a + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const cmd = filtered[active]
        if (cmd) {
          setView(cmd.id)
          setPaletteOpen(false)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paletteOpen, filtered, active, setView, setPaletteOpen])

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!paletteOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => setPaletteOpen(false)}
    >
      <div
        className="glass w-full max-w-xl overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Konexa Command Center"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search className="h-4 w-4 text-neon-teal" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
            aria-label="Search commands"
          />
          <kbd className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No commands found
            </p>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon
              const isActive = i === active
              return (
                <button
                  key={cmd.id}
                  type="button"
                  data-active={isActive}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => { setView(cmd.id); setPaletteOpen(false) }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors',
                    isActive ? 'bg-neon-teal/10' : 'hover:bg-white/5',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl border',
                      isActive ? 'border-neon-teal/40 text-neon-teal' : 'border-border text-muted-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <p className={cn('text-sm font-medium', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                      {cmd.label}
                    </p>
                    <p className="text-xs text-muted-foreground/70">{cmd.hint}</p>
                  </div>
                  {isActive && <CornerDownLeft className="h-3.5 w-3.5 text-neon-teal" />}
                </button>
              )
            })
          )}
        </div>
        <div className="border-t border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
          Konexa Command Center · Ctrl K
        </div>
      </div>
    </div>
  )
}
