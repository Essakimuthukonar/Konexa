'use client'

import { ModuleList } from '../module-list'

interface StoreRow extends Record<string, unknown> {
  storeCode: string
  storeName: string
  location: string
  status: string
  networkStatus: string
  internetStatus: string
  deviceHealth: number
  assetCount: number
  lastChecked: string
}

export function StoresView() {
  return (
    <ModuleList<StoreRow>
      title="Stores"
      subtitle="Store estate overview"
      endpoint="/api/stores"
      searchPlaceholder="Search store code, name, city..."
      rowKey={(r) => r.storeCode}
      detailHref={(r) => `/stores/${r.storeCode}`}
      filters={[
        { key: 'status', label: 'Status', options: ['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE'] },
        { key: 'networkStatus', label: 'Network', options: ['ONLINE', 'OFFLINE', 'DEGRADED'] },
        { key: 'internetStatus', label: 'Internet', options: ['ONLINE', 'OFFLINE', 'DEGRADED'] },
      ]}
      columns={[
        { key: 'storeCode', label: 'Code' },
        { key: 'storeName', label: 'Name' },
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status' },
        { key: 'networkStatus', label: 'Network' },
        { key: 'internetStatus', label: 'Internet' },
        { key: 'deviceHealth', label: 'Health %' },
        { key: 'assetCount', label: 'Assets' },
        { key: 'lastChecked', label: 'Last Checked', render: (r) => new Date(r.lastChecked).toLocaleDateString() },
      ]}
    />
  )
}
