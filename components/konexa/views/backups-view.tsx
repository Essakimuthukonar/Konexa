'use client'

import { ModuleList } from '../module-list'

interface BackupRow extends Record<string, unknown> {
  backupId: string
  source: string
  type: string
  status: string
  size: string
  startedAt: string
  completedAt?: string
  duration: string
}

export function BackupsView() {
  return (
    <ModuleList<BackupRow>
      title="Backups"
      subtitle="S3 backup operations"
      endpoint="/api/backups"
      searchPlaceholder="Search backup id, source..."
      rowKey={(r) => r.backupId}
      summaries={[
        { label: 'Total', query: '' },
        { label: 'Completed', query: 'status=COMPLETED' },
        { label: 'Failed', query: 'status=FAILED' },
        { label: 'Running', query: 'status=RUNNING' },
      ]}
      filters={[
        { key: 'status', label: 'Status', options: ['COMPLETED', 'RUNNING', 'FAILED', 'SCHEDULED'] },
        { key: 'type', label: 'Type', options: ['FULL', 'INCREMENTAL', 'DIFFERENTIAL'] },
      ]}
      columns={[
        { key: 'backupId', label: 'ID' },
        { key: 'source', label: 'Source' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'size', label: 'Size' },
        { key: 'startedAt', label: 'Started', render: (r) => new Date(r.startedAt).toLocaleString() },
        { key: 'duration', label: 'Duration' },
      ]}
    />
  )
}
