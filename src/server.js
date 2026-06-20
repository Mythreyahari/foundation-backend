import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import volunteerRoutes from './routes/volunteerRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const allowedOrigins = [
  ...(process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim()),
  'http://127.0.0.1:5173',
]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ message: 'NayePankh backend is running.' })
})

app.use('/api/auth', authRoutes)
app.use('/api/volunteers', volunteerRoutes)

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` })
})

app.use((error, _req, res, _next) => {
  if (error.code === 11000) {
    return res.status(409).json({ message: 'Email already registered.' })
  }

  console.error(error)
  return res.status(500).json({ message: 'Something went wrong on the server.' })
})

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message)
    process.exit(1)
  })
