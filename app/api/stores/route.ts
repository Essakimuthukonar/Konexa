import { Store } from '@/lib/models/Store'
import { crud } from '@/lib/crud-route'

const { GET, POST } = crud({
  model: Store,
  filterKeys: ['storeCode', 'status', 'city', 'state', 'networkStatus', 'internetStatus'],
  searchFields: ['storeCode', 'storeName', 'city', 'location'],
  sort: { storeCode: 1 },
  requiredFields: ['storeCode', 'storeName', 'location', 'city', 'state'],
  uniqueField: 'storeCode',
})

export { GET, POST }

export const dynamic = 'force-dynamic'
