'use client'

import { ModuleList } from '../module-list'

interface DeploymentRow extends Record<string, unknown> {
  application: string
  version: string
  environment: string
  status: string
  branch: string
  commit: string
  buildNumber: number
  deployedAt: string
  deployedBy: string
  duration: string
}

export function DeploymentsView() {
  return (
    <ModuleList<DeploymentRow>
      title="Deployments"
      subtitle="CI/CD pipeline history"
      endpoint="/api/deployments"
      searchPlaceholder="Search application, version, commit..."
      rowKey={(r) => `${r.application}-${r.buildNumber}`}
      summaries={[
        { label: 'Total', query: '' },
        { label: 'Success', query: 'status=SUCCESS' },
        { label: 'Failed', query: 'status=FAILED' },
        { label: 'Running', query: 'status=RUNNING' },
      ]}
      filters={[
        { key: 'status', label: 'Status', options: ['SUCCESS', 'RUNNING', 'FAILED', 'QUEUED'] },
        { key: 'environment', label: 'Environment', options: ['PRODUCTION', 'STAGING', 'DEVELOPMENT'] },
        { key: 'branch', label: 'Branch', options: ['main', 'develop', 'release'] },
      ]}
      columns={[
        { key: 'application', label: 'Application' },
        { key: 'version', label: 'Version' },
        { key: 'environment', label: 'Env' },
        { key: 'status', label: 'Status' },
        { key: 'branch', label: 'Branch' },
        { key: 'commit', label: 'Commit' },
        { key: 'buildNumber', label: 'Build #' },
        { key: 'deployedAt', label: 'Deployed At', render: (r) => new Date(r.deployedAt).toLocaleString() },
        { key: 'deployedBy', label: 'By' },
        { key: 'duration', label: 'Duration' },
      ]}
    />
  )
}
