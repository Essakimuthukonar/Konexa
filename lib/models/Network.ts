import mongoose, { Schema, type Model, type Types } from 'mongoose'

export interface INetwork {
  storeCode: string
  router: string
  wanStatus: 'UP' | 'DOWN' | 'DEGRADED'
  lanStatus: 'UP' | 'DOWN' | 'DEGRADED'
  internetStatus: 'UP' | 'DOWN' | 'DEGRADED'
  latency: number
  packetLoss: number
  publicIp: string
  lastChecked: Date
  createdAt: Date
  updatedAt: Date
}

const NetworkSchema = new Schema<INetwork>(
  {
    storeCode: { type: String, required: true, unique: true, index: true },
    router: { type: String, required: true },
    wanStatus: { type: String, enum: ['UP', 'DOWN', 'DEGRADED'], default: 'UP' },
    lanStatus: { type: String, enum: ['UP', 'DOWN', 'DEGRADED'], default: 'UP' },
    internetStatus: { type: String, enum: ['UP', 'DOWN', 'DEGRADED'], default: 'UP' },
    latency: { type: Number, default: 0 },
    packetLoss: { type: Number, default: 0 },
    publicIp: { type: String, default: '' },
    lastChecked: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
)

export type NetworkDoc = INetwork & { _id: Types.ObjectId }
export const Network: Model<INetwork> = mongoose.models.Network || mongoose.model<INetwork>('Network', NetworkSchema)
