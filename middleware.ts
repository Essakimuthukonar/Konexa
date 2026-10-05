import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

const PROTECTED_PAGES = [
  '/overview',
  '/stores',
  '/assets',
  '/devices',
  '/incidents',
  '/alerts',
  '/network',
  '/backups',
  '/infrastructure',
  '/applications',
  '/deployments',
  '/monitoring',
  '/logs',
  '/settings',
  '/about',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('konexa_token')?.value
  const payload = token ? await verifyToken(token) : null

  if (pathname.startsWith('/api')) {
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthenticated' }, { status: 401 })
    }
    return NextResponse.next()
  }

  const isProtected = PROTECTED_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  if (isProtected && !payload) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (pathname === '/login' && payload) {
    const url = request.nextUrl.clone()
    url.pathname = '/overview'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
