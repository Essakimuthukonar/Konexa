import mongoose, { Schema, type Model, type Types } from 'mongoose'

export interface ILog {
  timestamp: Date
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG'
  source: string
  service: string
  message: string
  environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT'
  createdAt: Date
  updatedAt: Date
}

const LogSchema = new Schema<ILog>(
  {
    timestamp: { type: Date, default: () => new Date(), index: true },
    level: { type: String, enum: ['INFO', 'WARNING', 'ERROR', 'DEBUG'], default: 'INFO', index: true },
    source: { type: String, default: '' },
    service: { type: String, required: true, index: true },
    message: { type: String, required: true },
    environment: { type: String, enum: ['PRODUCTION', 'STAGING', 'DEVELOPMENT'], default: 'PRODUCTION' },
  },
  { timestamps: true },
)

export type LogDoc = ILog & { _id: Types.ObjectId }
export const Log: Model<ILog> = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema)
