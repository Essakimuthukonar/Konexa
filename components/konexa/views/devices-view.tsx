'use client'

import { ModuleList } from '../module-list'

interface DeviceRow extends Record<string, unknown> {
  deviceId: string
  assetId: string
  storeCode: string
  deviceType: string
  manufacturer: string
  model: string
  serialNumber: string
  health: number
  battery: number
  mdmStatus: string
  lastSeen: string
}

export function DevicesView() {
  return (
    <ModuleList<DeviceRow>
      title="Devices"
      subtitle="Edge and POS devices"
      endpoint="/api/devices"
      searchPlaceholder="Search device id, asset, serial..."
      rowKey={(r) => r.deviceId}
      detailHref={(r) => `/devices/${r.deviceId}`}
      filters={[
        { key: 'status', label: 'Status', options: ['ONLINE', 'OFFLINE', 'DEGRADED'] },
        { key: 'deviceType', label: 'Type', options: ['TABLET', 'MOBILE', 'POS', 'PC', 'ROUTER', 'PRINTER', 'SERVER', 'OTHER'] },
        { key: 'mdmStatus', label: 'MDM', options: ['ENROLLED', 'UNENROLLED', 'NON_COMPLIANT'] },
      ]}
      columns={[
        { key: 'deviceId', label: 'Device ID' },
        { key: 'assetId', label: 'Asset' },
        { key: 'storeCode', label: 'Store' },
        { key: 'deviceType', label: 'Type' },
        { key: 'manufacturer', label: 'Mfr' },
        { key: 'model', label: 'Model' },
        { key: 'health', label: 'Health %' },
        { key: 'battery', label: 'Battery %' },
        { key: 'mdmStatus', label: 'MDM' },
        { key: 'lastSeen', label: 'Last Seen', render: (r) => new Date(r.lastSeen).toLocaleDateString() },
      ]}
    />
  )
}
