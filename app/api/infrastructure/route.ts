import { Infrastructure } from '@/lib/models/Infrastructure'
import { listOnly } from '@/lib/crud-route'

const { GET } = listOnly(
  Infrastructure,
  ['environment', 'status', 'provider', 'region'],
  { createdAt: -1 },
  ['name', 'region'],
)

export { GET }

export const dynamic = 'force-dynamic'
