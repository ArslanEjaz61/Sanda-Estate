import express from 'express'
import Area from '../models/Area.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// GET /api/areas — Public, get all areas
router.get('/', async (req, res) => {
  try {
    const areas = await Area.find().sort({ name: 1 })
    res.json(areas)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/areas/:slug — Public, get single area by slug
router.get('/:slug', async (req, res) => {
  try {
    const area = await Area.findOne({ slug: req.params.slug })
    if (!area) return res.status(404).json({ message: 'Area not found' })
    res.json(area)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/areas — Admin only, create area
router.post('/', auth, async (req, res) => {
  try {
    const existing = await Area.findOne({ slug: req.body.slug })
    if (existing) return res.status(400).json({ message: 'Slug already exists' })
    
    const area = new Area(req.body)
    await area.save()
    res.status(201).json(area)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT /api/areas/:id — Admin only, update area
router.put('/:id', auth, async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!area) return res.status(404).json({ message: 'Area not found' })
    res.json(area)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE /api/areas/:id — Admin only, delete area
router.delete('/:id', auth, async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id)
    if (!area) return res.status(404).json({ message: 'Area not found' })
    res.json({ message: 'Area deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
