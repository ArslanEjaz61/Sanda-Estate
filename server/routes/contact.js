import express from 'express'
import Contact from '../models/Contact.js'
import auth from '../middleware/auth.js'
import dotenv from 'dotenv'
import { resolveSmtpAuth, createMailTransport } from '../utils/mail.js'

dotenv.config()

const router = express.Router()

// POST /api/contact — Public route to submit an inquiry
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body)
    await contact.save()

    const { user: smtpUser, pass: smtpPass, hasAuth } = await resolveSmtpAuth()
    if (hasAuth) {
      const transport = createMailTransport(smtpUser, smtpPass)
      const mailOptions = {
        from: smtpUser,
        to: smtpUser,
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
        `,
      }
      transport.sendMail(mailOptions, (error, info) => {
        if (error) console.error('Error sending email:', error)
        else console.log('Email sent:', info.response)
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
