import { type NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Incident } from '@/lib/models/Incident'
import { Store } from '@/lib/models/Store'

interface Params {
  params: Promise<{ incidentId: string }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { incidentId } = await params
    const incident = await Incident.findOne({ incidentId }).lean()
    if (!incident) return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 })
    const store = await Store.findOne({ storeCode: incident.storeCode }).lean()
    return NextResponse.json({ success: true, data: { incident, store } })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Database error' }, { status: 503 })
  }
}

export const dynamic = 'force-dynamic'
