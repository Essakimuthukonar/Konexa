import {
  APPLICATIONS,
  BACKUPS,
  BACKUP_STATUS,
  CORE_LINKS,
  DEPLOYMENTS,
  INFRA_RESOURCES,
  LOGS,
  METRIC_CARDS,
  MONITORING_SERIES,
  SERVERS,
  SYSTEM_HEALTH,
  TOPOLOGY_LINKS,
  TOPOLOGY_NODES,
} from './mock-data'
import type {
  Application,
  Backup,
  BackupStatus,
  CoreLink,
  Deployment,
  InfraResource,
  InfraTopologyLink,
  InfraTopologyNode,
  LogEntry,
  MetricCard,
  Server,
  SystemHealth,
} from './types'

const LATENCY = 220

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY))
}

export const dataService = {
  getSystemHealth(): Promise<SystemHealth> {
    return delay(SYSTEM_HEALTH)
  },
  getCoreLinks(): Promise<CoreLink[]> {
    return delay(CORE_LINKS)
  },
  getMetricCards(): Promise<MetricCard[]> {
    return delay(METRIC_CARDS)
  },
  getServers(): Promise<Server[]> {
    return delay(SERVERS)
  },
  getInfraResources(): Promise<InfraResource[]> {
    return delay(INFRA_RESOURCES)
  },
  getTopologyNodes(): Promise<InfraTopologyNode[]> {
    return delay(TOPOLOGY_NODES)
  },
  getTopologyLinks(): Promise<InfraTopologyLink[]> {
    return delay(TOPOLOGY_LINKS)
  },
  getApplications(): Promise<Application[]> {
    return delay(APPLICATIONS)
  },
  getDeployments(): Promise<Deployment[]> {
    return delay(DEPLOYMENTS)
  },
  getBackupStatus(): Promise<BackupStatus> {
    return delay(BACKUP_STATUS)
  },
  getBackups(): Promise<Backup[]> {
    return delay(BACKUPS)
  },
  getLogs(): Promise<LogEntry[]> {
    return delay(LOGS)
  },
  getMonitoringSeries(range: string): Promise<Record<string, number[]>> {
    const key = (range in MONITORING_SERIES ? range : '24H') as keyof typeof MONITORING_SERIES
    return delay({ ...MONITORING_SERIES[key] })
  },
}

export type DataService = typeof dataService
