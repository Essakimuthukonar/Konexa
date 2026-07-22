'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  Server,
  Workflow,
  Activity,
  BarChart3,
  FileText,
  Settings,
  type LucideIcon,
} from 'lucide-react'

type NavItem = {
  label: string
  icon: LucideIcon
  accent: string
}

const NAV: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, accent: '0,255,213' },
  { label: 'Infrastructure', icon: Server, accent: '139,92,246' },
  { label: 'Automation', icon: Workflow, accent: '0,255,157' },
  { label: 'Monitoring', icon: Activity, accent: '255,62,129' },
  { label: 'Analytics', icon: BarChart3, accent: '255,184,0' },
  { label: 'Documentation', icon: FileText, accent: '0,255,213' },
  { label: 'Settings', icon: Settings, accent: '139,92,246' },
]

export function Sidebar() {
  const [active, setActive] = useState('Dashboard')

  return (
    <aside className="animate-rise" style={{ animationDelay: '120ms' }}>
      <nav
        aria-label="Primary"
        className="glass sticky top-6 flex flex-col gap-1 rounded-3xl p-3 lg:w-[15.5rem]"
      >
        <div className="mb-2 flex items-center gap-2 px-3 pt-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-teal opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-teal" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Navigation
          </span>
        </div>

        {NAV.map((item, i) => {
          const Icon = item.icon
          const isActive = active === item.label
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActive(item.label)}
              aria-current={isActive ? 'page' : undefined}
              className="group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-300"
              style={
                {
                  ['--nav' as string]: item.accent,
                } as React.CSSProperties
              }
            >
              {/* active/hover background */}
              <span
                className={`absolute inset-0 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'border-[rgba(var(--nav),0.35)] bg-[rgba(var(--nav),0.10)]'
                    : 'border-transparent bg-transparent group-hover:border-[rgba(var(--nav),0.2)] group-hover:bg-[rgba(var(--nav),0.06)]'
                }`}
              />
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-[rgb(var(--nav))] shadow-[0_0_12px_rgb(var(--nav))]" />
              )}
              <Icon
                className={`relative z-10 h-[18px] w-[18px] shrink-0 transition-all duration-300 ${
                  isActive
                    ? 'text-[rgb(var(--nav))] drop-shadow-[0_0_8px_rgb(var(--nav))]'
                    : 'text-muted-foreground group-hover:text-[rgb(var(--nav))] group-hover:drop-shadow-[0_0_6px_rgb(var(--nav))]'
                }`}
              />
              <span
                className={`relative z-10 hidden text-sm font-medium transition-colors duration-300 lg:inline ${
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}
              >
                {item.label}
              </span>
              <span className="sr-only lg:hidden">{item.label}</span>
            </button>
          )
        })}

        <div className="mx-3 my-3 h-px neon-divider" />
        <div className="hidden px-3 pb-2 lg:block">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
            Cluster Region
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            us-east-1 · Primary
          </p>
        </div>
      </nav>
    </aside>
  )
}
