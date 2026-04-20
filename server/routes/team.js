import express from 'express'
import TeamMember from '../models/TeamMember.js'
import Area from '../models/Area.js'
import auth from '../middleware/auth.js'

const router = express.Router()

function sanitizePublic(member, areaNameBySlug = {}) {
  const slug = member.areaSlug ? String(member.areaSlug).trim() : ''
  return {
    _id: member._id,
    name: member.name || '',
    role: member.role || '',
    bio: member.bio || '',
    image: member.image || '',
    phone: member.phone || '',
    publicEmail: member.publicEmail || '',
    areaSlug: slug,
    areaName: slug ? (areaNameBySlug[slug] || '') : '',
    sortOrder: member.sortOrder || 0,
  }
}

// GET /api/team — Public list
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).lean()
    const slugs = [...new Set(members.map((m) => m.areaSlug).filter(Boolean).map((s) => String(s).trim()))]
    let areaNameBySlug = {}
    if (slugs.length) {
      const areas = await Area.find({ slug: { $in: slugs } }).select('slug name').lean()
      areaNameBySlug = Object.fromEntries(areas.map((a) => [a.slug, a.name]))
    }
    res.json(members.map((m) => sanitizePublic(m, areaNameBySlug)))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/team/admin — Admin list (includes notifyEmail/routing)
router.get('/admin', auth, async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ sortOrder: 1, createdAt: -1 })
    res.json(members)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/team — Admin create
router.post('/', auth, async (req, res) => {
  try {
    const member = new TeamMember(req.body)
    await member.save()
    res.status(201).json(member)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT /api/team/:id — Admin update
router.put('/:id', auth, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!member) return res.status(404).json({ message: 'Team member not found' })
    res.json(member)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE /api/team/:id — Admin delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id)
    if (!member) return res.status(404).json({ message: 'Team member not found' })
    res.json({ message: 'Team member deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

