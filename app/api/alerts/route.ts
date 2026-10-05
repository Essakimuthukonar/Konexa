import { Alert } from '@/lib/models/Alert'
import { crud } from '@/lib/crud-route'

const { GET, POST } = crud({
  model: Alert,
  filterKeys: ['storeCode', 'status', 'severity', 'source'],
  searchFields: ['alertId', 'title', 'storeCode', 'source', 'message'],
  sort: { createdAt: -1 },
  requiredFields: ['alertId', 'source', 'storeCode', 'severity', 'title'],
  uniqueField: 'alertId',
})

export { GET, POST }

export const dynamic = 'force-dynamic'
