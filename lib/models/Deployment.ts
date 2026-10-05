import mongoose, { Schema, type Model, type Types } from 'mongoose'

export interface IDeployment {
  application: string
  version: string
  environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT'
  status: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'QUEUED'
  branch: string
  commit: string
  buildNumber: number
  deployedAt: Date
  deployedBy: string
  duration: string
  createdAt: Date
  updatedAt: Date
}

const DeploymentSchema = new Schema<IDeployment>(
  {
    application: { type: String, required: true, index: true },
    version: { type: String, required: true },
    environment: { type: String, enum: ['PRODUCTION', 'STAGING', 'DEVELOPMENT'], required: true, index: true },
    status: { type: String, enum: ['SUCCESS', 'RUNNING', 'FAILED', 'QUEUED'], default: 'QUEUED', index: true },
    branch: { type: String, default: 'main' },
    commit: { type: String, default: '' },
    buildNumber: { type: Number, default: 0 },
    deployedAt: { type: Date, default: () => new Date() },
    deployedBy: { type: String, default: 'system' },
    duration: { type: String, default: '' },
  },
  { timestamps: true },
)

export type DeploymentDoc = IDeployment & { _id: Types.ObjectId }
export const Deployment: Model<IDeployment> =
  mongoose.models.Deployment || mongoose.model<IDeployment>('Deployment', DeploymentSchema)
