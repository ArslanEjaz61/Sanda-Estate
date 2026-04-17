import express from 'express'
import Settings from '../models/Settings.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// GET /api/settings - Public
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings()
    res.json(settings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PUT /api/settings - Admin only
router.put('/', auth, async (req, res) => {
  try {
    const settings = await Settings.findOne()
    if (!settings) {
      const newSettings = new Settings(req.body)
      await newSettings.save()
      return res.json(newSettings)
    }

    const updated = await Settings.findByIdAndUpdate(
      settings._id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
