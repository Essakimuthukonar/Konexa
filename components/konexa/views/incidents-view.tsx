'use client'

import { useState } from 'react'
import { ModuleList } from '../module-list'

interface IncidentRow extends Record<string, unknown> {
  incidentId: string
  storeCode: string
  category: string
  priority: string
  title: string
  status: string
  assignedTo: string
  createdAt: string
  updatedAt: string
}

const CATEGORIES = ['HARDWARE', 'NETWORK', 'SOFTWARE', 'POWER', 'SECURITY', 'OTHER']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

function IncidentForm() {
  const [form, setForm] = useState(() => ({
    incidentId: `INC-${Date.now().toString().slice(-5)}`,
    storeCode: '',
    category: 'NETWORK',
    priority: 'MEDIUM',
    title: '',
    description: '',
    status: 'OPEN',
    assignedTo: '',
  }))
  const [result, setResult] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    setResult(json.success ? 'Incident created.' : `Error: ${json.error}`)
  }

  return (
    <form onSubmit={submit} className="glass rounded-3xl p-5">
      <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-[0.15em]">Create Incident</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-mono uppercase tracking-widest text-muted-foreground">Incident ID</span>
          <input value={form.incidentId} onChange={(e) => setForm({ ...form, incidentId: e.target.value })} required className="glass h-10 rounded-xl px-3 text-sm outline-none" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-mono uppercase tracking-widest text-muted-foreground">Store Code</span>
          <input value={form.storeCode} onChange={(e) => setForm({ ...form, storeCode: e.target.value })} required className="glass h-10 rounded-xl px-3 text-sm outline-none" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-mono uppercase tracking-widest text-muted-foreground">Title</span>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="glass h-10 rounded-xl px-3 text-sm outline-none" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-mono uppercase tracking-widest text-muted-foreground">Assigned To</span>
          <input value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="glass h-10 rounded-xl px-3 text-sm outline-none" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-mono uppercase tracking-widest text-muted-foreground">Category</span>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="glass h-10 rounded-xl px-3 text-sm">
            {CATEGORIES.map((o) => (<option key={o}>{o}</option>))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-mono uppercase tracking-widest text-muted-foreground">Priority</span>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="glass h-10 rounded-xl px-3 text-sm">
            {PRIORITIES.map((o) => (<option key={o}>{o}</option>))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-mono uppercase tracking-widest text-muted-foreground">Status</span>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="glass h-10 rounded-xl px-3 text-sm">
            {STATUSES.map((o) => (<option key={o}>{o}</option>))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs sm:col-span-2">
          <span className="font-mono uppercase tracking-widest text-muted-foreground">Description</span>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="glass h-10 rounded-xl px-3 text-sm outline-none" />
        </label>
      </div>
      <button type="submit" className="glass glass-hover mt-4 h-10 rounded-2xl px-6 text-sm">Create</button>
      {result && <p className="mt-3 text-sm text-neon-teal">{result}</p>}
    </form>
  )
}

export function IncidentsView() {
  return (
    <div className="flex flex-col gap-6">
      <IncidentForm />
      <ModuleList<IncidentRow>
        title="Incidents"
        subtitle="Active incident operations"
        endpoint="/api/incidents"
        searchPlaceholder="Search incident id, title, store..."
        rowKey={(r) => r.incidentId}
        detailHref={(r) => `/incidents/${r.incidentId}`}
        filters={[
          { key: 'priority', label: 'Priority', options: PRIORITIES },
          { key: 'status', label: 'Status', options: STATUSES },
          { key: 'category', label: 'Category', options: CATEGORIES },
        ]}
        columns={[
          { key: 'incidentId', label: 'ID' },
          { key: 'storeCode', label: 'Store' },
          { key: 'category', label: 'Category' },
          { key: 'priority', label: 'Priority' },
          { key: 'title', label: 'Title' },
          { key: 'status', label: 'Status' },
          { key: 'assignedTo', label: 'Assigned' },
          { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() },
        ]}
      />
    </div>
  )
}
