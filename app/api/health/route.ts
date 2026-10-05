import { NextResponse } from 'next/server'
import { getDatabaseStatus } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const database = await getDatabaseStatus()
  return NextResponse.json({
    status: database === 'connected' ? 'ok' : 'degraded',
    database,
    timestamp: new Date().toISOString(),
  })
}
