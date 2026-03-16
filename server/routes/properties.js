import express from 'express'
import Property from '../models/Property.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// GET /api/properties — Public: list all properties
router.get('/', async (req, res) => {
  try {
    const { type, location, featured, search, sort } = req.query
    const filter = {}
    if (type) filter.type = type
    if (location) filter.locationSlug = location
    if (featured === 'true') filter.featured = true
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { developer: { $regex: search, $options: 'i' } },
      ]
    }

    let sortOption = { createdAt: -1 }
    if (sort === 'price-asc') sortOption = { price: 1 }
    if (sort === 'price-desc') sortOption = { price: -1 }
    if (sort === 'newest') sortOption = { createdAt: -1 }

    const properties = await Property.find(filter).sort(sortOption)
    res.json(properties)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/properties/:id — Public: single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
    if (!property) return res.status(404).json({ message: 'Property not found' })
    res.json(property)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/properties — Admin: create property
router.post('/', auth, async (req, res) => {
  try {
    const property = new Property(req.body)
    await property.save()
    res.status(201).json(property)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT /api/properties/:id — Admin: update property
router.put('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!property) return res.status(404).json({ message: 'Property not found' })
    res.json(property)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE /api/properties/:id — Admin: delete property
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id)
    if (!property) return res.status(404).json({ message: 'Property not found' })
    res.json({ message: 'Property deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
