import mongoose, { Schema, type Model, type Types } from 'mongoose'

export interface IStore {
  storeCode: string
  storeName: string
  location: string
  city: string
  state: string
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE'
  networkStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED'
  internetStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED'
  deviceHealth: number
  assetCount: number
  lastChecked: Date
  createdAt: Date
  updatedAt: Date
}

const StoreSchema = new Schema<IStore>(
  {
    storeCode: { type: String, required: true, unique: true, index: true },
    storeName: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE'], default: 'ACTIVE', index: true },
    networkStatus: { type: String, enum: ['ONLINE', 'OFFLINE', 'DEGRADED'], default: 'ONLINE' },
    internetStatus: { type: String, enum: ['ONLINE', 'OFFLINE', 'DEGRADED'], default: 'ONLINE' },
    deviceHealth: { type: Number, min: 0, max: 100, default: 100 },
    assetCount: { type: Number, default: 0 },
    lastChecked: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
)

export type StoreDoc = IStore & { _id: Types.ObjectId }
export const Store: Model<IStore> = mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema)
