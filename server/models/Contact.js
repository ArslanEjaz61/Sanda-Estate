import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  budget: { type: String },
  area: { type: String },
  propertyType: { type: String },
  message: { type: String },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' }
}, {
  timestamps: true
})

export default mongoose.model('Contact', contactSchema)
