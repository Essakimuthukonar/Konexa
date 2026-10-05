import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthenticated' }, { status: 401 })
  return NextResponse.json({ success: true, data: { user } })
}

export const dynamic = 'force-dynamic'
