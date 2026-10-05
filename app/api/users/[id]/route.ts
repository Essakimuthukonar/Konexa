import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User, ROLES } from '@/lib/models/User'
import { getCurrentUser } from '@/lib/auth/session'

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const current = await getCurrentUser()
  if (!current) return NextResponse.json({ success: false, error: 'Unauthenticated' }, { status: 401 })
  if (current.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ success: false, error: 'Invalid body' }, { status: 400 })
  const update: Record<string, unknown> = {}
  if (typeof body.role === 'string' && ROLES.includes(body.role)) update.role = body.role
  if (body.status === 'ACTIVE' || body.status === 'DISABLED') update.status = body.status
  if (typeof body.name === 'string' && body.name.trim()) update.name = body.name
  if (Object.keys(update).length === 0) return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 })
  await connectDB()
  const user = await User.findByIdAndUpdate(id, update, { new: true, projection: { passwordHash: 0 } }).lean()
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: user })
}

export const dynamic = 'force-dynamic'
