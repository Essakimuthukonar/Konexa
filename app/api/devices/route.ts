import { Device } from '@/lib/models/Device'
import { crud } from '@/lib/crud-route'

const { GET, POST } = crud({
  model: Device,
  filterKeys: ['storeCode', 'status', 'deviceType', 'mdmStatus'],
  searchFields: ['deviceId', 'assetId', 'storeCode', 'serialNumber', 'model'],
  sort: { deviceId: 1 },
  requiredFields: ['deviceId', 'deviceType', 'manufacturer', 'model', 'serialNumber'],
  uniqueField: 'deviceId',
})

export { GET, POST }

export const dynamic = 'force-dynamic'
