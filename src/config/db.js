import mongoose from 'mongoose'

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing from backend/.env')
  }

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || 'nayepankh_foundation',
  })

  console.log('MongoDB connected')
}
