import { type NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Device } from '@/lib/models/Device'
import { Asset } from '@/lib/models/Asset'
import { Store } from '@/lib/models/Store'

interface Params {
  params: Promise<{ deviceId: string }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { deviceId } = await params
    const device = await Device.findOne({ deviceId }).lean()
    if (!device) return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 })
    const [asset, store] = await Promise.all([
      Asset.findOne({ assetTag: device.assetId }).lean(),
      Store.findOne({ storeCode: device.storeCode }).lean(),
    ])
    return NextResponse.json({ success: true, data: { device, asset, store } })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Database error' }, { status: 503 })
  }
}

export const dynamic = 'force-dynamic'
