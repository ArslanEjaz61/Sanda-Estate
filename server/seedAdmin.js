import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Admin from './models/Admin.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const email = 'admin@sandaestate.com'
    const password = 'admin123'
    const name = 'Admin User'

    // Check if exists
    let admin = await Admin.findOne({ email })
    if (admin) {
      console.log('Admin already exists, updating password...')
      admin.password = password
      await admin.save()
    } else {
      console.log('Creating new admin...')
      admin = new Admin({ name, email, password })
      await admin.save()
    }

    console.log('✅ Admin credentials set successfully')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    
    process.exit(0)
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message)
    process.exit(1)
  }
}

seedAdmin()
