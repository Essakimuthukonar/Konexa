import { Network } from '@/lib/models/Network'
import { crud } from '@/lib/crud-route'

const { GET, POST } = crud({
  model: Network,
  filterKeys: ['storeCode', 'internetStatus', 'wanStatus', 'lanStatus'],
  searchFields: ['storeCode', 'router', 'publicIp'],
  sort: { storeCode: 1 },
  requiredFields: ['storeCode', 'router', 'wanStatus', 'lanStatus', 'internetStatus'],
  uniqueField: 'storeCode',
})

export { GET, POST }

export const dynamic = 'force-dynamic'
