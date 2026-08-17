'use client'

import { useMemo, useState } from 'react'
import { ScrollText, Search, RefreshCw, ChevronDown } from 'lucide-react'
import { useQuery } from '@/hooks/use-query'
import { dataService } from '@/lib/api'
import type { LogEntry, Severity } from '@/lib/types'
import { PageShell, Panel, PanelHeading, SkeletonPanel } from '../page-shell'
import { SeverityTag } from '../status-badge'
import { cn } from '@/lib/utils'

const SEVERITIES: (Severity | 'ALL')[] = ['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ERROR']
const SERVICES = ['ALL', 'Healthcheck', 'Backup', 'S3', 'CPU', 'Application', 'Deploy', 'CI/CD', 'Cron', 'Infra', 'Cache', 'Security']

export function LogsView() {
  const { data: logs, status } = useQuery<LogEntry[]>(() => dataService.getLogs())
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState<Severity | 'ALL'>('ALL')
  const [service, setService] = useState<string>('ALL')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return (logs ?? []).filter((l) => {
      const matchesQuery =
        l.message.toLowerCase().includes(query.toLowerCase()) ||
        l.service.toLowerCase().includes(query.toLowerCase())
      const matchesSev = severity === 'ALL' || l.severity === severity
      const matchesSvc = service === 'ALL' || l.service === service
      return matchesQuery && matchesSev && matchesSvc
    })
  }, [logs, query, severity, service])

  if (status === 'loading' && !logs) {
    return (
      <PageShell title="Logs" subtitle="Loading log stream...">
        <SkeletonPanel />
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Logs"
      subtitle="DevOps terminal log viewer — search, filter by severity and service, expand entries for detail."
      actions={
        <button
          type="button"
          className="glass glass-hover flex h-11 items-center gap-2 rounded-2xl px-4 text-sm text-muted-foreground"
          aria-label="Refresh logs"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      }
    >
      <Panel className="!p-0">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="glass flex h-10 flex-1 items-center gap-2 rounded-xl px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search logs..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                aria-label="Search logs"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Severity</span>
              <div className="flex gap-1">
                {SEVERITIES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={cn(
                      'rounded-lg border px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors',
                      severity === s
                        ? 'border-neon-teal/40 bg-neon-teal/10 text-neon-teal'
                        : 'border-border text-muted-foreground hover:bg-white/5',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Service</span>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="rounded-lg border border-border bg-popover px-2 py-1 font-mono text-[10px] text-foreground outline-none"
                aria-label="Filter by service"
              >
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 font-mono">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No log entries match your filters.
            </p>
          ) : (
            filtered.map((log) => {
              const isExpanded = expanded === log.id
              return (
                <div key={log.id} className="mb-1">
                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : log.id)}
                    className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground/70">[{log.timestamp}]</span>
                    <SeverityTag severity={log.severity} />
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">{log.service}</span>
                    <span className="flex-1 text-xs text-foreground">{log.message}</span>
                    {log.detail && (
                      <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform', isExpanded && 'rotate-180')} />
                    )}
                  </button>
                  {isExpanded && log.detail && (
                    <div className="ml-[88px] rounded-lg border border-border bg-white/[0.02] px-3 py-2 text-xs text-muted-foreground">
                      {log.detail}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        <div className="border-t border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
          {filtered.length} entries · Ready to consume logs/health_check.log &amp; logs/backup.log
        </div>
      </Panel>
    </PageShell>
  )
}
