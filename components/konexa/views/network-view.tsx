'use client'

import { ModuleList } from '../module-list'

interface NetworkRow extends Record<string, unknown> {
  storeCode: string
  router: string
  wanStatus: string
  lanStatus: string
  internetStatus: string
  latency: number
  packetLoss: number
  publicIp: string
  lastChecked: string
}

export function NetworkView() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Operational data from database — not a real-time network monitor. Live monitoring integration is planned for a later phase.
      </p>
      <ModuleList<NetworkRow>
        title="Network Operations"
        subtitle="Store connectivity records"
        endpoint="/api/network"
        searchPlaceholder="Search store, router, IP..."
        rowKey={(r) => r.storeCode}
        summaries={[
          { label: 'Total Stores', query: '' },
          { label: 'Online', query: 'internetStatus=UP' },
          { label: 'Offline', query: 'internetStatus=DOWN' },
          { label: 'Degraded', query: 'internetStatus=DEGRADED' },
        ]}
        filters={[
          { key: 'internetStatus', label: 'Internet', options: ['UP', 'DOWN', 'DEGRADED'] },
          { key: 'wanStatus', label: 'WAN', options: ['UP', 'DOWN', 'DEGRADED'] },
          { key: 'lanStatus', label: 'LAN', options: ['UP', 'DOWN', 'DEGRADED'] },
        ]}
        columns={[
          { key: 'storeCode', label: 'Store' },
          { key: 'router', label: 'Router' },
          { key: 'wanStatus', label: 'WAN' },
          { key: 'lanStatus', label: 'LAN' },
          { key: 'internetStatus', label: 'Internet' },
          { key: 'latency', label: 'Latency ms' },
          { key: 'packetLoss', label: 'Loss %' },
          { key: 'publicIp', label: 'Public IP' },
          { key: 'lastChecked', label: 'Last Checked', render: (r) => new Date(r.lastChecked).toLocaleDateString() },
        ]}
      />
    </div>
  )
}
