'use client'

import {
  Cpu,
  MemoryStick,
  Gauge,
  Radio,
  Server,
  Database,
  Network,
  ShieldCheck,
  HardDrive,
  TrendingUp,
  CircleDot,
  GitBranch,
  CloudCog,
  type LucideIcon,
} from 'lucide-react'
import { TiltCard } from './tilt-card'
import { MetricRing } from './metric-ring'
import { SparkArea } from './spark-area'

const TEAL = '#00ffd5'
const PURPLE = '#8b5cf6'
const PINK = '#ff3e81'
const ORANGE = '#ffb800'
const GREEN = '#00ff9d'

function PanelHeading({
  icon: Icon,
  title,
  tag,
  color,
}: {
  icon: LucideIcon
  title: string
  tag?: string
  color: string
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: `${color}1a`,
            border: `1px solid ${color}40`,
          }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </span>
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

const panelBase =
  'glass glass-hover h-full rounded-3xl p-6 [transform-style:preserve-3d]'

/* ---------- System Health Ring ---------- */
function SystemHealthPanel() {
  return (
    <TiltCard className="animate-rise xl:col-span-2 xl:row-span-2" style={{ animationDelay: '240ms' }}>
      <div className={`${panelBase} flex flex-col`}>
        <PanelHeading icon={Gauge} title="System Health" tag="Live" color={TEAL} />
        <div className="flex flex-1 flex-col items-center justify-center py-2">
          <div className="animate-pulse-ring">
            <MetricRing
              value={96}
              size={180}
              stroke={12}
              color={TEAL}
              label="Overall"
              display="96"
              sublabel="Health Index"
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            All core services nominal. No degradation detected across the fleet.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { l: 'API', v: 'OK', c: GREEN },
            { l: 'DB', v: 'OK', c: GREEN },
            { l: 'Cache', v: 'WARN', c: ORANGE },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-xl border border-border bg-white/[0.02] px-3 py-2 text-center"
            >
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                {s.l}
              </p>
              <p
                className="mt-0.5 text-xs font-bold"
                style={{ color: s.c }}
              >
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </TiltCard>
  )
}

/* ---------- Resource Vitals (CPU / Memory / Latency / Availability) ---------- */
function VitalsPanel() {
  const vitals = [
    { icon: Cpu, value: 62, color: TEAL, label: 'CPU' },
    { icon: MemoryStick, value: 74, color: PURPLE, label: 'Memory' },
    { icon: Radio, value: 28, color: PINK, label: 'Latency', display: '28ms' },
    { icon: CircleDot, value: 99, color: GREEN, label: 'Uptime', display: '99.9%' },
  ]
  return (
    <TiltCard className="animate-rise xl:col-span-2" style={{ animationDelay: '300ms' }}>
      <div className={panelBase}>
        <PanelHeading icon={TrendingUp} title="Resource Vitals" tag="60s" color={PURPLE} />
        <div className="grid grid-cols-2 gap-4">
          {vitals.map((v) => (
            <div
              key={v.label}
              className="flex flex-col items-center rounded-2xl border border-border bg-white/[0.02] p-3"
            >
              <MetricRing
                value={v.value}
                size={104}
                stroke={7}
                color={v.color}
                label={v.label}
                display={v.display}
              />
            </div>
          ))}
        </div>
      </div>
    </TiltCard>
  )
}

/* ---------- Infrastructure Overview ---------- */
function InfrastructurePanel() {
  const regions = [
    { name: 'us-east-1', nodes: 92, load: 68, color: TEAL },
    { name: 'eu-west-2', nodes: 74, load: 54, color: PURPLE },
    { name: 'ap-south-1', nodes: 51, load: 81, color: ORANGE },
    { name: 'sa-east-1', nodes: 31, load: 39, color: GREEN },
  ]
  return (
    <TiltCard className="animate-rise xl:col-span-2" style={{ animationDelay: '360ms' }}>
      <div className={panelBase}>
        <PanelHeading icon={Server} title="Infrastructure" tag="248 nodes" color={TEAL} />
        <div className="space-y-4">
          {regions.map((r) => (
            <div key={r.name}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{r.name}</span>
                <span className="font-mono text-muted-foreground">
                  {r.nodes} nodes · {r.load}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${r.load}%`,
                    background: r.color,
                    boxShadow: `0 0 10px ${r.color}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </TiltCard>
  )
}

/* ---------- Performance ---------- */
function PerformancePanel() {
  const data = [30, 42, 38, 55, 48, 62, 58, 71, 66, 80, 74, 88, 82, 95]
  return (
    <TiltCard className="animate-rise xl:col-span-4" style={{ animationDelay: '420ms' }}>
      <div className={panelBase}>
        <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
          <PanelHeading icon={TrendingUp} title="Performance" tag="Throughput" color={GREEN} />
          <div className="flex gap-6">
            <div>
              <p className="font-heading text-2xl font-bold text-neon-green">
                12.4k
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                req / sec
              </p>
            </div>
            <div>
              <p className="font-heading text-2xl font-bold text-neon-teal">
                42ms
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                p95 latency
              </p>
            </div>
          </div>
        </div>
        <SparkArea data={data} color={GREEN} height={150} />
      </div>
    </TiltCard>
  )
}

/* ---------- Cloud Resources (donut) ---------- */
function CloudResourcesPanel() {
  const segments = [
    { label: 'Compute', value: 44, color: TEAL },
    { label: 'Storage', value: 26, color: PURPLE },
    { label: 'Network', value: 18, color: ORANGE },
    { label: 'Other', value: 12, color: PINK },
  ]
  const radius = 54
  const circ = 2 * Math.PI * radius
  let acc = 0
  return (
    <TiltCard className="animate-rise xl:col-span-2" style={{ animationDelay: '480ms' }}>
      <div className={panelBase}>
        <PanelHeading icon={CloudCog} title="Cloud Resources" tag="Spend" color={ORANGE} />
        <div className="flex items-center gap-5">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90 shrink-0">
            {segments.map((s) => {
              const len = (s.value / 100) * circ
              const el = (
                <circle
                  key={s.label}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="14"
                  strokeDasharray={`${len} ${circ - len}`}
                  strokeDashoffset={-acc}
                  style={{ filter: `drop-shadow(0 0 4px ${s.color})` }}
                />
              )
              acc += len
              return el
            })}
          </svg>
          <ul className="flex-1 space-y-2.5">
            {segments.map((s) => (
              <li key={s.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
                  />
                  {s.label}
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {s.value}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TiltCard>
  )
}

/* ---------- Storage ---------- */
function StoragePanel() {
  const volumes = [
    { name: 'Primary SSD', used: 68, color: TEAL },
    { name: 'Object Store', used: 41, color: PURPLE },
    { name: 'Archive', used: 87, color: PINK },
  ]
  return (
    <TiltCard className="animate-rise xl:col-span-2" style={{ animationDelay: '540ms' }}>
      <div className={panelBase}>
        <PanelHeading icon={HardDrive} title="Storage" tag="4.2 PB" color={PINK} />
        <div className="space-y-5 pt-1">
          {volumes.map((v) => (
            <div key={v.name}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{v.name}</span>
                <span className="font-mono text-muted-foreground">{v.used}%</span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${v.used}%`,
                    background: `linear-gradient(90deg, ${v.color}80, ${v.color})`,
                    boxShadow: `0 0 10px ${v.color}`,
                  }}
                />
              </div>
            </div>
          ))}
          <p className="pt-1 text-xs text-muted-foreground">
            2.9 PB used of 4.2 PB provisioned across all tiers.
          </p>
        </div>
      </div>
    </TiltCard>
  )
}

/* ---------- Network ---------- */
function NetworkPanel() {
  const inData = [20, 35, 28, 44, 40, 55, 48, 60, 52, 68]
  return (
    <TiltCard className="animate-rise xl:col-span-2" style={{ animationDelay: '600ms' }}>
      <div className={panelBase}>
        <PanelHeading icon={Network} title="Network" tag="Ingress" color={TEAL} />
        <div className="mb-3 flex items-baseline gap-2">
          <span className="font-heading text-3xl font-bold text-neon-teal">
            8.6
          </span>
          <span className="text-sm text-muted-foreground">Gbps peak</span>
        </div>
        <SparkArea data={inData} color={TEAL} height={90} />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-white/[0.02] px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Inbound
            </p>
            <p className="text-sm font-bold text-neon-green">↓ 5.2 Gbps</p>
          </div>
          <div className="rounded-xl border border-border bg-white/[0.02] px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Outbound
            </p>
            <p className="text-sm font-bold text-neon-orange">↑ 3.4 Gbps</p>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

/* ---------- Security ---------- */
function SecurityPanel() {
  const items = [
    { l: 'Firewall Rules', v: 'Enforced', c: GREEN },
    { l: 'Cert Rotation', v: '3 days', c: TEAL },
    { l: 'Open Ports', v: '2 flagged', c: ORANGE },
    { l: 'Threats Blocked', v: '1,842', c: PINK },
  ]
  return (
    <TiltCard className="animate-rise xl:col-span-2" style={{ animationDelay: '660ms' }}>
      <div className={panelBase}>
        <PanelHeading icon={ShieldCheck} title="Security" tag="Protected" color={GREEN} />
        <div className="flex items-center gap-3 rounded-2xl border border-neon-green/25 bg-neon-green/5 px-4 py-3">
          <ShieldCheck className="h-8 w-8 text-neon-green drop-shadow-[0_0_8px_#00ff9d]" />
          <div>
            <p className="text-sm font-semibold text-foreground">Secure Posture</p>
            <p className="text-xs text-muted-foreground">Compliance score 94/100</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2.5">
          {items.map((it) => (
            <li
              key={it.l}
              className="flex items-center justify-between border-b border-border/60 pb-2 text-xs last:border-0"
            >
              <span className="text-muted-foreground">{it.l}</span>
              <span className="font-mono font-semibold" style={{ color: it.c }}>
                {it.v}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </TiltCard>
  )
}

/* ---------- Operation Timeline ---------- */
function TimelinePanel() {
  const events = [
    { t: '09:42', title: 'Deploy succeeded', desc: 'api-gateway → v4.12.0 rolled to 92 nodes', icon: GitBranch, color: GREEN },
    { t: '09:31', title: 'Autoscale triggered', desc: 'ap-south-1 scaled 44 → 51 nodes on CPU threshold', icon: Server, color: TEAL },
    { t: '09:18', title: 'Cache warning cleared', desc: 'Redis cluster memory pressure resolved', icon: Database, color: ORANGE },
    { t: '08:57', title: 'Security scan complete', desc: '0 critical, 2 medium findings triaged', icon: ShieldCheck, color: PURPLE },
  ]
  return (
    <TiltCard className="animate-rise xl:col-span-4" style={{ animationDelay: '720ms' }}>
      <div className={panelBase}>
        <PanelHeading icon={Radio} title="Operation Timeline" tag="Recent Activity" color={PURPLE} />
        <ol className="relative space-y-5 pl-2">
          <span className="absolute left-[15px] top-1 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-neon-teal/40 via-neon-purple/30 to-transparent" />
          {events.map((e) => {
            const Icon = e.icon
            return (
              <li key={e.t} className="relative flex items-start gap-4">
                <span
                  className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background"
                  style={{ borderColor: `${e.color}55` }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: e.color }} />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {e.title}
                    </p>
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                      {e.t}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.desc}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </TiltCard>
  )
}

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6 xl:auto-rows-min">
      <SystemHealthPanel />
      <VitalsPanel />
      <InfrastructurePanel />
      <PerformancePanel />
      <CloudResourcesPanel />
      <StoragePanel />
      <NetworkPanel />
      <SecurityPanel />
      <TimelinePanel />
    </div>
  )
}
