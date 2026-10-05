export type ViewId =
  | 'overview'
  | 'infrastructure'
  | 'servers'
  | 'applications'
  | 'deployments'
  | 'backups'
  | 'monitoring'
  | 'logs'
  | 'settings'
  | 'about'

export type Severity = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'

export type HealthState = 'OPERATIONAL' | 'DEGRADED' | 'DOWN'

export interface SystemHealth {
  state: HealthState
  uptimePercent: number
  healthIndex: number
  environment: string
  version: string
  lastIncident: string
}

export interface MetricSample {
  t: string
  v: number
}

export interface ServerMetrics {
  cpu: number
  memory: number
  disk: number
  networkIn: number
  networkOut: number
  uptimeDays: number
  uptimePercent: number
  cpuTrend: number[]
  memoryTrend: number[]
  diskTrend: number[]
  networkTrend: number[]
  history: MetricSample[]
}

export interface Server {
  id: string
  name: string
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'
  region: string
  privateIp: string
  publicIp: string
  instanceType: string
  os: string
  cpu: number
  memory: number
  disk: number
  uptimeDays: number
  lastCheck: string
}

export interface CoreLink {
  id: string
  label: string
  sublabel: string
  icon: string
  color: string
  view: ViewId
  angle: number
}

export interface InfraResource {
  id: string
  name: string
  type:
    | 'VPC'
    | 'SUBNET'
    | 'GATEWAY'
    | 'ROUTE_TABLE'
    | 'SECURITY_GROUP'
    | 'EC2'
    | 'S3'
    | 'IAM'
  status: 'ACTIVE' | 'STANDBY' | 'PROVISIONING'
  cidr?: string
  detail: string
  parent?: string
  icon: string
  color: string
}

export interface InfraTopologyNode {
  id: string
  label: string
  sublabel: string
  icon: string
  color: string
  resourceId: string
  x: number
  y: number
}

export interface InfraTopologyLink {
  from: string
  to: string
  animated: boolean
}

export interface Application {
  id: string
  name: string
  status: 'RUNNING' | 'STOPPED' | 'DEPLOYING'
  framework: string
  version: string
  environment: string
  uptimePercent: number
  lastDeployment: string
  url: string
}

export type DeploymentStatus = 'SUCCESS' | 'RUNNING' | 'FAILED' | 'QUEUED'

export interface DeploymentStage {
  id: string
  label: string
  status: DeploymentStatus
  duration: string
  detail: string
}

export interface Deployment {
  id: string
  application: string
  version: string
  environment: string
  status: DeploymentStatus
  started: string
  completed: string
  duration: string
  commit: string
  stages: DeploymentStage[]
}

export interface Backup {
  id: string
  file: string
  size: string
  status: 'COMPLETED' | 'RUNNING' | 'FAILED' | 'SCHEDULED'
  date: string
  destination: string
  duration: string
}

export interface BackupStatus {
  state: HealthState
  lastSuccessful: string
  nextScheduled: string
  lastSize: string
  destination: string
  schedule: string
  totalBackups: number
}

export interface LogEntry {
  id: string
  timestamp: string
  severity: Severity
  service: string
  message: string
  detail?: string
}

export interface TrendDelta {
  direction: 'up' | 'down' | 'flat'
  percent: number
}

export interface MetricCard {
  id: string
  label: string
  value: number
  display: string
  unit?: string
  state: HealthState
  trend: TrendDelta
  trendLabel: string
  color: string
  series: number[]
  targetView: ViewId
}
