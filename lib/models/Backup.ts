import mongoose, { Schema, type Model, type Types } from 'mongoose'

export interface IBackup {
  backupId: string
  source: string
  type: 'FULL' | 'INCREMENTAL' | 'DIFFERENTIAL'
  status: 'COMPLETED' | 'RUNNING' | 'FAILED' | 'SCHEDULED'
  size: string
  startedAt: Date
  completedAt?: Date
  duration: string
  errorMessage: string
  createdAt: Date
  updatedAt: Date
}

const BackupSchema = new Schema<IBackup>(
  {
    backupId: { type: String, required: true, unique: true, index: true },
    source: { type: String, required: true },
    type: { type: String, enum: ['FULL', 'INCREMENTAL', 'DIFFERENTIAL'], default: 'FULL' },
    status: { type: String, enum: ['COMPLETED', 'RUNNING', 'FAILED', 'SCHEDULED'], default: 'COMPLETED', index: true },
    size: { type: String, default: '0 MB' },
    startedAt: { type: Date, default: () => new Date() },
    completedAt: { type: Date },
    duration: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
  },
  { timestamps: true },
)

export type BackupDoc = IBackup & { _id: Types.ObjectId }
export const Backup: Model<IBackup> = mongoose.models.Backup || mongoose.model<IBackup>('Backup', BackupSchema)
