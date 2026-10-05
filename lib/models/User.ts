import mongoose, { Schema, type Model } from 'mongoose'

export const ROLES = ['ADMIN', 'IT_ADMIN', 'IT_ENGINEER', 'VIEWER'] as const
export type Role = (typeof ROLES)[number]

export interface IUser {
  name: string
  email: string
  passwordHash: string
  role: Role
  status: 'ACTIVE' | 'DISABLED'
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'VIEWER', index: true },
    status: { type: String, enum: ['ACTIVE', 'DISABLED'], default: 'ACTIVE' },
    lastLogin: { type: Date },
  },
  { timestamps: true },
)

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
