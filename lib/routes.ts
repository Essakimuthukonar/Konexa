import type { ViewId } from './types'

export const VIEW_PATHS: Record<ViewId, string> = {
  overview: '/overview',
  stores: '/stores',
  assets: '/assets',
  devices: '/devices',
  incidents: '/incidents',
  alerts: '/alerts',
  network: '/network',
  backups: '/backups',
  infrastructure: '/infrastructure',
  servers: '/servers',
  applications: '/applications',
  deployments: '/deployments',
  monitoring: '/monitoring',
  logs: '/logs',
  settings: '/settings',
  about: '/about',
}

export function viewPath(view: ViewId): string {
  return VIEW_PATHS[view]
}
