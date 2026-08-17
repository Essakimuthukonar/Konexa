import { ServerDetail, DeploymentDetail } from './store';

export const mockServers: ServerDetail[] = [
  {
    id: 'srv-001',
    hostname: 'prod-api-01',
    environment: 'prod',
    ip: '192.168.1.10',
    cpu: 62,
    memory: 78,
    storage: 45,
    uptime: '45d 12h',
    status: 'online',
  },
  {
    id: 'srv-002',
    hostname: 'prod-api-02',
    environment: 'prod',
    ip: '192.168.1.11',
    cpu: 58,
    memory: 72,
    storage: 42,
    uptime: '45d 12h',
    status: 'online',
  },
  {
    id: 'srv-003',
    hostname: 'staging-db-01',
    environment: 'staging',
    ip: '192.168.2.10',
    cpu: 35,
    memory: 48,
    storage: 60,
    uptime: '12d 4h',
    status: 'online',
  },
  {
    id: 'srv-004',
    hostname: 'dev-worker-01',
    environment: 'dev',
    ip: '192.168.3.10',
    cpu: 28,
    memory: 42,
    storage: 38,
    uptime: '2d 18h',
    status: 'online',
  },
  {
    id: 'srv-005',
    hostname: 'prod-cache-01',
    environment: 'prod',
    ip: '192.168.1.20',
    cpu: 72,
    memory: 85,
    storage: 25,
    uptime: '60d 6h',
    status: 'online',
  },
  {
    id: 'srv-006',
    hostname: 'backup-node-01',
    environment: 'prod',
    ip: '192.168.4.10',
    cpu: 18,
    memory: 32,
    storage: 92,
    uptime: '90d 0h',
    status: 'online',
  },
];

export const mockDeployments: DeploymentDetail[] = [
  {
    id: 'dep-2024-001',
    name: 'API Service v2.1.0',
    status: 'success',
    progress: 100,
    stages: [
      { name: 'SOURCE', status: 'success', duration: 2 },
      { name: 'BUILD', status: 'success', duration: 5 },
      { name: 'TEST', status: 'success', duration: 12 },
      { name: 'SECURITY', status: 'success', duration: 8 },
      { name: 'DEPLOY', status: 'success', duration: 6 },
      { name: 'PRODUCTION', status: 'success', duration: 4 },
    ],
  },
  {
    id: 'dep-2024-002',
    name: 'Frontend Dashboard v1.5.2',
    status: 'running',
    progress: 65,
    stages: [
      { name: 'SOURCE', status: 'success', duration: 1 },
      { name: 'BUILD', status: 'success', duration: 4 },
      { name: 'TEST', status: 'running', duration: 0 },
      { name: 'SECURITY', status: 'waiting', duration: 0 },
      { name: 'DEPLOY', status: 'waiting', duration: 0 },
      { name: 'PRODUCTION', status: 'pending', duration: 0 },
    ],
  },
  {
    id: 'dep-2024-003',
    name: 'Database Migration v3.2.1',
    status: 'waiting',
    progress: 20,
    stages: [
      { name: 'SOURCE', status: 'success', duration: 1 },
      { name: 'BUILD', status: 'waiting', duration: 0 },
      { name: 'TEST', status: 'waiting', duration: 0 },
      { name: 'SECURITY', status: 'waiting', duration: 0 },
      { name: 'DEPLOY', status: 'waiting', duration: 0 },
      { name: 'PRODUCTION', status: 'waiting', duration: 0 },
    ],
  },
  {
    id: 'dep-2024-000',
    name: 'Worker Service v1.8.0',
    status: 'failed',
    progress: 35,
    stages: [
      { name: 'SOURCE', status: 'success', duration: 2 },
      { name: 'BUILD', status: 'success', duration: 6 },
      { name: 'TEST', status: 'failed', duration: 5 },
      { name: 'SECURITY', status: 'waiting', duration: 0 },
      { name: 'DEPLOY', status: 'waiting', duration: 0 },
      { name: 'PRODUCTION', status: 'waiting', duration: 0 },
    ],
  },
];

export const mockMetrics = {
  systemHealth: 98.7,
  cpuLoad: 42,
  memoryUsage: 68,
  storageUsage: 74,
  networkThroughput: 1.8,
  activeServers: 24,
  totalServers: 26,
  deployments: 12,
  backupStatus: 99.9,
  securityScore: 94,
};

export const mockLogs = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 60000),
    level: 'INFO',
    service: 'api-gateway',
    message: 'Request processed successfully',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 120000),
    level: 'INFO',
    service: 'database',
    message: 'Connection pool maintained at 45 connections',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 180000),
    level: 'WARN',
    service: 'cache-service',
    message: 'Cache hit ratio below threshold: 78%',
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 240000),
    level: 'INFO',
    service: 'load-balancer',
    message: 'Health check passed: 24/26 servers healthy',
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 300000),
    level: 'ERROR',
    service: 'backup-service',
    message: 'Failed to connect to backup storage: timeout',
  },
  {
    id: 'log-6',
    timestamp: new Date(Date.now() - 360000),
    level: 'INFO',
    service: 'deployment',
    message: 'Deployment completed: api-service v2.1.0',
  },
];

export const generateTimeSeriesData = (hours: number) => {
  const data = [];
  const now = Date.now();
  const interval = (hours * 60 * 60 * 1000) / 30;

  for (let i = 30; i >= 0; i--) {
    const time = new Date(now - i * interval);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      cpu: Math.floor(30 + Math.random() * 40 + Math.sin(i / 5) * 10),
      memory: Math.floor(50 + Math.random() * 30 + Math.cos(i / 5) * 8),
      disk: Math.floor(60 + Math.random() * 20 + Math.sin(i / 8) * 5),
      network: Math.floor(10 + Math.random() * 30 + Math.cos(i / 4) * 15),
    });
  }

  return data;
};

export const mockSecurityItems = [
  { id: 'fw-1', name: 'Firewall', status: 'secure' as const },
  { id: 'iam-1', name: 'IAM', status: 'secure' as const },
  { id: 'ssh-1', name: 'SSH', status: 'secure' as const },
  { id: 'tls-1', name: 'TLS', status: 'secure' as const },
  { id: 'bkp-1', name: 'Backups', status: 'warning' as const },
  { id: 'vuln-1', name: 'Vulnerabilities', status: 'secure' as const },
];
