import mongoose, { Schema, type Model, type Types } from 'mongoose'

export interface IInfrastructure {
  name: string
  environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT'
  provider: 'AWS' | 'AZURE' | 'GCP' | 'ON_PREM'
  region: string
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE'
  cpu: number
  memory: number
  storage: number
  createdAt: Date
  updatedAt: Date
}

const InfrastructureSchema = new Schema<IInfrastructure>(
  {
    name: { type: String, required: true, index: true },
    environment: { type: String, enum: ['PRODUCTION', 'STAGING', 'DEVELOPMENT'], required: true, index: true },
    provider: { type: String, enum: ['AWS', 'AZURE', 'GCP', 'ON_PREM'], default: 'AWS' },
    region: { type: String, required: true },
    status: { type: String, enum: ['ONLINE', 'DEGRADED', 'OFFLINE'], default: 'ONLINE', index: true },
    cpu: { type: Number, min: 0, max: 100, default: 0 },
    memory: { type: Number, min: 0, max: 100, default: 0 },
    storage: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true },
)

export type InfrastructureDoc = IInfrastructure & { _id: Types.ObjectId }
export const Infrastructure: Model<IInfrastructure> =
  mongoose.models.Infrastructure || mongoose.model<IInfrastructure>('Infrastructure', InfrastructureSchema)
