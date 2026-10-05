import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  // Do not throw at import time; route handlers surface a clear error instead.
  console.warn('[konexa] MONGODB_URI is not set. Database-backed endpoints will fail until it is configured.')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
   
  var __konexaMongoose: MongooseCache | undefined
}

const cache: MongooseCache = global.__konexaMongoose ?? { conn: null, promise: null }
global.__konexaMongoose = cache

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured. Set it in your environment (see config/environment.example).')
  }
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB_NAME || 'konexa',
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => m)
      .catch((err) => {
        cache.promise = null
        throw new Error(`MongoDB connection failed: ${err instanceof Error ? err.message : String(err)}`)
      })
  }
  cache.conn = await cache.promise
  return cache.conn
}

export async function getDatabaseStatus(): Promise<'connected' | 'disconnected' | 'error'> {
  try {
    await connectDB()
    return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  } catch {
    return 'error'
  }
}
