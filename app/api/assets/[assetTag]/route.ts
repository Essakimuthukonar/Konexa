import { type NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Asset } from '@/lib/models/Asset'
import { Device } from '@/lib/models/Device'
import { Store } from '@/lib/models/Store'

interface Params {
  params: Promise<{ assetTag: string }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { assetTag } = await params
    const asset = await Asset.findOne({ assetTag }).lean()
    if (!asset) return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 })
    const [device, store] = await Promise.all([
      Device.findOne({ assetId: asset.assetTag }).lean(),
      Store.findOne({ storeCode: asset.storeCode }).lean(),
    ])
    return NextResponse.json({ success: true, data: { asset, device, store } })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Database error' }, { status: 503 })
  }
}

export const dynamic = 'force-dynamic'
