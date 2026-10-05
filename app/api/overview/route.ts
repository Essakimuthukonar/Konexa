import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Store } from '@/lib/models/Store'
import { Asset } from '@/lib/models/Asset'
import { Device } from '@/lib/models/Device'
import { Incident } from '@/lib/models/Incident'
import { Alert } from '@/lib/models/Alert'
import { Backup } from '@/lib/models/Backup'
import { Deployment } from '@/lib/models/Deployment'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()
    const [stores, assets, devices, openIncidents, activeAlerts, onlineStores, offlineStores, degradedStores, backupsFailed, backupsCompleted, deploysSucceeded, deploysFailed] =
      await Promise.all([
        Store.countDocuments(),
        Asset.countDocuments(),
        Device.countDocuments(),
        Incident.countDocuments({ status: { $in: ['OPEN', 'IN_PROGRESS'] } }),
        Alert.countDocuments({ status: 'ACTIVE' }),
        Store.countDocuments({ networkStatus: 'ONLINE' }),
        Store.countDocuments({ networkStatus: 'OFFLINE' }),
        Store.countDocuments({ networkStatus: 'DEGRADED' }),
        Backup.countDocuments({ status: 'FAILED' }),
        Backup.countDocuments({ status: 'COMPLETED' }),
        Deployment.countDocuments({ status: 'SUCCESS' }),
        Deployment.countDocuments({ status: 'FAILED' }),
      ])
    return NextResponse.json({
      success: true,
      data: { stores, assets, devices, openIncidents, activeAlerts, onlineStores, offlineStores, degradedStores, backupsFailed, backupsCompleted, deploysSucceeded, deploysFailed },
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database error'
    return NextResponse.json({ success: false, error: message }, { status: 503 })
  }
}
