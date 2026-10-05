import { Application } from '@/lib/models/Application'
import { listOnly } from '@/lib/crud-route'

const { GET } = listOnly(
  Application,
  ['environment', 'status', 'deploymentStatus'],
  { lastDeployment: -1 },
  ['name', 'repository'],
)

export { GET }

export const dynamic = 'force-dynamic'
