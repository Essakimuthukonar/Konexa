import { NextResponse } from 'next/server'

export function parsePagination(searchParams: URLSearchParams): { page: number; limit: number; skip: number } {
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get('limit') ?? '20', 10) || 20))
  return { page, limit, skip: (page - 1) * limit }
}

export function listResponse<T>(data: T[], page: number, limit: number, total: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

export function errorResponse(status: number, message: string) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function dbErrorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : 'Database error'
  return errorResponse(503, message)
}

export function buildFilter(searchParams: URLSearchParams, allowed: string[]): Record<string, string> {
  const filter: Record<string, string> = {}
  for (const key of allowed) {
    const v = searchParams.get(key)
    if (v) filter[key] = v
  }
  return filter
}
