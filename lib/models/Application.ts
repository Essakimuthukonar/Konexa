import mongoose, { Schema, type Model, type Types } from 'mongoose'

export interface IApplication {
  name: string
  environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT'
  version: string
  status: 'RUNNING' | 'STOPPED' | 'DEPLOYING'
  repository: string
  deploymentStatus: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'QUEUED'
  lastDeployment: Date
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    name: { type: String, required: true, index: true },
    environment: { type: String, enum: ['PRODUCTION', 'STAGING', 'DEVELOPMENT'], required: true },
    version: { type: String, required: true },
    status: { type: String, enum: ['RUNNING', 'STOPPED', 'DEPLOYING'], default: 'RUNNING', index: true },
    repository: { type: String, default: '' },
    deploymentStatus: { type: String, enum: ['SUCCESS', 'RUNNING', 'FAILED', 'QUEUED'], default: 'SUCCESS' },
    lastDeployment: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
)

export type ApplicationDoc = IApplication & { _id: Types.ObjectId }
export const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema)
