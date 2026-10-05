import { type NextRequest, NextResponse } from 'next/server'
import type { Model } from 'mongoose'
import { connectDB } from '@/lib/db'
import { buildFilter, dbErrorResponse, errorResponse, listResponse, parsePagination } from '@/lib/api-helpers'

interface CrudOptions<T> {
  model: Model<T>
  filterKeys: string[]
  sort?: Record<string, 1 | -1>
  requiredFields: string[]
  uniqueField?: string
  searchFields?: string[]
}

function buildQuery(sp: URLSearchParams, filterKeys: string[], searchFields: string[]) {
  const filter = buildFilter(sp, filterKeys) as Record<string, unknown>
  const search = sp.get('search')?.trim()
  if (search && searchFields.length > 0) {
    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    filter.$or = searchFields.map((f) => ({ [f]: { $regex: safe, $options: 'i' } }))
  }
  return filter
}

export function listOnly<T>(model: Model<T>, filterKeys: string[], sort: Record<string, 1 | -1> = {}, searchFields: string[] = []) {
  return {
    async GET(request: NextRequest) {
      try {
        await connectDB()
        const sp = request.nextUrl.searchParams
        const { page, limit, skip } = parsePagination(sp)
        const filter = buildQuery(sp, filterKeys, searchFields)
        const [data, total] = await Promise.all([
          model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
          model.countDocuments(filter),
        ])
        return listResponse(data, page, limit, total)
      } catch (err) {
        return dbErrorResponse(err)
      }
    },
  }
}

export function crud<T>({ model, filterKeys, sort = {}, requiredFields, uniqueField, searchFields = [] }: CrudOptions<T>) {
  return {
    async GET(request: NextRequest) {
      try {
        await connectDB()
        const sp = request.nextUrl.searchParams
        const { page, limit, skip } = parsePagination(sp)
        const filter = buildQuery(sp, filterKeys, searchFields)
        const [data, total] = await Promise.all([
          model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
          model.countDocuments(filter),
        ])
        return listResponse(data, page, limit, total)
      } catch (err) {
        return dbErrorResponse(err)
      }
    },
    async POST(request: NextRequest) {
      try {
        await connectDB()
        const body = await request.json().catch(() => null)
        if (!body || typeof body !== 'object') return errorResponse(400, 'Invalid JSON body')
        for (const f of requiredFields) {
          if (!(f in (body as Record<string, unknown>)) || (body as Record<string, unknown>)[f] === '') {
            return errorResponse(400, `Missing required field: ${f}`)
          }
        }
        const created = await model.create(body)
        return NextResponse.json({ success: true, data: created }, { status: 201 })
      } catch (err) {
        if (err instanceof Error && err.name === 'ValidationError') return errorResponse(400, err.message)
        if (err instanceof Error && 'code' in err && (err as { code?: number }).code === 11000) {
          return errorResponse(409, `${uniqueField ?? 'record'} already exists`)
        }
        return dbErrorResponse(err)
      }
    },
  }
}
