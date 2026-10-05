'use client'

import { use } from 'react'
import { useQuery } from '@/hooks/use-query'
import { PageShell, Panel, PanelHeading } from '@/components/konexa/page-shell'

interface Detail {
  success: boolean
  data: {
    incident: Record<string, unknown>
    store: Record<string, unknown> | null
  }
}

export default function IncidentDetailPage({ params }: { params: Promise<{ incidentId: string }> }) {
  const { incidentId } = use(params)
  const { data, status, error } = useQuery<Detail>(() => fetch(`/api/incidents/${incidentId}`).then((r) => r.json()), [incidentId])

  if (status === 'error' || (data && !data.success)) {
    return <PageShell title={incidentId} subtitle="Incident detail"><Panel><p className="text-red-400">{error ?? 'Incident not found'}</p></Panel></PageShell>
  }
  if (!data) return <PageShell title={incidentId} subtitle="Incident detail"><Panel><p className="text-muted-foreground">Loading...</p></Panel></PageShell>

  const { incident, store } = data.data
  return (
    <PageShell title={incidentId} subtitle={String(incident.title ?? '')}>
      <Panel>
        <PanelHeading title="Incident" color="#ff3e81" />
        <dl className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          {Object.entries(incident).filter(([k]) => k !== '_id' && k !== '__v').map(([k, v]) => (
            <div key={k}><dt className="font-mono text-[9px] uppercase text-muted-foreground">{k}</dt><dd>{String(v)}</dd></div>
          ))}
        </dl>
      </Panel>
      {store && (
        <Panel>
          <PanelHeading title="Store" color="#00ffd5" />
          <dl className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            {Object.entries(store).filter(([k]) => k !== '_id' && k !== '__v').map(([k, v]) => (
              <div key={k}><dt className="font-mono text-[9px] uppercase text-muted-foreground">{k}</dt><dd>{String(v)}</dd></div>
            ))}
          </dl>
        </Panel>
      )}
    </PageShell>
  )
}
