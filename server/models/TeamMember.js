import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, default: '' },
  image: { type: String, default: '' },
  phone: { type: String, default: '' }, // optional public mobile, shown on About
  publicEmail: { type: String, default: '' }, // optional, shown on About page
  notifyEmail: { type: String, default: '' }, // receives chatbot alerts
  routingKey: { type: String, default: '' }, // e.g. founder, investment
  routingKeywords: { type: String, default: '' },
  /** Matches Area.slug — which Dubai area this advisor focuses on (optional). */
  areaSlug: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

teamMemberSchema.index({ sortOrder: 1, createdAt: -1 })
teamMemberSchema.index({ routingKey: 1 })

export default mongoose.model('TeamMember', teamMemberSchema)

