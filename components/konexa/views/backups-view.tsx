'use client'

import { HardDrive, Server, Archive, Cloud, CircleCheck as CheckCircle2, Clock, Calendar } from 'lucide-react'
import { useQuery } from '@/hooks/use-query'
import { dataService } from '@/lib/api'
import type { Backup as BackupType, BackupStatus as BackupStatusType } from '@/lib/types'
import { PageShell, Panel, PanelHeading, SkeletonPanel } from '../page-shell'
import { StatusBadge } from '../status-badge'

const FLOW_STAGES = [
  { label: 'Konexa Server', icon: Server, color: '#00ffd5' },
  { label: 'Backup Engine', icon: HardDrive, color: '#8b5cf6' },
  { label: 'tar.gz Archive', icon: Archive, color: '#00ff9d' },
  { label: 'Amazon S3', icon: Cloud, color: '#ffb800' },
  { label: 'Backup Complete', icon: CheckCircle2, color: '#00ff9d' },
]

export function BackupsView() {
  const { data: status } = useQuery<BackupStatusType>(() => dataService.getBackupStatus())
  const { data: backups } = useQuery<BackupType[]>(() => dataService.getBackups())

  if (!status || !backups) {
    return (
      <PageShell title="Backups" subtitle="Loading backup operations...">
        <SkeletonPanel />
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Backups"
      subtitle="Automated weekly backup workflow — Konexa Server → tar.gz → Amazon S3. Visualizes the existing backup.sh cron pipeline."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel span="lg:col-span-1">
          <PanelHeading title="Backup Status" tag="Cron" color="#ff3e81" icon={HardDrive} />
          <div className="space-y-4">
            <div className="rounded-2xl border border-neon-green/20 bg-neon-green/5 px-4 py-3">
              <StatusBadge state={status.state} />
            </div>
            <dl className="space-y-2.5">
              <Row icon={CheckCircle2} label="Last Successful" value={status.lastSuccessful} />
              <Row icon={Calendar} label="Next Scheduled" value={status.nextScheduled} />
              <Row icon={Archive} label="Last Size" value={status.lastSize} />
              <Row icon={Clock} label="Schedule" value={status.schedule} />
              <Row icon={Cloud} label="Destination" value={status.destination} mono />
              <Row icon={HardDrive} label="Total Backups" value={String(status.totalBackups)} />
            </dl>
          </div>
        </Panel>

        <Panel span="lg:col-span-2">
          <PanelHeading title="Backup Flow" tag="Animated" color="#00ff9d" icon={Cloud} />
          <BackupFlow />
          <div className="mt-4 rounded-xl border border-border bg-white/[0.02] px-4 py-3">
            <p className="text-xs text-muted-foreground">
              This is a visual representation of the existing <span className="font-mono text-neon-teal">backup.sh</span> workflow.
              Backups run weekly via cron and upload to S3 using an IAM role — no access keys stored on the server.
            </p>
          </div>
        </Panel>
      </div>

      <Panel className="mt-5 !p-0">
        <div className="px-6 pt-5">
          <PanelHeading title="Recent Backups" tag={String(backups.length)} color="#8b5cf6" icon={Archive} />
        </div>
        <div className="overflow-x-auto px-2 pb-2">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3 font-medium">File</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Size</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Date</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Duration</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => {
                const color = b.status === 'COMPLETED' ? '#00ff9d' : b.status === 'FAILED' ? '#ff3e81' : b.status === 'RUNNING' ? '#00ffd5' : '#ffb800'
                return (
                  <tr key={b.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-white/[0.03]">
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{b.file}</td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">{b.size}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
                        <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                        {b.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground md:table-cell">{b.date}</td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground lg:table-cell">{b.duration}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageShell>
  )
}

function BackupFlow() {
  return (
    <div className="flex flex-col items-stretch gap-3 py-2 sm:flex-row sm:items-center">
      {FLOW_STAGES.map((stage, i) => {
        const Icon = stage.icon
        return (
          <div key={stage.label} className="flex flex-1 items-center gap-3 sm:flex-col sm:gap-2">
            <div className="flex w-full flex-1 flex-col items-center gap-2 rounded-2xl border bg-white/[0.02] px-3 py-4 sm:flex-none" style={{ borderColor: `${stage.color}40` }}>
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl border"
                style={{ borderColor: `${stage.color}55`, background: `${stage.color}10`, boxShadow: `0 0 16px -6px ${stage.color}` }}
              >
                <Icon className="h-5 w-5" style={{ color: stage.color }} />
              </span>
              <p className="text-center text-xs font-semibold text-foreground">{stage.label}</p>
            </div>
            {i < FLOW_STAGES.length - 1 && (
              <div className="flex items-center justify-center sm:py-1">
                <div className="relative h-px w-full bg-gradient-to-r from-neon-teal/40 to-neon-purple/30 sm:h-6 sm:w-px">
                  <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-teal shadow-[0_0_8px_#00ffd5]">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                  </span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Row({ icon: Icon, label, value, mono }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2.5 last:border-0">
      <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className={`text-right text-xs ${mono ? 'font-mono text-muted-foreground' : 'font-medium text-foreground'}`}>{value}</dd>
    </div>
  )
}
