import express from 'express'
import { protect } from '../middleware/auth.js'
import Volunteer from '../models/Volunteer.js'

const router = express.Router()

router.get('/', protect, async (req, res, next) => {
  try {
    const search = req.query.search?.trim()
    const query = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { skills: { $regex: search, $options: 'i' } },
            { availability: { $regex: search, $options: 'i' } },
          ],
        }
      : {}

    const [volunteers, totalVolunteers, filteredCount] = await Promise.all([
      Volunteer.find(query).sort({ createdAt: -1 }),
      Volunteer.countDocuments(),
      Volunteer.countDocuments(query),
    ])

    return res.json({
      volunteers,
      totalVolunteers,
      filteredCount,
    })
  } catch (error) {
    return next(error)
  }
})

router.delete('/:id', protect, async (req, res, next) => {
  try {
    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.params.id)

    if (!deletedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found.' })
    }

    return res.json({ message: 'Volunteer deleted successfully.' })
  } catch (error) {
    return next(error)
  }
})

export default router
