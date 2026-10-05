import type { Role } from '@/lib/models/User'

export type Resource = 'stores' | 'assets' | 'devices' | 'incidents' | 'alerts' | 'network' | 'backups' | 'users'

const MUTATION_ROLES: Record<Resource, Role[]> = {
  stores: ['ADMIN', 'IT_ADMIN'],
  assets: ['ADMIN', 'IT_ADMIN'],
  devices: ['ADMIN', 'IT_ADMIN'],
  incidents: ['ADMIN', 'IT_ADMIN', 'IT_ENGINEER'],
  alerts: ['ADMIN', 'IT_ADMIN'],
  network: ['ADMIN', 'IT_ADMIN'],
  backups: ['ADMIN', 'IT_ADMIN'],
  users: ['ADMIN'],
}

export function canMutate(role: Role, resource: Resource): boolean {
  return MUTATION_ROLES[resource].includes(role)
}

export function isAdmin(role: Role): boolean {
  return role === 'ADMIN'
}
