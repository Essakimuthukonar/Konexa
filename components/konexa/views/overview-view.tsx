'use client'

import {
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Gauge,
  Rocket,
  GitBranch,
  Activity,
  Server,
  ShieldCheck,
  Radio,
} from 'lucide-react'
import { useQuery } from '@/hooks/use-query'
import { dataService } from '@/lib/api'
import type { CoreLink, MetricCard, SystemHealth } from '@/lib/types'
import { KonexaCore } from '../konexa-core'
import { MetricCardTile } from '../metric-card-tile'
import { MetricRing } from '../metric-ring'
import { StatusBadge } from '../status-badge'
import { Panel, PanelHeading, SkeletonPanel } from '../page-shell'

const METRIC_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  cpu: Cpu,
  memory: MemoryStick,
  disk: HardDrive,
  network: Network,
  uptime: Gauge,
  backup: HardDrive,
  app: Rocket,
  deploy: GitBranch,
}

export function OverviewView() {
  const { data: health } = useQuery<SystemHealth>(() => dataService.getSystemHealth())
  const { data: links } = useQuery<CoreLink[]>(() => dataService.getCoreLinks())
  const { data: metrics } = useQuery<MetricCard[]>(() => dataService.getMetricCards())

  if (!health || !links || !metrics) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonPanel key={i} />)}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="animate-rise grid grid-cols-1 gap-5 lg:grid-cols-5" style={{ animationDelay: '80ms' }}>
        <HeroPanel health={health} />
        <CorePanel links={links} />
      </section>

      <section className="animate-rise grid grid-cols-1 gap-5 md:grid-cols-3" style={{ animationDelay: '160ms' }}>
        <Panel span="md:col-span-1">
          <PanelHeading title="System Health" tag="Live" color="#00ffd5" icon={Gauge} />
          <div className="flex flex-col items-center py-2">
            <div className="animate-pulse-ring">
              <MetricRing
                value={health.healthIndex}
                size={170}
                stroke={12}
                color="#00ffd5"
                label="Health Index"
                display={String(health.healthIndex)}
                sublabel="All services nominal"
              />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {health.lastIncident}
            </p>
          </div>
        </Panel>

        <Panel span="md:col-span-2">
          <PanelHeading title="System Status" tag="Command Center" color="#00ff9d" icon={ShieldCheck} />
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neon-green/20 bg-neon-green/5 px-5 py-4">
              <StatusBadge state={health.state} pulse />
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
                <Detail label="Environment" value={health.environment} />
                <Detail label="Version" value={health.version} />
                <Detail label="Uptime" value={`${health.uptimePercent}%`} accent="text-neon-teal" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { l: 'API', v: 'OK', c: '#00ff9d' },
                { l: 'DB', v: 'OK', c: '#00ff9d' },
                { l: 'Cache', v: 'WARN', c: '#ffb800' },
                { l: 'Web', v: 'OK', c: '#00ff9d' },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-border bg-white/[0.02] px-3 py-2.5 text-center">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
                  <p className="mt-0.5 text-xs font-bold" style={{ color: s.c }}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m, i) => (
          <div key={m.id} className="animate-rise" style={{ animationDelay: `${200 + i * 60}ms` }}>
            <MetricCardTile metric={m} icon={METRIC_ICONS[m.id] ?? Activity} />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel span="lg:col-span-2">
          <PanelHeading title="Infrastructure" tag="248 nodes" color="#00ffd5" icon={Server} />
          <div className="space-y-4">
            {[
              { name: 'us-east-1', nodes: 92, load: 68, color: '#00ffd5' },
              { name: 'eu-west-2', nodes: 74, load: 54, color: '#8b5cf6' },
              { name: 'ap-south-1', nodes: 51, load: 81, color: '#ffb800' },
              { name: 'sa-east-1', nodes: 31, load: 39, color: '#00ff9d' },
            ].map((r) => (
              <div key={r.name}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{r.name}</span>
                  <span className="font-mono text-muted-foreground">{r.nodes} nodes · {r.load}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${r.load}%`, background: r.color, boxShadow: `0 0 10px ${r.color}` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeading title="Recent Activity" tag="Timeline" color="#8b5cf6" icon={Radio} />
          <ol className="relative space-y-4 pl-2">
            <span className="absolute left-[11px] top-1 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-neon-teal/40 via-neon-purple/30 to-transparent" />
            {[
              { t: '09:42', title: 'Deploy succeeded', desc: 'Frontend v1.0.0 → 92 nodes', color: '#00ff9d' },
              { t: '09:31', title: 'Autoscale triggered', desc: 'ap-south-1 scaled 44→51', color: '#00ffd5' },
              { t: '09:18', title: 'Cache warning cleared', desc: 'Redis memory resolved', color: '#ffb800' },
              { t: '08:57', title: 'Security scan complete', desc: '0 critical · 2 medium', color: '#8b5cf6' },
            ].map((e) => (
              <li key={e.t} className="relative flex items-start gap-3">
                <span
                  className="relative z-10 mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border-2"
                  style={{ borderColor: `${e.color}55`, background: e.color, boxShadow: `0 0 8px ${e.color}` }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{e.title}</p>
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{e.t}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </section>
    </div>
  )
}

function Detail({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${accent ?? 'text-foreground'}`}>{value}</span>
    </div>
  )
}

function HeroPanel({ health }: { health: SystemHealth }) {
  return (
    <div className="glass relative overflow-hidden rounded-3xl px-6 py-8 sm:px-10 sm:py-10 lg:col-span-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-neon-teal/30 bg-neon-teal/5 px-3 py-1">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-teal opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-teal" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-teal">
          All Systems Operational
        </span>
      </div>

      <h2 className="mt-5 max-w-3xl text-balance font-heading text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
        One Platform.
        <br />
        <span
          className="bg-gradient-to-r from-neon-teal via-neon-green to-neon-teal bg-clip-text text-transparent"
          style={{ backgroundSize: '200% auto', animation: 'gradient-shift 6s ease infinite' }}
        >
          Complete DevOps Visibility.
        </span>
      </h2>

      <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
        Monitor infrastructure. Automate operations. Control cloud resources.
        Simplify DevOps from a single cinematic command center.
      </p>

      <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
        {[
          { l: 'Uptime', v: `${health.uptimePercent}%`, a: 'text-neon-green' },
          { l: 'Active Nodes', v: '248', a: 'text-neon-teal' },
          { l: 'Deploys / 24h', v: '1,204', a: 'text-neon-orange' },
          { l: 'Incidents', v: '0', a: 'text-neon-pink' },
        ].map((s) => (
          <div key={s.l} className="bg-popover/60 px-4 py-3.5 backdrop-blur">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
            <p className={`mt-1 font-heading text-xl font-bold tabular-nums ${s.a}`}>{s.v}</p>
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(0,255,213,0.25), transparent 70%)' }}
      />
    </div>
  )
}

function CorePanel({ links }: { links: CoreLink[] }) {
  return (
    <div className="glass relative flex flex-col items-center justify-center overflow-hidden rounded-3xl px-6 py-8 lg:col-span-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Platform Core
      </p>
      <KonexaCore links={links} />
      <p className="mt-2 max-w-xs text-center text-xs text-muted-foreground">
        Click any node to navigate. The core connects compute, storage, CI/CD, monitoring and logs.
      </p>
    </div>
  )
}
