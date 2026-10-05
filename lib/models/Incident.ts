import mongoose, { Schema, type Model, type Types } from 'mongoose'

export interface IIncident {
  incidentId: string
  storeCode: string
  category: 'HARDWARE' | 'NETWORK' | 'SOFTWARE' | 'POWER' | 'SECURITY' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  assignedTo: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

const IncidentSchema = new Schema<IIncident>(
  {
    incidentId: { type: String, required: true, unique: true, index: true },
    storeCode: { type: String, required: true, index: true },
    category: { type: String, enum: ['HARDWARE', 'NETWORK', 'SOFTWARE', 'POWER', 'SECURITY', 'OTHER'], required: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN', index: true },
    assignedTo: { type: String, default: '' },
    resolvedAt: { type: Date },
  },
  { timestamps: true },
)

export type IncidentDoc = IIncident & { _id: Types.ObjectId }
export const Incident: Model<IIncident> = mongoose.models.Incident || mongoose.model<IIncident>('Incident', IncidentSchema)
