'use client'

import { useMemo, useState } from 'react'
import { Server, Search, X, Cpu, MemoryStick, HardDrive, Clock } from 'lucide-react'
import { useQuery } from '@/hooks/use-query'
import { dataService } from '@/lib/api'
import type { Server as ServerType } from '@/lib/types'
import { PageShell, Panel, PanelHeading, SkeletonPanel } from '../page-shell'
import { StatusBadge } from '../status-badge'

const STATUS_FILTERS = ['ALL', 'ONLINE', 'MAINTENANCE', 'OFFLINE'] as const

export function ServersView() {
  const { data: servers } = useQuery<ServerType[]>(() => dataService.getServers())
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('ALL')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return (servers ?? []).filter((s) => {
      const matchesQuery =
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.privateIp.includes(query) ||
        s.publicIp.includes(query) ||
        s.region.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'ALL' || s.status === filter
      return matchesQuery && matchesFilter
    })
  }, [servers, query, filter])

  const selectedServer = selected ? servers?.find((s) => s.id === selected) ?? null : null

  if (!servers) {
    return (
      <PageShell title="Servers" subtitle="Loading instances...">
        <SkeletonPanel />
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Servers"
      subtitle="EC2 instances across regions — search, filter by status, and inspect live resource metrics."
      actions={
        <div className="glass flex h-11 items-center gap-2 rounded-2xl px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, IP, region..."
            className="w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60 sm:w-52"
            aria-label="Search servers"
          />
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-xl border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              filter === f
                ? 'border-neon-teal/40 bg-neon-teal/10 text-neon-teal'
                : 'border-border text-muted-foreground hover:bg-white/5 hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="glass overflow-hidden rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Server</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Private IP</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">CPU</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">Mem</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Uptime</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No servers match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => setSelected(s.id)}
                        className="cursor-pointer border-b border-border/50 transition-colors hover:bg-white/[0.03] last:border-0"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neon-teal/30 bg-neon-teal/5">
                              <Server className="h-4 w-4 text-neon-teal" />
                            </span>
                            <div>
                              <p className="font-medium text-foreground">{s.name}</p>
                              <p className="font-mono text-[10px] text-muted-foreground">{s.instanceType} · {s.region}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge
                            state={s.status === 'ONLINE' ? 'OPERATIONAL' : s.status === 'MAINTENANCE' ? 'DEGRADED' : 'DOWN'}
                            label={s.status}
                          />
                        </td>
                        <td className="hidden px-4 py-3.5 font-mono text-xs text-muted-foreground sm:table-cell">{s.privateIp}</td>
                        <td className="hidden px-4 py-3.5 md:table-cell"><UsageBar value={s.cpu} color="#00ffd5" /></td>
                        <td className="hidden px-4 py-3.5 md:table-cell"><UsageBar value={s.memory} color="#8b5cf6" /></td>
                        <td className="hidden px-4 py-3.5 font-mono text-xs text-muted-foreground lg:table-cell">
                          {s.uptimeDays > 0 ? `${s.uptimeDays}d` : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          {selectedServer ? (
            <Panel>
              <div className="mb-4 flex items-start justify-between">
                <PanelHeading title={selectedServer.name} tag={selectedServer.instanceType} color="#00ffd5" icon={Server} />
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close details"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <StatusBadge
                  state={selectedServer.status === 'ONLINE' ? 'OPERATIONAL' : selectedServer.status === 'MAINTENANCE' ? 'DEGRADED' : 'DOWN'}
                  label={selectedServer.status}
                />
                <dl className="space-y-2.5">
                  <DetailRow label="Public IP" value={selectedServer.publicIp} mono />
                  <DetailRow label="Private IP" value={selectedServer.privateIp} mono />
                  <DetailRow label="OS" value={selectedServer.os} />
                  <DetailRow label="Region" value={selectedServer.region} />
                  <DetailRow label="Uptime" value={`${selectedServer.uptimeDays} days`} />
                  <DetailRow label="Last Check" value={selectedServer.lastCheck} />
                </dl>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <MiniMetric icon={Cpu} label="CPU" value={`${selectedServer.cpu}%`} color="#00ffd5" />
                  <MiniMetric icon={MemoryStick} label="Mem" value={`${selectedServer.memory}%`} color="#8b5cf6" />
                  <MiniMetric icon={HardDrive} label="Disk" value={`${selectedServer.disk}%`} color="#00ff9d" />
                </div>
                <div className="rounded-xl border border-border bg-white/[0.02] px-3 py-2.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Checked {selectedServer.lastCheck}
                  </div>
                </div>
              </div>
            </Panel>
          ) : (
            <Panel>
              <PanelHeading title="Server Details" tag="Select" color="#8b5cf6" />
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <Server className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Select a server from the list to inspect details.
                </p>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </PageShell>
  )
}

function UsageBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color, boxShadow: `0 0 6px ${color}` }} />
      </div>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">{value}%</span>
    </div>
  )
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className={mono ? 'font-mono text-sm text-foreground' : 'text-sm text-foreground'}>{value}</dd>
    </div>
  )
}

function MiniMetric({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-white/[0.02] px-2 py-2.5 text-center">
      <Icon className="mx-auto h-4 w-4" style={{ color }} />
      <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-bold" style={{ color }}>{value}</p>
    </div>
  )
}
