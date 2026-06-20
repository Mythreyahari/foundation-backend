import jwt from 'jsonwebtoken'
import Volunteer from '../models/Volunteer.js'

export async function protect(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please login first.' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const volunteer = await Volunteer.findById(decoded.volunteerId)

    if (!volunteer) {
      return res.status(401).json({ message: 'User no longer exists.' })
    }

    req.user = volunteer
    return next()
  } catch {
    return res.status(401).json({ message: 'Session expired. Please login again.' })
  }
}
