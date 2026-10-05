import mongoose, { Schema, type Model, type Types } from 'mongoose'

export const ASSET_TYPES = [
  'Lenovo Tablet',
  'Lava Mobile',
  'Samsung Mobile',
  'POS',
  'PC',
  'Router',
  'Printer',
  'Server',
  'Other',
] as const

export type AssetType = (typeof ASSET_TYPES)[number]

export interface IAsset {
  assetTag: string
  serialNumber: string
  storeCode: string
  location: string
  manufacturer: string
  type: AssetType
  model: string
  status: 'ACTIVE' | 'INACTIVE' | 'IN_REPAIR' | 'RETIRED'
  assignedTo: string
  purchaseDate: Date
  lastSeen: Date
  createdAt: Date
  updatedAt: Date
}

const AssetSchema = new Schema<IAsset>(
  {
    assetTag: { type: String, required: true, unique: true, index: true },
    serialNumber: { type: String, required: true, index: true },
    storeCode: { type: String, required: true, index: true },
    location: { type: String, required: true },
    manufacturer: { type: String, required: true },
    type: { type: String, enum: ASSET_TYPES, required: true, index: true },
    model: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'IN_REPAIR', 'RETIRED'], default: 'ACTIVE', index: true },
    assignedTo: { type: String, default: '' },
    purchaseDate: { type: Date, default: () => new Date() },
    lastSeen: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
)

export type AssetDoc = IAsset & { _id: Types.ObjectId }
export const Asset: Model<IAsset> = mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema)
