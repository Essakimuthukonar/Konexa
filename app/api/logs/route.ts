import { Log } from '@/lib/models/Log'
import { listOnly } from '@/lib/crud-route'

const { GET } = listOnly(
  Log,
  ['level', 'service', 'environment', 'source'],
  { timestamp: -1 },
  ['message', 'service', 'source'],
)

export { GET }

export const dynamic = 'force-dynamic'
