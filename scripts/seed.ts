
/**
 * Konexa development seed.
 *
 * Usage:
 *   npm run seed              # insert data only if collections are empty
 *   npm run seed -- --reset   # explicitly clear collections first
 *
 * Deterministic (seeded PRNG).
 */

import mongoose from 'mongoose'
import { User } from '../lib/models/User'
import { hashPassword } from '../lib/auth/password'
import { Store } from '../lib/models/Store'
import { Asset, ASSET_TYPES } from '../lib/models/Asset'
import { Device } from '../lib/models/Device'
import { Incident } from '../lib/models/Incident'
import { Alert } from '../lib/models/Alert'
import { Network } from '../lib/models/Network'
import { Backup } from '../lib/models/Backup'
import { Infrastructure } from '../lib/models/Infrastructure'
import { Application } from '../lib/models/Application'
import { Deployment } from '../lib/models/Deployment'
import { Log } from '../lib/models/Log'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'konexa'
const RESET = process.argv.includes('--reset')

function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(42)

const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(rand() * arr.length)]

const chance = (p: number) => rand() < p

const CITIES: Array<[string, string]> = [
  ['Chennai', 'Tamil Nadu'],
  ['Mumbai', 'Maharashtra'],
  ['Delhi', 'Delhi'],
  ['Bengaluru', 'Karnataka'],
  ['Hyderabad', 'Telangana'],
  ['Kolkata', 'West Bengal'],
  ['Pune', 'Maharashtra'],
  ['Ahmedabad', 'Gujarat'],
  ['Jaipur', 'Rajasthan'],
  ['Lucknow', 'Uttar Pradesh'],
]

const STATUSES = [
  'ACTIVE',
  'ACTIVE',
  'ACTIVE',
  'ACTIVE',
  'INACTIVE',
  'UNDER_MAINTENANCE',
] as const

const NET = [
  'ONLINE',
  'ONLINE',
  'ONLINE',
  'DEGRADED',
  'OFFLINE',
] as const

async function main() {
  if (!MONGODB_URI) {
    console.error(
      'MONGODB_URI is not set. Example: mongodb://localhost:27017/konexa',
    )
    process.exit(1)
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB_NAME,
  })

  console.log(`Connected to ${MONGODB_DB_NAME}`)

  // ---------------------------------------------------------
  // Ensure admin user exists BEFORE the 450-store early exit
  // ---------------------------------------------------------

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase().trim()
  const adminPassword = process.env.SEED_ADMIN_PASSWORD

  if (adminEmail && adminPassword) {
    const existingAdmin = await User.findOne({
      email: adminEmail,
    })

    if (!existingAdmin) {
      const passwordHash = await hashPassword(adminPassword)

      await User.create({
        name: 'Konexa Administrator',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        status: 'ACTIVE',
      })

      console.log(`Admin user created: ${adminEmail}`)
    } else {
      console.log(`Admin user already exists: ${adminEmail}`)
    }
  } else {
    console.log(
      'SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD is not set; skipping admin user.',
    )
  }

  // ---------------------------------------------------------
  // Existing reset / 450-store protection
  // ---------------------------------------------------------

  if (RESET) {
    await Promise.all([
      Store.deleteMany({}),
      Asset.deleteMany({}),
      Device.deleteMany({}),
      Incident.deleteMany({}),
      Alert.deleteMany({}),
      Network.deleteMany({}),
      Backup.deleteMany({}),
      Infrastructure.deleteMany({}),
      Application.deleteMany({}),
      Deployment.deleteMany({}),
      Log.deleteMany({}),
    ])

    console.log('Reset: cleared existing collections.')
  } else {
    const existing = await Store.estimatedDocumentCount()

    if (existing > 0) {
      console.log(
        `Database already has ${existing} stores. Use --reset to reseed.`,
      )

      await mongoose.disconnect()
      return
    }
  }

  // ---------------------------------------------------------
  // Stores
  // ---------------------------------------------------------

  interface StoreSeed {
    storeCode: string
    storeName: string
    location: string
    city: string
    state: string
    status: (typeof STATUSES)[number]
    networkStatus: (typeof NET)[number]
    internetStatus: (typeof NET)[number]
    deviceHealth: number
    assetCount: number
    lastChecked: Date
  }

  const stores: StoreSeed[] = []

  for (let i = 1; i <= 450; i++) {
    const [city, state] = pick(CITIES)

    stores.push({
      storeCode: `STR-${String(i).padStart(4, '0')}`,
      storeName: `Store ${String(i).padStart(3, '0')}`,
      location: `${city} Mall ${(i % 9) + 1}`,
      city,
      state,
      status: pick(STATUSES),
      networkStatus: pick(NET),
      internetStatus: pick(NET),
      deviceHealth: Math.floor(rand() * 41) + 60,
      assetCount: 0,
      lastChecked: new Date(
        Date.now() - rand() * 86_400_000,
      ),
    })
  }

  await Store.insertMany(stores)

  console.log(`Stores seeded: ${stores.length}`)

  // ---------------------------------------------------------
  // Assets
  // ---------------------------------------------------------

  const manufacturers: Record<string, string[]> = {
    Tablet: ['Lenovo'],
    Mobile: ['Lava', 'Samsung'],
    Laptop: ['Dell', 'HP', 'Lenovo'],
    Desktop: ['Dell', 'HP', 'Lenovo'],
    Router: ['Cisco', 'TP-Link', 'MikroTik'],
    Other: ['Generic'],
  }

  const assets = []

  for (let i = 1; i <= 3165; i++) {
    const type = pick(ASSET_TYPES)
    const store = stores[Math.floor(rand() * stores.length)]

    assets.push({
      assetTag: `AST-${String(i).padStart(5, '0')}`,
      serialNumber: `SN${(10000000 + i).toString(36).toUpperCase()}`,
      name: `${type} Asset ${String(i).padStart(5, '0')}`,
      storeCode: store.storeCode,
      storeName: store.storeName,
      manufacturer: pick(manufacturers[type]),
      type,
      model: `${type} Model ${(i % 7) + 1}`,
      status: chance(0.9)
        ? 'Active'
        : chance(0.5)
          ? 'Repair'
          : 'Missing',
      locationType: 'Store',
      assignedTo: chance(0.7)
        ? `Staff ${(i % 500) + 1}`
        : '',
      purchaseDate: new Date(
        Date.now() - rand() * 3 * 365 * 86_400_000,
      ),
      notes: '',
    })
  }

  await Asset.insertMany(assets)

  console.log(`Assets seeded: ${assets.length}`)

  // ---------------------------------------------------------
  // Update store asset counts
  // ---------------------------------------------------------

  const counts = await Asset.aggregate<{
    _id: string
    count: number
  }>([
    {
      $group: {
        _id: '$storeCode',
        count: { $sum: 1 },
      },
    },
  ])

  await Promise.all(
    counts.map((c) =>
      Store.updateOne(
        { storeCode: c._id },
        {
          $set: {
            assetCount: c.count,
          },
        },
      ),
    ),
  )

  console.log('Store assetCount updated')

  // ---------------------------------------------------------
  // Devices
  // ---------------------------------------------------------

  const devices = assets.map((a, i) => ({
    deviceId: `DEV-${String(i + 1).padStart(5, '0')}`,
    assetId: a.assetTag,
    storeCode: a.storeCode,

    deviceType:
      a.type === 'Tablet'
        ? 'TABLET'
        : a.type === 'Mobile'
          ? 'MOBILE'
          : a.type === 'Other'
            ? 'OTHER'
            : a.type === 'Laptop' || a.type === 'Desktop'
              ? 'PC'
              : (a.type.toUpperCase() as
                  | 'POS'
                  | 'PC'
                  | 'ROUTER'
                  | 'PRINTER'
                  | 'SERVER'
                  | 'OTHER'),

    manufacturer: a.manufacturer,
    model: a.model,
    serialNumber: a.serialNumber,

    status: chance(0.9)
      ? 'ONLINE'
      : chance(0.5)
        ? 'DEGRADED'
        : 'OFFLINE',

    health: Math.floor(rand() * 41) + 60,
    battery: Math.floor(rand() * 101),

    lastSeen: new Date(
      Date.now() - rand() * 86_400_000,
    ),

    ipAddress: `10.${Math.floor(rand() * 255)}.${Math.floor(
      rand() * 255,
    )}.${Math.floor(rand() * 255)}`,

    osVersion: chance(0.5)
      ? 'Android 14'
      : chance(0.5)
        ? 'Windows 11'
        : 'RouterOS 7',

    mdmStatus: chance(0.8)
      ? 'ENROLLED'
      : chance(0.5)
        ? 'UNENROLLED'
        : 'NON_COMPLIANT',
  }))

  await Device.insertMany(devices)

  console.log(`Devices seeded: ${devices.length}`)

  // ---------------------------------------------------------
  // Incidents
  // ---------------------------------------------------------

  const incidents = Array.from(
    { length: 120 },
    (_, i) => ({
      incidentId: `INC-${String(i + 1).padStart(4, '0')}`,
      storeCode: pick(stores).storeCode,
      category: pick([
        'HARDWARE',
        'NETWORK',
        'SOFTWARE',
        'POWER',
        'SECURITY',
        'OTHER',
      ] as const),
      priority: pick([
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL',
      ] as const),
      title: `Incident ${i + 1}`,
      description:
        'Synthetic incident generated for demo purposes.',
      status: pick([
        'OPEN',
        'IN_PROGRESS',
        'RESOLVED',
        'CLOSED',
      ] as const),
      assignedTo: `Engineer ${(i % 12) + 1}`,
    }),
  )

  await Incident.insertMany(incidents)

  console.log(`Incidents seeded: ${incidents.length}`)

  // ---------------------------------------------------------
  // Alerts
  // ---------------------------------------------------------

  const alerts = Array.from(
    { length: 200 },
    (_, i) => ({
      alertId: `ALT-${String(i + 1).padStart(4, '0')}`,
      source: pick([
        'monitoring',
        'mdm',
        'network',
        'backup',
      ] as const),
      storeCode: pick(stores).storeCode,
      severity: pick([
        'INFO',
        'WARNING',
        'ERROR',
        'CRITICAL',
      ] as const),
      title: `Alert ${i + 1}`,
      message:
        'Synthetic alert generated for demo purposes.',
      status: pick([
        'ACTIVE',
        'ACKNOWLEDGED',
        'RESOLVED',
      ] as const),
    }),
  )

  await Alert.insertMany(alerts)

  console.log(`Alerts seeded: ${alerts.length}`)

  // ---------------------------------------------------------
  // Network
  // ---------------------------------------------------------

  await Network.insertMany(
    stores.map((s) => ({
      storeCode: s.storeCode,
      router: `RTR-${s.storeCode}`,
      wanStatus: chance(0.9)
        ? 'UP'
        : 'DEGRADED',
      lanStatus: 'UP',
      internetStatus: chance(0.9)
        ? 'UP'
        : 'DEGRADED',
      latency: Math.floor(rand() * 120) + 5,
      packetLoss: Math.floor(rand() * 10),
      publicIp: `203.0.${Math.floor(
        rand() * 255,
      )}.${Math.floor(rand() * 255)}`,
    })),
  )

  console.log('Network records seeded: 450')

  // ---------------------------------------------------------
  // Backups
  // ---------------------------------------------------------

  await Backup.insertMany(
    Array.from({ length: 60 }, (_, i) => ({
      backupId: `BKP-${String(i + 1).padStart(4, '0')}`,
      source: pick([
        'stores-db',
        'pos-db',
        'erp-db',
      ] as const),
      type: pick([
        'FULL',
        'INCREMENTAL',
        'DIFFERENTIAL',
      ] as const),
      status: chance(0.85)
        ? 'COMPLETED'
        : chance(0.5)
          ? 'FAILED'
          : 'RUNNING',
      size: `${(rand() * 40 + 1).toFixed(1)} GB`,
      startedAt: new Date(
        Date.now() - rand() * 7 * 86_400_000,
      ),
      duration: `${Math.floor(rand() * 50) + 2}m`,
      errorMessage: chance(0.85)
        ? ''
        : 'Synthetic backup failure for demo.',
    })),
  )

  console.log('Backups seeded: 60')

  // ---------------------------------------------------------
  // Infrastructure
  // ---------------------------------------------------------

  await Infrastructure.insertMany(
    Array.from({ length: 12 }, (_, i) => ({
      name: `node-${i + 1}`,
      environment: pick([
        'PRODUCTION',
        'STAGING',
        'DEVELOPMENT',
      ] as const),
      provider: 'AWS',
      region: pick([
        'ap-south-1',
        'us-east-1',
        'eu-west-2',
      ] as const),
      status: chance(0.9)
        ? 'ONLINE'
        : 'DEGRADED',
      cpu: Math.floor(rand() * 80) + 10,
      memory: Math.floor(rand() * 80) + 10,
      storage: Math.floor(rand() * 80) + 10,
    })),
  )

  console.log('Infrastructure seeded: 12')

  // ---------------------------------------------------------
  // Applications
  // ---------------------------------------------------------

  await Application.insertMany(
    Array.from({ length: 15 }, (_, i) => ({
      name: `service-${i + 1}`,
      environment: pick([
        'PRODUCTION',
        'STAGING',
        'DEVELOPMENT',
      ] as const),
      version: `1.${i}.0`,
      status: chance(0.9)
        ? 'RUNNING'
        : 'DEPLOYING',
      repository: `konexa/service-${i + 1}`,
      deploymentStatus: 'SUCCESS',
      lastDeployment: new Date(
        Date.now() - rand() * 30 * 86_400_000,
      ),
    })),
  )

  console.log('Applications seeded: 15')

  // ---------------------------------------------------------
  // Deployments
  // ---------------------------------------------------------

  await Deployment.insertMany(
    Array.from({ length: 80 }, (_, i) => ({
      application: `service-${(i % 15) + 1}`,
      version: `1.${i % 15}.${Math.floor(i / 15)}`,
      environment: pick([
        'PRODUCTION',
        'STAGING',
        'DEVELOPMENT',
      ] as const),
      status: chance(0.85)
        ? 'SUCCESS'
        : 'FAILED',
      branch: 'main',
      commit: (
        (i * 2654435761) %
        0xffffffff
      )
        .toString(16)
        .padStart(8, '0'),
      buildNumber: 1000 + i,
      deployedAt: new Date(
        Date.now() - rand() * 30 * 86_400_000,
      ),
      deployedBy: 'ci@konexa',
      duration: `${Math.floor(rand() * 20) + 1}m ${Math.floor(
        rand() * 60,
      )}s`,
    })),
  )

  console.log('Deployments seeded: 80')

  // ---------------------------------------------------------
  // Logs
  // ---------------------------------------------------------

  await Log.insertMany(
    Array.from({ length: 300 }, (_, i) => ({
      timestamp: new Date(
        Date.now() - rand() * 7 * 86_400_000,
      ),
      level: pick([
        'INFO',
        'INFO',
        'WARNING',
        'ERROR',
        'DEBUG',
      ] as const),
      source: pick([
        'app',
        'jenkins',
        'agent',
        'backup-cron',
      ] as const),
      service: `service-${(i % 15) + 1}`,
      message: `Synthetic log entry ${i + 1}`,
      environment: pick([
        'PRODUCTION',
        'STAGING',
        'DEVELOPMENT',
      ] as const),
    })),
  )

  console.log('Logs seeded: 300')
  console.log('DevOps demo data seeded.')

  await mongoose.disconnect()

  console.log('Seed complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

