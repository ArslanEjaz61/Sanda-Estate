import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  address: { 
    type: String, 
    default: 'A-202, Prime Business Center, POBOX: 123022, Dubai, UAE' 
  },
  phone: { 
    type: String, 
    default: '+971 4 454 1313' 
  },
  email: { 
    type: String, 
    default: 'info@sandaestate.com' 
  },
  /** Gmail (or Google Workspace) address used to sign in and send outbound mail (leads, chatbot). */
  smtpUser: {
    type: String,
    default: '',
  },
  /** App password for smtpUser (not shown on public API). */
  smtpAppPassword: {
    type: String,
    default: '',
  },
  /** Receives priority hot-lead alerts from the chatbot (not exposed on public GET). */
  managerEmail: {
    type: String,
    default: '',
  },
  /** Receives "talk to an agent" leads when no area agent matches (not exposed on public GET). */
  propertyConsultantEmail: {
    type: String,
    default: '',
  },
  whatsapp: { 
    type: String, 
    default: '' 
  },
  socials: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  /** Chatbot AI provider configuration (admin only fields). */
  chatbotAi: {
    priority: { type: [String], default: ['openai', 'gemini', 'longcat'] },
    openai: {
      isActive: { type: Boolean, default: true },
      apiKey: { type: String, default: '' },
      model: { type: String, default: 'gpt-4o-mini' },
    },
    gemini: {
      isActive: { type: Boolean, default: false },
      apiKey: { type: String, default: '' },
      model: { type: String, default: 'gemini-2.0-flash' },
    },
    longcat: {
      isActive: { type: Boolean, default: true },
      apiKey: { type: String, default: '' },
      model: { type: String, default: 'LongCat-Flash-Chat' },
      baseUrl: { type: String, default: 'https://api.longcat.chat/openai/v1/chat/completions' },
    },
  },
}, {
  timestamps: true
})

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne()
  if (!settings) {
    settings = await this.create({})
  }
  return settings
}

export default mongoose.model('Settings', settingsSchema)
