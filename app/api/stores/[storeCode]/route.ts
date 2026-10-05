import { type NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Store } from '@/lib/models/Store'
import { Asset } from '@/lib/models/Asset'
import { Device } from '@/lib/models/Device'
import { Network } from '@/lib/models/Network'
import { Incident } from '@/lib/models/Incident'
import { Alert } from '@/lib/models/Alert'

interface Params {
  params: Promise<{ storeCode: string }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { storeCode } = await params
    const store = await Store.findOne({ storeCode }).lean()
    if (!store) return NextResponse.json({ success: false, error: 'Store not found' }, { status: 404 })
    const [assets, devices, network, incidents, alerts, assetCount, deviceCount, openIncidents, activeAlerts] =
      await Promise.all([
        Asset.find({ storeCode }).limit(50).lean(),
        Device.find({ storeCode }).limit(50).lean(),
        Network.findOne({ storeCode }).lean(),
        Incident.find({ storeCode }).sort({ createdAt: -1 }).limit(20).lean(),
        Alert.find({ storeCode }).sort({ createdAt: -1 }).limit(20).lean(),
        Asset.countDocuments({ storeCode }),
        Device.countDocuments({ storeCode }),
        Incident.countDocuments({ storeCode, status: { $in: ['OPEN', 'IN_PROGRESS'] } }),
        Alert.countDocuments({ storeCode, status: 'ACTIVE' }),
      ])
    return NextResponse.json({
      success: true,
      data: { store, network, assets, devices, incidents, alerts, summary: { assetCount, deviceCount, openIncidents, activeAlerts } },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Database error' }, { status: 503 })
  }
}

export const dynamic = 'force-dynamic'
