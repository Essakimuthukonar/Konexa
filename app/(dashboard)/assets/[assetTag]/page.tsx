'use client'

import { use } from 'react'
import { useQuery } from '@/hooks/use-query'
import { PageShell, Panel, PanelHeading } from '@/components/konexa/page-shell'

interface Detail {
  success: boolean
  data: {
    asset: Record<string, unknown>
    device: Record<string, unknown> | null
    store: Record<string, unknown> | null
  }
}

export default function AssetDetailPage({ params }: { params: Promise<{ assetTag: string }> }) {
  const { assetTag } = use(params)
  const { data, status, error } = useQuery<Detail>(() => fetch(`/api/assets/${assetTag}`).then((r) => r.json()), [assetTag])

  if (status === 'error' || (data && !data.success)) {
    return <PageShell title={assetTag} subtitle="Asset detail"><Panel><p className="text-red-400">{error ?? 'Asset not found'}</p></Panel></PageShell>
  }
  if (!data) return <PageShell title={assetTag} subtitle="Asset detail"><Panel><p className="text-muted-foreground">Loading...</p></Panel></PageShell>

  const { asset, device, store } = data.data
  return (
    <PageShell title={assetTag} subtitle={`${String(asset.type ?? '')} · ${String(asset.manufacturer ?? '')}`}>
      <Panel>
        <PanelHeading title="Asset" color="#8b5cf6" />
        <dl className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          {Object.entries(asset).filter(([k]) => k !== '_id' && k !== '__v').map(([k, v]) => (
            <div key={k}><dt className="font-mono text-[9px] uppercase text-muted-foreground">{k}</dt><dd>{String(v)}</dd></div>
          ))}
        </dl>
      </Panel>
      {device && (
        <Panel>
          <PanelHeading title="Linked Device" color="#ffb800" />
          <dl className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            {Object.entries(device).filter(([k]) => k !== '_id' && k !== '__v').map(([k, v]) => (
              <div key={k}><dt className="font-mono text-[9px] uppercase text-muted-foreground">{k}</dt><dd>{String(v)}</dd></div>
            ))}
          </dl>
        </Panel>
      )}
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
