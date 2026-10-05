import { cookies } from 'next/headers'
import { User } from '@/lib/models/User'
import { connectDB } from '@/lib/db'
import { verifyToken } from './jwt'

export const AUTH_COOKIE = 'konexa_token'

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  }
}

export async function getCurrentUser() {
  try {
    const store = await cookies()
    const token = store.get(AUTH_COOKIE)?.value
    if (!token) return null
    const payload = await verifyToken(token)
    if (!payload) return null
    await connectDB()
    const user = await User.findById(payload.userId).lean()
    if (!user || user.status !== 'ACTIVE') return null
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch {
    return null
  }
}
