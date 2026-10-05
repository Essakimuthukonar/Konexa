'use client'

import { Rocket, Globe } from 'lucide-react'
import { useQuery } from '@/hooks/use-query'
import { dataService } from '@/lib/api'
import type { Application } from '@/lib/types'
import { PageShell, Panel, PanelHeading, SkeletonPanel } from '../page-shell'
import { StatusBadge } from '../status-badge'

export function ApplicationsView() {
  const { data: apps } = useQuery<Application[]>(() => dataService.getApplications())

  if (!apps) {
    return (
      <PageShell title="Applications" subtitle="Loading...">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <SkeletonPanel />
          <SkeletonPanel />
        </div>
      </PageShell>
    )
  }

  const running = apps.filter((a) => a.status === 'RUNNING').length

  return (
    <PageShell
      title="Applications"
      subtitle="Deployed services across environments — status, framework versions and uptime."
    >
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total Apps" value={String(apps.length)} color="#00ffd5" />
        <StatTile label="Running" value={String(running)} color="#00ff9d" />
        <StatTile label="Stopped" value={String(apps.filter((a) => a.status === 'STOPPED').length)} color="#ff3e81" />
        <StatTile label="Avg Uptime" value="99.9%" color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {apps.map((app) => (
          <Panel key={app.id}>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl border"
                  style={{
                    borderColor: app.status === 'RUNNING' ? '#00ff9d40' : app.status === 'STOPPED' ? '#ff3e8140' : '#ffb80040',
                    background: app.status === 'RUNNING' ? '#00ff9d10' : app.status === 'STOPPED' ? '#ff3e8110' : '#ffb80010',
                  }}
                >
                  <Rocket className="h-5 w-5" style={{ color: app.status === 'RUNNING' ? '#00ff9d' : app.status === 'STOPPED' ? '#ff3e81' : '#ffb800' }} />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{app.name}</h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{app.framework}</p>
                </div>
              </div>
              <StatusBadge
                state={app.status === 'RUNNING' ? 'OPERATIONAL' : app.status === 'STOPPED' ? 'DOWN' : 'DEGRADED'}
                label={app.status}
              />
            </div>

            <dl className="space-y-2.5">
              <Row label="Version" value={app.version} />
              <Row label="Environment" value={app.environment} />
              <Row label="Uptime" value={`${app.uptimePercent}%`} accent="text-neon-teal" />
              <Row label="Last Deployment" value={app.lastDeployment} />
            </dl>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-white/[0.02] px-3 py-2.5">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">{app.url}</span>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  )
}

function StatTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-2xl px-4 py-3.5">
      <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold tabular-nums" style={{ color }}>{value}</p>
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className={`text-sm font-medium ${accent ?? 'text-foreground'}`}>{value}</dd>
    </div>
  )
}
