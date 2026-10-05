import { type NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'
import { verifyPassword } from '@/lib/auth/password'
import { signToken } from '@/lib/auth/jwt'
import { AUTH_COOKIE, authCookieOptions } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }
    const email = body.email.toLowerCase().trim()
    await connectDB()
    const user = await User.findOne({ email }).select('+passwordHash')
    const valid = user ? await verifyPassword(body.password, user.passwordHash) : false
    if (!user || !valid) {
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 })
    }
    if (user.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, error: 'Account is disabled.' }, { status: 403 })
    }
    const token = await signToken({ userId: String(user._id), email: user.email, role: user.role })
    user.lastLogin = new Date()
    await user.save()
    const res = NextResponse.json({
      success: true,
      data: { user: { id: String(user._id), name: user.name, email: user.email, role: user.role } },
    })
    res.cookies.set(AUTH_COOKIE, token, authCookieOptions())
    return res
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Login failed' }, { status: 503 })
  }
}

export const dynamic = 'force-dynamic'
