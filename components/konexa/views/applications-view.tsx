'use client'

import { ModuleList } from '../module-list'

interface ApplicationRow extends Record<string, unknown> {
  name: string
  environment: string
  version: string
  status: string
  repository: string
  deploymentStatus: string
  lastDeployment: string
}

export function ApplicationsView() {
  return (
    <ModuleList<ApplicationRow>
      title="Applications"
      subtitle="App status & versions"
      endpoint="/api/applications"
      searchPlaceholder="Search name, repository..."
      rowKey={(r) => `${r.name}-${r.environment}`}
      filters={[
        { key: 'environment', label: 'Environment', options: ['PRODUCTION', 'STAGING', 'DEVELOPMENT'] },
        { key: 'status', label: 'Status', options: ['RUNNING', 'STOPPED', 'DEPLOYING'] },
      ]}
      columns={[
        { key: 'name', label: 'Application' },
        { key: 'environment', label: 'Env' },
        { key: 'version', label: 'Version' },
        { key: 'status', label: 'Status' },
        { key: 'repository', label: 'Repository' },
        { key: 'deploymentStatus', label: 'Deploy Status' },
        { key: 'lastDeployment', label: 'Last Deploy', render: (r) => new Date(r.lastDeployment).toLocaleDateString() },
      ]}
    />
  )
}
