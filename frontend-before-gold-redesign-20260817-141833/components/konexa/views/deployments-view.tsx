'use client'

import { useState } from 'react'
import { GitBranch, GitFork as Github, Hammer, FlaskConical, Rocket, Server, CircleCheck as CheckCircle2, Circle as XCircle, Loader as Loader2, Clock, X } from 'lucide-react'
import { useQuery } from '@/hooks/use-query'
import { dataService } from '@/lib/api'
import type { Deployment, DeploymentStatus } from '@/lib/types'
import { PageShell, Panel, PanelHeading, SkeletonPanel } from '../page-shell'
import { StatusBadge } from '../status-badge'

const STAGE_ICONS = [Github, Hammer, FlaskConical, Rocket, Server]

const STATUS_CONFIG: Record<DeploymentStatus, { color: string; icon: React.ComponentType<{ className?: string }> }> = {
  SUCCESS: { color: '#00ff9d', icon: CheckCircle2 },
  RUNNING: { color: '#00ffd5', icon: Loader2 },
  FAILED: { color: '#ff3e81', icon: XCircle },
  QUEUED: { color: '#ffb800', icon: Clock },
}

export function DeploymentsView() {
  const { data: deployments } = useQuery<Deployment[]>(() => dataService.getDeployments())
  const [selected, setSelected] = useState<string | null>(null)

  if (!deployments) {
    return (
      <PageShell title="Deployments" subtitle="Loading CI/CD history...">
        <SkeletonPanel />
      </PageShell>
    )
  }

  const selectedDeploy = selected ? deployments.find((d) => d.id === selected) ?? null : null

  return (
    <PageShell
      title="Deployments"
      subtitle="CI/CD pipeline visualization — from GitHub source through build, test and deploy to production."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Panel>
            <PanelHeading title="Pipeline Flow" tag="CI/CD" color="#00ff9d" icon={GitBranch} />
            <PipelineFlow stages={selectedDeploy?.stages ?? deployments[0]?.stages ?? []} />
          </Panel>

          <Panel className="!p-0">
            <div className="flex items-center justify-between px-6 pt-5">
              <PanelHeading title="Deployment History" tag={String(deployments.length)} color="#8b5cf6" />
            </div>
            <div className="overflow-x-auto px-2 pb-2">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Application</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Version</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">Env</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {deployments.map((d) => {
                    const cfg = STATUS_CONFIG[d.status]
                    const isSel = selected === d.id
                    return (
                      <tr
                        key={d.id}
                        onClick={() => setSelected(d.id)}
                        className={`cursor-pointer border-b border-border/50 transition-colors last:border-0 hover:bg-white/[0.03] ${isSel ? 'bg-neon-teal/5' : ''}`}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{d.id}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{d.application}</td>
                        <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">{d.version}</td>
                        <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">{d.environment}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>
                            <cfg.icon className={`h-3.5 w-3.5 ${d.status === 'RUNNING' ? 'animate-spin' : ''}`} />
                            {d.status}
                          </span>
                        </td>
                        <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground lg:table-cell">{d.duration}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div>
          {selectedDeploy ? (
            <Panel>
              <div className="mb-4 flex items-start justify-between">
                <PanelHeading title={selectedDeploy.id} tag={selectedDeploy.version} color="#00ffd5" icon={GitBranch} />
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close details"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <StatusBadge
                  state={selectedDeploy.status === 'SUCCESS' ? 'OPERATIONAL' : selectedDeploy.status === 'FAILED' ? 'DOWN' : 'DEGRADED'}
                  label={selectedDeploy.status}
                />
                <dl className="space-y-2.5">
                  <Row label="Application" value={selectedDeploy.application} />
                  <Row label="Environment" value={selectedDeploy.environment} />
                  <Row label="Commit" value={selectedDeploy.commit} mono />
                  <Row label="Started" value={selectedDeploy.started} />
                  <Row label="Completed" value={selectedDeploy.completed} />
                  <Row label="Duration" value={selectedDeploy.duration} />
                </dl>
                <div className="mt-2 space-y-2">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Stage Details</p>
                  {selectedDeploy.stages.map((s, i) => {
                    const Icon = STAGE_ICONS[i] ?? Hammer
                    const cfg = STATUS_CONFIG[s.status]
                    return (
                      <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] px-3 py-2.5">
                        <Icon className="h-4 w-4 shrink-0" style={{ color: cfg.color }} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{s.label}</p>
                          <p className="text-xs text-muted-foreground">{s.detail}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-[10px] font-semibold uppercase" style={{ color: cfg.color }}>{s.status}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{s.duration}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Panel>
          ) : (
            <Panel>
              <PanelHeading title="Deployment Details" tag="Select" color="#8b5cf6" />
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <GitBranch className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Select a deployment to view pipeline stage details.
                </p>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </PageShell>
  )
}

function PipelineFlow({ stages }: { stages: Deployment['stages'] }) {
  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      {stages.map((stage, i) => {
        const Icon = STAGE_ICONS[i] ?? Hammer
        const cfg = STATUS_CONFIG[stage.status]
        return (
          <div key={stage.id} className="flex flex-1 items-center gap-3 sm:flex-col sm:gap-2">
            <div
              className="flex w-full flex-1 flex-col items-center gap-2 rounded-2xl border bg-white/[0.02] px-3 py-4 transition-all duration-300 sm:flex-none"
              style={{
                borderColor: `${cfg.color}40`,
                boxShadow: stage.status === 'RUNNING' ? `0 0 20px -6px ${cfg.color}` : 'none',
              }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{ borderColor: `${cfg.color}55`, background: `${cfg.color}10` }}
              >
                <Icon className={`h-5 w-5 ${stage.status === 'RUNNING' ? 'animate-spin' : ''}`} style={{ color: cfg.color }} />
              </span>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{stage.label}</p>
                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: cfg.color }}>{stage.status}</p>
                <p className="font-mono text-[9px] text-muted-foreground">{stage.duration}</p>
              </div>
            </div>
            {i < stages.length - 1 && (
              <div className="flex items-center justify-center sm:py-1">
                <div className="h-px w-full bg-gradient-to-r from-neon-teal/40 to-neon-purple/30 sm:h-6 sm:w-px" />
                <span className="ml-1 hidden text-neon-teal/60 sm:block">↓</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className={mono ? 'font-mono text-sm text-foreground' : 'text-sm text-foreground'}>{value}</dd>
    </div>
  )
}
