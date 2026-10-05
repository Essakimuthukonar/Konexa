import mongoose, { Schema, type Model, type Types } from 'mongoose'

export interface IDevice {
  deviceId: string
  assetId: string
  storeCode: string
  deviceType: 'TABLET' | 'MOBILE' | 'POS' | 'PC' | 'ROUTER' | 'PRINTER' | 'SERVER' | 'OTHER'
  manufacturer: string
  model: string
  serialNumber: string
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED'
  health: number
  battery: number
  lastSeen: Date
  ipAddress: string
  osVersion: string
  mdmStatus: 'ENROLLED' | 'UNENROLLED' | 'NON_COMPLIANT'
  createdAt: Date
  updatedAt: Date
}

const DeviceSchema = new Schema<IDevice>(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    assetId: { type: String, required: true, index: true },
    storeCode: { type: String, required: true, index: true },
    deviceType: { type: String, enum: ['TABLET', 'MOBILE', 'POS', 'PC', 'ROUTER', 'PRINTER', 'SERVER', 'OTHER'], required: true },
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    serialNumber: { type: String, required: true },
    status: { type: String, enum: ['ONLINE', 'OFFLINE', 'DEGRADED'], default: 'ONLINE', index: true },
    health: { type: Number, min: 0, max: 100, default: 100 },
    battery: { type: Number, min: 0, max: 100, default: 100 },
    lastSeen: { type: Date, default: () => new Date() },
    ipAddress: { type: String, default: '' },
    osVersion: { type: String, default: '' },
    mdmStatus: { type: String, enum: ['ENROLLED', 'UNENROLLED', 'NON_COMPLIANT'], default: 'ENROLLED' },
  },
  { timestamps: true },
)

export type DeviceDoc = IDevice & { _id: Types.ObjectId }
export const Device: Model<IDevice> = mongoose.models.Device || mongoose.model<IDevice>('Device', DeviceSchema)
