'use client'

import { use } from 'react'
import { useQuery } from '@/hooks/use-query'
import { PageShell, Panel, PanelHeading } from '@/components/konexa/page-shell'

interface StoreDetail {
  success: boolean
  data: {
    store: Record<string, unknown>
    network: Record<string, unknown> | null
    assets: Array<Record<string, unknown>>
    devices: Array<Record<string, unknown>>
    incidents: Array<Record<string, unknown>>
    alerts: Array<Record<string, unknown>>
    summary: { assetCount: number; deviceCount: number; openIncidents: number; activeAlerts: number }
  }
}

export default function StoreDetailPage({ params }: { params: Promise<{ storeCode: string }> }) {
  return <StoreDetail paramsPromise={params} />
}

function StoreDetail({ paramsPromise }: { paramsPromise: Promise<{ storeCode: string }> }) {
  const { storeCode } = use(paramsPromise)
  const { data, status, error } = useQuery<StoreDetail>(() => fetch(`/api/stores/${storeCode}`).then((r) => r.json()), [storeCode])

  if (status === 'error' || (data && !data.success)) {
    return <PageShell title={storeCode} subtitle="Store detail"><Panel><p className="text-red-400">{error ?? 'Store not found'}</p></Panel></PageShell>
  }
  if (!data) {
    return <PageShell title={storeCode} subtitle="Store detail"><Panel><p className="text-muted-foreground">Loading...</p></Panel></PageShell>
  }

  const { store, network, assets, devices, incidents, alerts, summary } = data.data

  return (
    <PageShell title={storeCode} subtitle={`${String(store.storeName ?? '')} · ${String(store.city ?? '')}`}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Assets', summary.assetCount],
          ['Devices', summary.deviceCount],
          ['Open Incidents', summary.openIncidents],
          ['Active Alerts', summary.activeAlerts],
        ].map(([l, v]) => (
          <div key={l as string} className="glass rounded-3xl p-4 text-center">
            <p className="font-mono text-2xl font-bold text-neon-teal">{v as number}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{l as string}</p>
          </div>
        ))}
      </div>

      <Panel>
        <PanelHeading title="Store" color="#00ffd5" />
        <dl className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          {Object.entries(store).filter(([k]) => k !== '_id' && k !== '__v').map(([k, v]) => (
            <div key={k}><dt className="font-mono text-[9px] uppercase text-muted-foreground">{k}</dt><dd>{String(v)}</dd></div>
          ))}
        </dl>
      </Panel>

      {network && (
        <Panel>
          <PanelHeading title="Network" color="#8b5cf6" />
          <dl className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            {Object.entries(network).filter(([k]) => k !== '_id' && k !== '__v').map(([k, v]) => (
              <div key={k}><dt className="font-mono text-[9px] uppercase text-muted-foreground">{k}</dt><dd>{String(v)}</dd></div>
            ))}
          </dl>
        </Panel>
      )}

      <Panel>
        <PanelHeading title={`Assets (${assets.length} shown)`} color="#00ff9d" />
        <Table rows={assets} cols={['assetTag', 'type', 'manufacturer', 'model', 'status']} />
      </Panel>
      <Panel>
        <PanelHeading title={`Devices (${devices.length} shown)`} color="#ffb800" />
        <Table rows={devices} cols={['deviceId', 'deviceType', 'model', 'status', 'health']} />
      </Panel>
      <Panel>
        <PanelHeading title={`Incidents (${incidents.length} shown)`} color="#ff3e81" />
        <Table rows={incidents} cols={['incidentId', 'title', 'priority', 'status']} />
      </Panel>
      <Panel>
        <PanelHeading title={`Alerts (${alerts.length} shown)`} color="#ff3e81" />
        <Table rows={alerts} cols={['alertId', 'title', 'severity', 'status']} />
      </Panel>
    </PageShell>
  )
}

function Table({ rows, cols }: { rows: Array<Record<string, unknown>>; cols: string[] }) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">None</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-widest text-muted-foreground">
            {cols.map((c) => <th key={c} className="pb-2 pr-4">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border/60">
              {cols.map((c) => <td key={c} className="py-1.5 pr-4">{String(r[c] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
