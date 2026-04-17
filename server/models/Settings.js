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
    default: 'info@yourhomes.ae' 
  },
  whatsapp: { 
    type: String, 
    default: '' 
  },
  socials: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  }
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
