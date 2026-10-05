'use client'

import { useQuery } from '@/hooks/use-query'

interface OverviewData {
  success: boolean
  data?: {
    stores: number
    assets: number
    devices: number
    openIncidents: number
    activeAlerts: number
    onlineStores: number
    offlineStores: number
    degradedStores: number
    backupsFailed: number
    backupsCompleted: number
    deploysSucceeded: number
    deploysFailed: number
  }
  error?: string
}

export function BackendCounts() {
  const { data, status, error } = useQuery<OverviewData>(() => fetch('/api/overview').then((r) => r.json()))

  if (status === 'error' || (data && data.success === false)) {
    return (
      <div className="glass rounded-3xl p-5 text-sm text-red-400">
        Backend unavailable: {error ?? data?.error}. Showing cached demo metrics below.
      </div>
    )
  }

  if (!data || !data.data) {
    return <div className="glass animate-pulse rounded-3xl p-5 text-sm text-muted-foreground">Loading live backend counts...</div>
  }

  const d = data.data
  const items: Array<[string, number | string]> = [
    ['Total Stores', d.stores],
    ['Total Assets', d.assets],
    ['Total Devices', d.devices],
    ['Open Incidents', d.openIncidents],
    ['Active Alerts', d.activeAlerts],
    ['Stores Online', d.onlineStores],
    ['Stores Offline', d.offlineStores],
    ['Backups OK', d.backupsCompleted],
    ['Backups Failed', d.backupsFailed],
    ['Deploys OK', d.deploysSucceeded],
    ['Deploys Failed', d.deploysFailed],
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="glass rounded-3xl p-4 text-center">
          <p className="font-mono text-2xl font-bold text-neon-teal">{value}</p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  )
}
