'use client'

import {
  LayoutDashboard,
  Server,
  Blocks,
  Rocket,
  HardDrive,
  Activity,
  ScrollText,
  Settings,
  Info,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { useNav } from '@/hooks/use-nav'
import { usePrefersReducedMotion } from '@/hooks/use-query'
import { cn } from '@/lib/utils'
import type { ViewId } from '@/lib/types'

type NavItem = {
  label: string
  view: ViewId
  icon: LucideIcon
  accent: string
  desc: string
}

const NAV: NavItem[] = [
  { label: 'Overview', view: 'overview', icon: LayoutDashboard, accent: '0,255,213', desc: 'Command center summary' },
  { label: 'Infrastructure', view: 'infrastructure', icon: Blocks, accent: '0,255,213', desc: 'VPC & resource topology' },
  { label: 'Servers', view: 'servers', icon: Server, accent: '0,255,157', desc: 'EC2 instances & health' },
  { label: 'Applications', view: 'applications', icon: Rocket, accent: '139,92,246', desc: 'App status & versions' },
  { label: 'Deployments', view: 'deployments', icon: Rocket, accent: '0,255,157', desc: 'CI/CD pipeline history' },
  { label: 'Backups', view: 'backups', icon: HardDrive, accent: '139,92,246', desc: 'S3 backup operations' },
  { label: 'Monitoring', view: 'monitoring', icon: Activity, accent: '255,62,129', desc: 'Live metric charts' },
  { label: 'Logs', view: 'logs', icon: ScrollText, accent: '255,184,0', desc: 'Terminal log stream' },
  { label: 'Settings', view: 'settings', icon: Settings, accent: '139,92,246', desc: 'Platform configuration' },
]

const ABOUT_ITEM: NavItem = {
  label: 'About',
  view: 'about',
  icon: Info,
  accent: '0,255,213',
  desc: 'Platform & founder',
}

export function Sidebar() {
  const { view, setView, sidebarOpen, setSidebarOpen, collapsed, toggleCollapsed } = useNav()
  const reduced = usePrefersReducedMotion()

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'z-50 flex flex-col transition-all duration-300 ease-out',
          'fixed inset-y-0 left-0 w-[16rem] lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed ? 'lg:w-[4.5rem]' : 'lg:w-[16rem]',
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'glass flex h-full flex-col rounded-none p-3 lg:rounded-3xl lg:sticky lg:top-6',
            'max-h-screen lg:max-h-[calc(100vh-3rem)]',
          )}
        >
          {/* Brand header */}
          <div className="mb-3 flex items-center gap-2.5 px-2 pt-2">
            <div className="animated-border glass flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <span className="font-heading text-lg font-black tracking-tight text-neon-teal text-glow-teal">
                K
              </span>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <h2 className="font-heading text-base font-extrabold uppercase leading-none tracking-[0.28em] text-foreground">
                  KONE<span className="text-neon-teal text-glow-teal">XA</span>
                </h2>
                <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  DevOps Operations Platform
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="ml-auto hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground lg:flex"
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>

          <div className="mx-2 mb-2 h-px neon-divider" />

          {/* Nav items */}
          <div className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
            {NAV.map((item) => {
              const Icon = item.icon
              const isActive = view === item.view
              return (
                <NavButton
                  key={item.view}
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                  reduced={reduced}
                  onClick={() => setView(item.view)}
                />
              )
            })}

            <div className="mx-3 my-2 h-px neon-divider" />

            <NavButton
              item={ABOUT_ITEM}
              isActive={view === ABOUT_ITEM.view}
              collapsed={collapsed}
              reduced={reduced}
              onClick={() => setView(ABOUT_ITEM.view)}
            />
          </div>

          {/* Founder footer */}
          {!collapsed && (
            <div className="mt-2 rounded-2xl border border-border bg-white/[0.02] px-3 py-2.5">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
                Founded by
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">
                Essakimuthu Konar
              </p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">
                Founder &amp; Creator of Konexa
              </p>
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}

function NavButton({
  item,
  isActive,
  collapsed,
  reduced,
  onClick,
}: {
  item: NavItem
  isActive: boolean
  collapsed: boolean
  reduced: boolean
  onClick: () => void
}) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
      className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-300"
      style={{ ['--nav' as string]: item.accent } as React.CSSProperties}
    >
      <span
        className={cn(
          'absolute inset-0 rounded-xl border transition-all duration-300',
          isActive
            ? 'border-[rgba(var(--nav),0.35)] bg-[rgba(var(--nav),0.10)]'
            : 'border-transparent bg-transparent group-hover:border-[rgba(var(--nav),0.2)] group-hover:bg-[rgba(var(--nav),0.06)]',
        )}
      />
      {isActive && !reduced && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[rgb(var(--nav))] shadow-[0_0_12px_rgb(var(--nav))]" />
      )}
      <Icon
        className={cn(
          'relative z-10 h-[18px] w-[18px] shrink-0 transition-all duration-300',
          isActive
            ? 'text-[rgb(var(--nav))] drop-shadow-[0_0_8px_rgb(var(--nav))]'
            : 'text-muted-foreground group-hover:text-[rgb(var(--nav))] group-hover:drop-shadow-[0_0_6px_rgb(var(--nav))]',
        )}
      />
      {!collapsed && (
        <span
          className={cn(
            'relative z-10 flex-1 text-sm font-medium transition-colors duration-300',
            isActive
              ? 'text-foreground'
              : 'text-muted-foreground group-hover:text-foreground',
          )}
        >
          {item.label}
        </span>
      )}
      {!collapsed && isActive && (
        <ChevronRight className="relative z-10 h-3.5 w-3.5 text-[rgb(var(--nav))]" />
      )}
      {collapsed && (
        <span className="sr-only">{item.label}</span>
      )}
    </button>
  )
}
