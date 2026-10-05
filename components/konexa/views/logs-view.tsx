'use client'

import { ModuleList } from '../module-list'

interface LogRow extends Record<string, unknown> {
  timestamp: string
  level: string
  source: string
  service: string
  message: string
  environment: string
}

export function LogsView() {
  return (
    <ModuleList<LogRow>
      title="Logs"
      subtitle="Terminal log stream"
      endpoint="/api/logs"
      searchPlaceholder="Search message, service, source..."
      rowKey={(r) => `${r.timestamp}-${r.service}-${r.message.slice(0, 12)}`}
      filters={[
        { key: 'level', label: 'Level', options: ['INFO', 'WARNING', 'ERROR', 'DEBUG'] },
        { key: 'environment', label: 'Environment', options: ['PRODUCTION', 'STAGING', 'DEVELOPMENT'] },
      ]}
      columns={[
        { key: 'timestamp', label: 'Timestamp', render: (r) => new Date(r.timestamp).toLocaleString() },
        { key: 'level', label: 'Level' },
        { key: 'source', label: 'Source' },
        { key: 'service', label: 'Service' },
        { key: 'environment', label: 'Env' },
        { key: 'message', label: 'Message' },
      ]}
    />
  )
}
