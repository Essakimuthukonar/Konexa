'use client'

import { useState } from 'react'
import { Cpu, MemoryStick, HardDrive, Network, Gauge, ShieldCheck } from 'lucide-react'
import { useQuery } from '@/hooks/use-query'
import { dataService } from '@/lib/api'
import { PageShell, Panel, PanelHeading, SkeletonPanel } from '../page-shell'
import { LineChart } from '../line-chart'

const RANGES = ['1H', '6H', '24H', '7D'] as const

const METRICS = [
  { key: 'cpu', label: 'CPU', color: '#00ffd5', unit: '%', icon: Cpu, max: 100, min: 0 },
  { key: 'memory', label: 'Memory', color: '#8b5cf6', unit: '%', icon: MemoryStick, max: 100, min: 0 },
  { key: 'disk', label: 'Disk', color: '#00ff9d', unit: '%', icon: HardDrive, max: 100, min: 0 },
  { key: 'network', label: 'Network', color: '#ffb800', unit: ' Gbps', icon: Network, max: undefined, min: 0 },
  { key: 'uptime', label: 'Uptime', color: '#00ffd5', unit: '%', icon: Gauge, max: 100, min: 98 },
] as const

export function MonitoringView() {
  const [range, setRange] = useState<(typeof RANGES)[number]>('24H')
  const { data: series } = useQuery<Record<string, number[]>>(
    () => dataService.getMonitoringSeries(range),
    [range],
  )

  const labels = range === '1H'
    ? ['-60m', '-45m', '-30m', '-15m', 'now']
    : range === '6H'
      ? ['-6h', '-4h', '-2h', 'now']
      : range === '24H'
        ? ['-24h', '-18h', '-12h', '-6h', 'now']
        : ['-7d', '-5d', '-3d', '-1d', 'now']

  if (!series) {
    return (
      <PageShell title="Monitoring" subtitle="Loading metrics...">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <SkeletonPanel />
          <SkeletonPanel />
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Monitoring"
      subtitle="Time-series metrics across CPU, memory, disk, network and uptime. Demo data — ready for future real integrations."
      actions={
        <div className="flex gap-1.5 rounded-2xl border border-border bg-white/[0.02] p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-xl px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                range === r
                  ? 'bg-neon-teal/15 text-neon-teal'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      }
    >
      <Panel>
        <PanelHeading title="System Health" tag="Overview" color="#00ff9d" icon={ShieldCheck} />
        <div className="flex flex-wrap gap-4">
          {[
            { l: 'CPU Avg', v: `${Math.round(series.cpu.reduce((a, b) => a + b, 0) / series.cpu.length)}%`, c: '#00ffd5' },
            { l: 'Memory Avg', v: `${Math.round(series.memory.reduce((a, b) => a + b, 0) / series.memory.length)}%`, c: '#8b5cf6' },
            { l: 'Disk', v: `${series.disk[series.disk.length - 1]}%`, c: '#00ff9d' },
            { l: 'Network Peak', v: `${Math.max(...series.network)} Gbps`, c: '#ffb800' },
            { l: 'Uptime', v: `${series.uptime[series.uptime.length - 1]}%`, c: '#00ffd5' },
          ].map((s) => (
            <div key={s.l} className="flex-1 rounded-xl border border-border bg-white/[0.02] px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
              <p className="mt-1 font-heading text-xl font-bold tabular-nums" style={{ color: s.c }}>{s.v}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {METRICS.map((m) => {
          const Icon = m.icon
          return (
            <Panel key={m.key}>
              <PanelHeading title={m.label} tag={range} color={m.color} icon={Icon} />
              <LineChart
                data={series[m.key]}
                color={m.color}
                height={180}
                unit={m.unit}
                max={m.max}
                min={m.min}
                labels={labels}
              />
            </Panel>
          )
        })}
      </div>
    </PageShell>
  )
}
