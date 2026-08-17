'use client'

import { useState } from 'react'
import { Blocks, X } from 'lucide-react'
import { useQuery } from '@/hooks/use-query'
import { dataService } from '@/lib/api'
import type { InfraResource, InfraTopologyLink, InfraTopologyNode } from '@/lib/types'
import { PageShell, Panel, PanelHeading, SkeletonPanel } from '../page-shell'
import { StatusBadge } from '../status-badge'

export function InfrastructureView() {
  const { data: resources } = useQuery<InfraResource[]>(() => dataService.getInfraResources())
  const { data: nodes } = useQuery<InfraTopologyNode[]>(() => dataService.getTopologyNodes())
  const { data: links } = useQuery<InfraTopologyLink[]>(() => dataService.getTopologyLinks())
  const [selected, setSelected] = useState<string | null>(null)

  if (!resources || !nodes || !links) {
    return (
      <PageShell title="Infrastructure" subtitle="Loading topology...">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <SkeletonPanel className="lg:col-span-2" />
          <SkeletonPanel />
        </div>
      </PageShell>
    )
  }

  const selectedResource = selected ? resources.find((r) => r.id === selected) ?? null : null

  return (
    <PageShell
      title="Infrastructure"
      subtitle="Konexa VPC topology — visual map of subnets, gateways, route tables, security groups, EC2 and S3."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel span="lg:col-span-2" className="!p-4 sm:!p-6">
          <PanelHeading title="VPC Topology" tag="Animated" color="#00ffd5" icon={Blocks} />
          <TopologyCanvas nodes={nodes} links={links} selected={selected} onSelect={setSelected} />
        </Panel>

        <div className="flex flex-col gap-5">
          {selectedResource ? (
            <ResourceDetails resource={selectedResource} onClose={() => setSelected(null)} />
          ) : (
            <Panel>
              <PanelHeading title="Resource Details" tag="Select" color="#8b5cf6" />
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <Blocks className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Click a node in the topology to view details.
                </p>
              </div>
            </Panel>
          )}

          <Panel>
            <PanelHeading title="Resources" tag={String(resources.length)} color="#00ff9d" />
            <ul className="space-y-2">
              {resources.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(r.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-white/[0.02] px-3 py-2.5 text-left transition-colors hover:border-[var(--c)]/40 hover:bg-white/[0.04]"
                    style={{ ['--c' as string]: r.color } as React.CSSProperties}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }} />
                      <span className="text-sm font-medium text-foreground">{r.name}</span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{r.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </PageShell>
  )
}

function TopologyCanvas({
  nodes,
  links,
  selected,
  onSelect,
}: {
  nodes: InfraTopologyNode[]
  links: InfraTopologyLink[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-background/40">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {links.map((link, i) => {
          const from = nodeMap.get(link.from)
          const to = nodeMap.get(link.to)
          if (!from || !to) return null
          const isActive = selected === link.from || selected === link.to
          return (
            <g key={i}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? '#00ffd5' : 'rgba(255,255,255,0.14)'}
                strokeWidth={isActive ? 0.5 : 0.3}
                strokeOpacity={isActive ? 0.7 : 0.4}
              />
              {link.animated && (
                <circle r="0.8" fill="#00ffd5">
                  <animateMotion
                    dur={isActive ? '1.4s' : '3s'}
                    repeatCount="indefinite"
                    path={`M${from.x},${from.y} L${to.x},${to.y}`}
                  />
                </circle>
              )}
            </g>
          )
        })}
      </svg>

      {nodes.map((node) => {
        const isSelected = selected === node.id
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onSelect(node.id)}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            aria-label={node.label}
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background/80 backdrop-blur transition-all duration-300 sm:h-12 sm:w-12"
              style={{
                borderColor: isSelected ? node.color : `${node.color}45`,
                boxShadow: isSelected ? `0 0 20px -2px ${node.color}` : 'none',
                transform: isSelected ? 'scale(1.12)' : 'scale(1)',
              }}
            >
              <span className="h-4 w-4 rounded-full" style={{ background: node.color, boxShadow: `0 0 10px ${node.color}` }} />
            </span>
            <span
              className="font-mono text-[8px] uppercase tracking-wider transition-colors sm:text-[9px]"
              style={{ color: isSelected ? node.color : 'rgba(255,255,255,0.5)' }}
            >
              {node.label}
            </span>
            <span className="font-mono text-[7px] text-muted-foreground/60 sm:text-[8px]">
              {node.sublabel}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function ResourceDetails({ resource, onClose }: { resource: InfraResource; onClose: () => void }) {
  return (
    <Panel>
      <div className="mb-4 flex items-start justify-between">
        <PanelHeading title={resource.name} tag={resource.type} color={resource.color} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <dl className="space-y-3">
        <Row label="Status">
          <StatusBadge state={resource.status === 'ACTIVE' ? 'OPERATIONAL' : 'DEGRADED'} label={resource.status} />
        </Row>
        {resource.cidr && <Row label="CIDR"><span className="font-mono text-sm text-foreground">{resource.cidr}</span></Row>}
        <Row label="Detail"><span className="text-sm text-muted-foreground">{resource.detail}</span></Row>
        {resource.parent && <Row label="Connected to"><span className="font-mono text-sm text-foreground">{resource.parent}</span></Row>}
      </dl>
    </Panel>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2.5 last:border-0">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
