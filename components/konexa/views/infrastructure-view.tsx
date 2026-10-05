'use client'

import { ModuleList } from '../module-list'

interface InfraRow extends Record<string, unknown> {
  name: string
  environment: string
  provider: string
  region: string
  status: string
  cpu: number
  memory: number
  storage: number
}

export function InfrastructureView() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Infrastructure inventory / demo operational data — live AWS metrics integration is planned for a later phase.
      </p>
      <ModuleList<InfraRow>
        title="Infrastructure"
        subtitle="VPC & resource topology"
        endpoint="/api/infrastructure"
        searchPlaceholder="Search name, region..."
        rowKey={(r) => `${r.name}-${r.region}`}
        summaries={[
          { label: 'Total', query: '' },
          { label: 'Online', query: 'status=ONLINE' },
          { label: 'Degraded', query: 'status=DEGRADED' },
          { label: 'Offline', query: 'status=OFFLINE' },
        ]}
        filters={[
          { key: 'environment', label: 'Environment', options: ['PRODUCTION', 'STAGING', 'DEVELOPMENT'] },
          { key: 'status', label: 'Status', options: ['ONLINE', 'DEGRADED', 'OFFLINE'] },
          { key: 'provider', label: 'Provider', options: ['AWS', 'AZURE', 'GCP', 'ON_PREM'] },
        ]}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'environment', label: 'Env' },
          { key: 'provider', label: 'Provider' },
          { key: 'region', label: 'Region' },
          { key: 'status', label: 'Status' },
          { key: 'cpu', label: 'CPU %' },
          { key: 'memory', label: 'Memory %' },
          { key: 'storage', label: 'Storage %' },
        ]}
      />
    </div>
  )
}
