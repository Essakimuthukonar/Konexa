'use client'

import { ModuleList } from '../module-list'

interface AssetRow extends Record<string, unknown> {
  assetTag: string
  serialNumber: string
  storeCode: string
  manufacturer: string
  type: string
  model: string
  status: string
  lastSeen: string
}

export function AssetsView() {
  return (
    <ModuleList<AssetRow>
      title="Assets"
      subtitle="Hardware and asset registry"
      endpoint="/api/assets"
      searchPlaceholder="Search asset tag, serial, store..."
      rowKey={(r) => r.assetTag}
      detailHref={(r) => `/assets/${r.assetTag}`}
      filters={[
        { key: 'status', label: 'Status', options: ['ACTIVE', 'INACTIVE', 'IN_REPAIR', 'RETIRED'] },
        { key: 'type', label: 'Type', options: ['Lenovo Tablet', 'Lava Mobile', 'Samsung Mobile', 'POS', 'PC', 'Router', 'Printer', 'Server', 'Other'] },
        { key: 'manufacturer', label: 'Manufacturer', options: ['Lenovo', 'Lava', 'Samsung', 'Epson', 'Ingenico', 'Dell', 'HP', 'Cisco', 'TP-Link', 'MikroTik', 'Canon', 'Generic'] },
      ]}
      columns={[
        { key: 'assetTag', label: 'Tag' },
        { key: 'serialNumber', label: 'Serial' },
        { key: 'storeCode', label: 'Store' },
        { key: 'manufacturer', label: 'Manufacturer' },
        { key: 'type', label: 'Type' },
        { key: 'model', label: 'Model' },
        { key: 'status', label: 'Status' },
        { key: 'lastSeen', label: 'Last Seen', render: (r) => new Date(r.lastSeen).toLocaleDateString() },
      ]}
    />
  )
}
