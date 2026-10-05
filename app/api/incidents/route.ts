import { Incident } from '@/lib/models/Incident'
import { crud } from '@/lib/crud-route'

const { GET, POST } = crud({
  model: Incident,
  filterKeys: ['storeCode', 'status', 'priority', 'category'],
  searchFields: ['incidentId', 'title', 'storeCode', 'assignedTo'],
  sort: { createdAt: -1 },
  requiredFields: ['incidentId', 'storeCode', 'category', 'priority', 'title'],
  uniqueField: 'incidentId',
})

export { GET, POST }

export const dynamic = 'force-dynamic'
