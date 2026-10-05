import { Deployment } from '@/lib/models/Deployment'
import { listOnly } from '@/lib/crud-route'

const { GET } = listOnly(
  Deployment,
  ['environment', 'status', 'application', 'branch'],
  { deployedAt: -1 },
  ['application', 'version', 'commit'],
)

export { GET }

export const dynamic = 'force-dynamic'
