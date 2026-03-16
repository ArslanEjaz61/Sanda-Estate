import express from 'express'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

const router = express.Router()

// POST /api/auth/register — Create first admin (disable after first use)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email.' })
    }
    const admin = new Admin({ name, email, password })
    await admin.save()
    const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
