import { create } from 'zustand';

export type View = 
  | 'overview'
  | 'infrastructure'
  | 'servers'
  | 'applications'
  | 'deployments'
  | 'backups'
  | 'monitoring'
  | 'logs'
  | 'security';

export type ServerDetail = {
  id: string;
  hostname: string;
  environment: 'prod' | 'staging' | 'dev';
  ip: string;
  cpu: number;
  memory: number;
  storage: number;
  uptime: string;
  status: 'online' | 'offline' | 'warning';
};

export type DeploymentDetail = {
  id: string;
  name: string;
  status: 'success' | 'running' | 'failed' | 'waiting';
  stages: {
    name: string;
    status: 'success' | 'running' | 'failed' | 'waiting' | 'pending';
    duration: number;
  }[];
  progress: number;
};

interface Store {
  currentView: View;
  setCurrentView: (view: View) => void;
  selectedServer: ServerDetail | null;
  setSelectedServer: (server: ServerDetail | null) => void;
  selectedDeployment: DeploymentDetail | null;
  setSelectedDeployment: (deployment: DeploymentDetail | null) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  currentView: 'overview',
  setCurrentView: (view) => set({ currentView: view }),
  selectedServer: null,
  setSelectedServer: (server) => set({ selectedServer: server }),
  selectedDeployment: null,
  setSelectedDeployment: (deployment) => set({ selectedDeployment: deployment }),
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
