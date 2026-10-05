import mongoose, { Schema, type Model, type Types } from 'mongoose'

export interface IAlert {
  alertId: string
  source: string
  storeCode: string
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  title: string
  message: string
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'
  createdAt: Date
  resolvedAt?: Date
}

const AlertSchema = new Schema<IAlert>(
  {
    alertId: { type: String, required: true, unique: true, index: true },
    source: { type: String, required: true },
    storeCode: { type: String, required: true, index: true },
    severity: { type: String, enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'], required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    status: { type: String, enum: ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'], default: 'ACTIVE', index: true },
    resolvedAt: { type: Date },
  },
  { timestamps: true },
)

export type AlertDoc = IAlert & { _id: Types.ObjectId }
export const Alert: Model<IAlert> = mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema)
