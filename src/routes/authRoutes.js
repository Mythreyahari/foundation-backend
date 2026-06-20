import express from 'express'
import Volunteer from '../models/Volunteer.js'
import { createToken } from '../utils/token.js'

const router = express.Router()

router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, phone, skills, availability, password } = req.body

    if (!fullName || !email || !phone || !skills || !availability || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters.' })
    }

    const existingVolunteer = await Volunteer.findOne({ email })

    if (existingVolunteer) {
      return res
        .status(409)
        .json({ message: 'A volunteer with this email already exists.' })
    }

    const volunteer = await Volunteer.create({
      fullName,
      email,
      phone,
      skills,
      availability,
      password,
    })

    return res.status(201).json({
      message: 'Registration successful.',
      volunteer,
    })
  } catch (error) {
    return next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const volunteer = await Volunteer.findOne({ email }).select('+password')

    if (!volunteer || !(await volunteer.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    return res.json({
      message: 'Login successful.',
      token: createToken(volunteer.id),
      volunteer,
    })
  } catch (error) {
    return next(error)
  }
})

export default router
