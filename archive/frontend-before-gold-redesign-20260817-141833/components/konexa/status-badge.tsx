import { cn } from '@/lib/utils'
import type { HealthState, Severity } from '@/lib/types'

const HEALTH_STYLES: Record<HealthState, { dot: string; text: string; label: string }> = {
  OPERATIONAL: { dot: 'bg-neon-green', text: 'text-neon-green', label: 'OPERATIONAL' },
  DEGRADED: { dot: 'bg-neon-orange', text: 'text-neon-orange', label: 'DEGRADED' },
  DOWN: { dot: 'bg-neon-pink', text: 'text-neon-pink', label: 'DOWN' },
}

const SEVERITY_STYLES: Record<Severity, { text: string; bg: string; border: string }> = {
  INFO: { text: 'text-neon-teal', bg: 'bg-neon-teal/10', border: 'border-neon-teal/30' },
  SUCCESS: { text: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30' },
  WARNING: { text: 'text-neon-orange', bg: 'bg-neon-orange/10', border: 'border-neon-orange/30' },
  ERROR: { text: 'text-neon-pink', bg: 'bg-neon-pink/10', border: 'border-neon-pink/30' },
}

export function StatusBadge({
  state,
  label,
  pulse = true,
  className,
}: {
  state: HealthState
  label?: string
  pulse?: boolean
  className?: string
}) {
  const s = HEALTH_STYLES[state]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]',
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-70',
              s.dot,
            )}
          />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', s.dot)} />
      </span>
      <span className={s.text}>{label ?? s.label}</span>
    </span>
  )
}

export function SeverityTag({ severity }: { severity: Severity }) {
  const s = SEVERITY_STYLES[severity]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider',
        s.text,
        s.bg,
        s.border,
      )}
    >
      {severity}
    </span>
  )
}
