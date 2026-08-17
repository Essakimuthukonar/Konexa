'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function PageShell({
  title,
  subtitle,
  children,
  actions,
  className,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-[0.2em] text-foreground sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}

export function Panel({
  children,
  className,
  span,
  style,
}: {
  children: ReactNode
  className?: string
  span?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={cn(span)} style={style}>
      <div className={cn('glass glass-hover h-full rounded-3xl p-6', className)}>
        {children}
      </div>
    </div>
  )
}

export function PanelHeading({
  title,
  tag,
  color = '#00ffd5',
  icon: Icon,
}: {
  title: string
  tag?: string
  color?: string
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: `${color}1a`, border: `1px solid ${color}40` }}
          >
            <Icon className="h-4 w-4" style={{ color }} />
          </span>
        )}
        <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.15em] text-foreground">
          {title}
        </h3>
      </div>
      {tag && (
        <span
          className="rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest"
          style={{ background: `${color}14`, color }}
        >
          {tag}
        </span>
      )}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export function SkeletonPanel({ className }: { className?: string }) {
  return (
    <div className={cn('glass animate-pulse rounded-3xl p-6', className)}>
      <div className="mb-4 h-5 w-32 rounded-lg bg-white/5" />
      <div className="mb-3 h-4 w-full rounded bg-white/[0.03]" />
      <div className="mb-3 h-4 w-3/4 rounded bg-white/[0.03]" />
      <div className="h-24 w-full rounded-2xl bg-white/[0.02]" />
    </div>
  )
}
