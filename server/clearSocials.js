import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Settings from './models/Settings.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const clearSocials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const settings = await Settings.findOne()
    if (settings) {
      settings.whatsapp = ''
      settings.socials = {
        instagram: '',
        facebook: '',
        linkedin: ''
      }
      await settings.save()
      console.log('✅ Default social links cleared from database.')
    } else {
      console.log('No settings found to update.')
    }
    
    process.exit(0)
  } catch (err) {
    console.error('❌ Error clearing socials:', err.message)
    process.exit(1)
  }
}

clearSocials()
