import express from 'express'
import Settings from '../models/Settings.js'
import auth from '../middleware/auth.js'

const router = express.Router()

function stripPublicSettings(doc) {
  const o = doc && typeof doc.toObject === 'function' ? doc.toObject() : { ...doc }
  delete o.smtpAppPassword
  return o
}

// GET /api/settings - Public (no app password)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings()
    res.json(stripPublicSettings(settings))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/settings/admin - Full document for admin UI
router.get('/admin', auth, async (req, res) => {
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
    const body = { ...req.body }
    delete body.__v
    delete body._id
    delete body.createdAt
    delete body.updatedAt
    if (body.smtpAppPassword === '' || body.smtpAppPassword == null) {
      delete body.smtpAppPassword
    }

    const settings = await Settings.findOne()
    if (!settings) {
      const newSettings = new Settings(body)
      await newSettings.save()
      return res.json(newSettings)
    }

    const updated = await Settings.findByIdAndUpdate(
      settings._id,
      { $set: body },
      { new: true, runValidators: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
