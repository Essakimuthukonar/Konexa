'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { PageShell, Panel, SkeletonPanel } from './page-shell'

export interface FilterDef {
  key: string
  label: string
  options: string[]
}

export interface Column<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
}

export interface SummaryDef {
  label: string
  /** appended query string like 'internetStatus=UP' or '' for total */
  query: string
}

interface Props<T> {
  title: string
  subtitle: string
  endpoint: string
  columns: Column<T>[]
  filters?: FilterDef[]
  searchPlaceholder?: string
  detailHref?: (row: T) => string | null
  rowKey: (row: T) => string
  summaries?: SummaryDef[]
}

interface ApiList<T> {
  success: boolean
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
  error?: string
}

export function ModuleList<T extends Record<string, unknown>>({
  title,
  subtitle,
  endpoint,
  columns,
  filters = [],
  searchPlaceholder = 'Search...',
  detailHref,
  rowKey,
  summaries = [],
}: Props<T>) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [data, setData] = useState<ApiList<T> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summaryValues, setSummaryValues] = useState<Record<string, number | null>>({})
  const [reloadToken, setReloadToken] = useState(0)

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: '15' })
    if (appliedSearch) params.set('search', appliedSearch)
    for (const [k, v] of Object.entries(filterValues)) if (v) params.set(k, v)
    return `${endpoint}?${params}`
  }, [page, appliedSearch, filterValues, endpoint])

  useEffect(() => {
    let active = true
    // Deferred so setState does not run synchronously inside the effect body.
    void Promise.resolve()
      .then(() => {
        if (active) {
          setLoading(true)
          setError(null)
        }
        return fetch(buildUrl())
      })
      .then((r) => r.json() as Promise<ApiList<T>>)
      .then((json) => {
        if (!active) return
        if (json.success === false) setError(json.error ?? 'Request failed')
        else setData(json)
        setLoading(false)
      })
      .catch((e) => {
        if (!active) return
        setError(e instanceof Error ? e.message : 'Request failed')
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [buildUrl, reloadToken])

  useEffect(() => {
    if (summaries.length === 0) return
    let active = true
    Promise.all(
      summaries.map(async (s) => {
        const url = s.query ? `${endpoint}?${s.query}&limit=1` : `${endpoint}?limit=1`
        const json = (await fetch(url).then((r) => r.json())) as ApiList<T>
        return [s.label, json.pagination?.total ?? 0] as const
      }),
    )
      .then((entries) => {
        if (active) setSummaryValues(Object.fromEntries(entries))
      })
      .catch(() => {
        if (active) setSummaryValues({})
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, JSON.stringify(summaries)])

  const applyFilters = (next: Record<string, string>) => {
    setFilterValues(next)
    setPage(1)
  }

  return (
    <PageShell title={title} subtitle={subtitle}>
      {summaries.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {summaries.map((s) => (
            <div key={s.label} className="glass rounded-3xl p-4 text-center">
              <p className="font-mono text-2xl font-bold text-neon-teal">{summaryValues[s.label] ?? '…'}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <Panel>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              setAppliedSearch(search)
              setPage(1)
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="glass h-10 rounded-2xl px-4 text-sm outline-none"
            />
            <button type="submit" className="glass glass-hover flex h-10 w-10 items-center justify-center rounded-2xl text-muted-foreground" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <select
                key={f.key}
                value={filterValues[f.key] ?? ''}
                onChange={(e) => applyFilters({ ...filterValues, [f.key]: e.target.value })}
                className="glass h-10 rounded-2xl px-3 text-sm"
                aria-label={f.label}
              >
                <option value="">{f.label}: All</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ))}
            <button type="button" onClick={() => setReloadToken((t) => t + 1)} className="glass glass-hover flex h-10 w-10 items-center justify-center rounded-2xl text-muted-foreground" aria-label="Refresh">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {loading && !data ? (
          <SkeletonPanel />
        ) : error ? (
          <p className="text-sm text-red-400">Error: {error}</p>
        ) : !data || data.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No records found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-muted-foreground">
                    {columns.map((c) => (
                      <th key={c.key} className="pb-2 pr-4">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((row) => {
                    const href = detailHref?.(row) ?? null
                    return (
                      <tr key={rowKey(row)} className="border-t border-border/60">
                        {columns.map((c) => (
                          <td key={c.key} className="py-2 pr-4">
                            {href && c.key === columns[0].key ? (
                              <Link href={href} className="text-neon-teal hover:underline">
                                {c.render ? c.render(row) : String(row[c.key] ?? '')}
                              </Link>
                            ) : c.render ? (
                              c.render(row)
                            ) : (
                              String(row[c.key] ?? '')
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Page {data.pagination.page} of {data.pagination.pages} · {data.pagination.total} total
              </span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="glass glass-hover flex h-8 w-8 items-center justify-center rounded-xl disabled:opacity-40" aria-label="Previous page">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button disabled={page >= data.pagination.pages} onClick={() => setPage((p) => p + 1)} className="glass glass-hover flex h-8 w-8 items-center justify-center rounded-xl disabled:opacity-40" aria-label="Next page">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </Panel>
    </PageShell>
  )
}
