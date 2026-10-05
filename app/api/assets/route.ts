import { Asset } from '@/lib/models/Asset'
import { crud } from '@/lib/crud-route'

const { GET, POST } = crud({
  model: Asset,
  filterKeys: ['storeCode', 'status', 'type', 'manufacturer'],
  searchFields: ['assetTag', 'serialNumber', 'storeCode', 'model'],
  sort: { assetTag: 1 },
  requiredFields: ['assetTag', 'serialNumber', 'storeCode', 'location', 'manufacturer', 'type', 'model'],
  uniqueField: 'assetTag',
})

export { GET, POST }

export const dynamic = 'force-dynamic'
