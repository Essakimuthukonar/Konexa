'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { dataService } from '@/lib/api'
import type {
  SystemHealth,
  Server,
  InfraResource,
  MetricCard,
  Application,
  Deployment,
  Backup,
  LogEntry,
  InfraTopologyNode,
  InfraTopologyLink,
  ViewId,
} from '@/lib/types'

type KonexaContextValue = {
  view: ViewId
  setView: (v: ViewId) => void
  systemHealth?: SystemHealth
  metricCards: MetricCard[]
  servers: Server[]
  infra: InfraResource[]
  topoNodes: InfraTopologyNode[]
  topoLinks: InfraTopologyLink[]
  applications: Application[]
  deployments: Deployment[]
  backups: Backup[]
  logs: LogEntry[]
  refresh: () => Promise<void>
  openResource: (id: string) => void
  selectedResourceId?: string | null
  openModal: (content: React.ReactNode) => void
  closeModal: () => void
}

const KonexaContext = createContext<KonexaContextValue | undefined>(undefined)

export function KonexaProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ViewId>('overview')
  const [systemHealth, setSystemHealth] = useState<SystemHealth | undefined>(undefined)
  const [metricCards, setMetricCards] = useState<MetricCard[]>([])
  const [servers, setServers] = useState<Server[]>([])
  const [infra, setInfra] = useState<InfraResource[]>([])
  const [topoNodes, setTopoNodes] = useState<InfraTopologyNode[]>([])
  const [topoLinks, setTopoLinks] = useState<InfraTopologyLink[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [backups, setBackups] = useState<Backup[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null)
  const [modal, setModal] = useState<React.ReactNode | null>(null)

  const loadAll = async () => {
    const [sh, mc, sv, inf, tn, tl, apps, dpl, bkp, lg] = await Promise.all([
      dataService.getSystemHealth(),
      dataService.getMetricCards(),
      dataService.getServers(),
      dataService.getInfraResources(),
      dataService.getTopologyNodes(),
      dataService.getTopologyLinks(),
      dataService.getApplications(),
      dataService.getDeployments(),
      dataService.getBackups(),
      dataService.getLogs(),
    ])

    setSystemHealth(sh)
    setMetricCards(mc)
    setServers(sv)
    setInfra(inf)
    setTopoNodes(tn)
    setTopoLinks(tl)
    setApplications(apps)
    setDeployments(dpl)
    setBackups(bkp)
    setLogs(lg)
  }

  useEffect(() => {
    void loadAll()
  }, [])

  const refresh = async () => {
    await loadAll()
  }

  const openResource = (id: string) => {
    setSelectedResourceId(id)
  }

  const openModal = (content: React.ReactNode) => setModal(content)
  const closeModal = () => setModal(null)

  const value = useMemo(
    () => ({
      view,
      setView,
      systemHealth,
      metricCards,
      servers,
      infra,
      topoNodes,
      topoLinks,
      applications,
      deployments,
      backups,
      logs,
      refresh,
      openResource,
      selectedResourceId,
      openModal,
      closeModal,
    }),
    [
      view,
      systemHealth,
      metricCards,
      servers,
      infra,
      topoNodes,
      topoLinks,
      applications,
      deployments,
      backups,
      logs,
      selectedResourceId,
    ],
  )

  return (
    <KonexaContext.Provider value={value}>
      {children}
      {modal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-[1000] w-full max-w-3xl">{modal}</div>
        </div>
      )}
    </KonexaContext.Provider>
  )
}

export function useKonexa() {
  const ctx = useContext(KonexaContext)
  if (!ctx) throw new Error('useKonexa must be used within KonexaProvider')
  return ctx
}
