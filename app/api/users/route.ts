import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User, ROLES } from '@/lib/models/User'
import { hashPassword } from '@/lib/auth/password'
import { getCurrentUser } from '@/lib/auth/session'

export async function GET() {
  const current = await getCurrentUser()
  if (!current) return NextResponse.json({ success: false, error: 'Unauthenticated' }, { status: 401 })
  if (current.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  await connectDB()
  const users = await User.find({}, { passwordHash: 0 }).lean()
  return NextResponse.json({ success: true, data: users })
}

export async function POST(request: NextRequest) {
  const current = await getCurrentUser()
  if (!current) return NextResponse.json({ success: false, error: 'Unauthenticated' }, { status: 401 })
  if (current.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  const body = await request.json().catch(() => null)
  if (!body || typeof body.name !== 'string' || typeof body.email !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ success: false, error: 'name, email and password are required' }, { status: 400 })
  }
  if (!ROLES.includes(body.role)) {
    return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 })
  }
  await connectDB()
  const exists = await User.findOne({ email: body.email.toLowerCase().trim() })
  if (exists) return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 409 })
  const passwordHash = await hashPassword(body.password)
  const created = await User.create({ name: body.name, email: body.email, passwordHash, role: body.role, status: 'ACTIVE' })
  return NextResponse.json({ success: true, data: { id: String(created._id), name: created.name, email: created.email, role: created.role } }, { status: 201 })
}

export const dynamic = 'force-dynamic'
