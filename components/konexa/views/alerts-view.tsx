'use client'

import { ModuleList } from '../module-list'

interface AlertRow extends Record<string, unknown> {
  alertId: string
  source: string
  storeCode: string
  severity: string
  title: string
  message: string
  status: string
  createdAt: string
}

export function AlertsView() {
  return (
    <ModuleList<AlertRow>
      title="Alerts"
      subtitle="Alert rules and feeds"
      endpoint="/api/alerts"
      searchPlaceholder="Search alert id, title, source..."
      rowKey={(r) => r.alertId}
      summaries={[
        { label: 'Critical', query: 'severity=CRITICAL' },
        { label: 'Error', query: 'severity=ERROR' },
        { label: 'Warning', query: 'severity=WARNING' },
        { label: 'Info', query: 'severity=INFO' },
        { label: 'Active', query: 'status=ACTIVE' },
      ]}
      filters={[
        { key: 'severity', label: 'Severity', options: ['CRITICAL', 'ERROR', 'WARNING', 'INFO'] },
        { key: 'status', label: 'Status', options: ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] },
        { key: 'source', label: 'Source', options: ['monitoring', 'mdm', 'network', 'backup'] },
      ]}
      columns={[
        { key: 'alertId', label: 'ID' },
        { key: 'source', label: 'Source' },
        { key: 'storeCode', label: 'Store' },
        { key: 'severity', label: 'Severity' },
        { key: 'title', label: 'Title' },
        { key: 'message', label: 'Message' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() },
      ]}
    />
  )
}
