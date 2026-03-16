import express from 'express'
import Contact from '../models/Contact.js'
import auth from '../middleware/auth.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this based on the provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// POST /api/contact — Public route to submit an inquiry
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body)
    await contact.save()

    // Optional: Send email notification to admin
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to the admin's own email
        subject: `New Lead Inquiry from ${contact.name}`,
        html: `
          <h3>New Property Inquiry</h3>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
          <p><strong>Budget:</strong> ${contact.budget || 'N/A'}</p>
          <p><strong>Area:</strong> ${contact.area || 'N/A'}</p>
          <p><strong>Property Type:</strong> ${contact.propertyType || 'N/A'}</p>
          <p><strong>Message:</strong> ${contact.message || 'N/A'}</p>
        `
      }
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error("Error sending email:", error)
        else console.log("Email sent:", info.response)
      })
    }

    res.status(201).json({ message: 'Contact submitted successfully', contact })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// GET /api/contact — Admin route to get all inquiries
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json(contacts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PUT /api/contact/:id — Admin route to mark as read
router.put('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!contact) return res.status(404).json({ message: 'Contact not found' })
    res.json(contact)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE /api/contact/:id — Admin route to delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) return res.status(404).json({ message: 'Contact not found' })
    res.json({ message: 'Contact deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
