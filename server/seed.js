import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Property from './models/Property.js'
import Admin from './models/Admin.js'

dotenv.config()

const properties = [
  { title: 'The Penthouse Collection at One Palm', type: 'Penthouse', status: 'Ready', price: 45000000, bedrooms: 5, bathrooms: 7, area: 12500, location: 'Palm Jumeirah', locationSlug: 'palm-jumeirah', developer: 'Omniyat', description: 'An extraordinary penthouse offering unparalleled panoramic views of the Arabian Gulf and Dubai skyline.', features: ['Private Pool','Sea View','Smart Home','Private Elevator','Wine Cellar','Home Cinema'], amenities: ['Infinity Pool','Private Beach','Spa & Wellness','Concierge Service'], image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'], featured: true, goldenVisa: true },
  { title: 'Signature Villa — Dubai Hills Estate', type: 'Villa', status: 'Ready', price: 22000000, bedrooms: 6, bathrooms: 8, area: 14200, location: 'Dubai Hills', locationSlug: 'dubai-hills', developer: 'Emaar', description: 'A landmark villa within the prestigious Dubai Hills Estate, offering resort-style living.', features: ['Private Pool','Golf Course View','Smart Home','Private Garden'], amenities: ['Golf Club','Parks','Shopping Mall','International Schools'], image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'], featured: true, goldenVisa: true },
  { title: 'Waterfront Residence — Dubai Marina', type: 'Apartment', status: 'Ready', price: 5800000, bedrooms: 3, bathrooms: 4, area: 2800, location: 'Dubai Marina', locationSlug: 'dubai-marina', developer: 'Select Group', description: 'A sophisticated waterfront apartment commanding breathtaking marina and sea views.', features: ['Marina View','Balcony','Built-in Wardrobes','Concierge'], amenities: ['Swimming Pool','Gym','Sauna','Marina Walk'], image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', gallery: [], featured: true, goldenVisa: false },
  { title: 'Sky Collection — Downtown Dubai', type: 'Apartment', status: 'Off-Plan', price: 8500000, bedrooms: 4, bathrooms: 5, area: 4200, location: 'Downtown Dubai', locationSlug: 'downtown-dubai', developer: 'Emaar', description: 'A visionary sky residence in the heart of Downtown Dubai, offering iconic Burj Khalifa views.', features: ['Burj Khalifa View','Private Terrace','Smart Home','Study Room'], amenities: ['Infinity Pool','Sky Lounge','Concierge','Dubai Mall Access'], image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', gallery: [], featured: true, goldenVisa: true },
  { title: 'Garden Townhouse — Dubai Hills', type: 'Townhouse', status: 'Ready', price: 3200000, bedrooms: 3, bathrooms: 4, area: 2400, location: 'Dubai Hills', locationSlug: 'dubai-hills', developer: 'Emaar', description: 'A beautifully crafted townhouse within the serene landscape of Dubai Hills Estate.', features: ['Private Garden','Covered Parking','Maid\'s Room'], amenities: ['Community Pool','Parks','Walking Trails'], image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', gallery: [], featured: false, goldenVisa: false },
  { title: 'Executive Suite — Business Bay', type: 'Apartment', status: 'Ready', price: 2100000, bedrooms: 2, bathrooms: 3, area: 1500, location: 'Business Bay', locationSlug: 'business-bay', developer: 'Damac', description: 'A modern executive apartment in the heart of Business Bay.', features: ['Canal View','Balcony','Built-in Kitchen','Covered Parking'], amenities: ['Pool','Gym','Business Center','Metro Adjacent'], image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', gallery: [], featured: false, goldenVisa: false },
  { title: 'Beachfront Mansion — Palm Jumeirah', type: 'Villa', status: 'Ready', price: 75000000, bedrooms: 7, bathrooms: 10, area: 25000, location: 'Palm Jumeirah', locationSlug: 'palm-jumeirah', developer: 'Nakheel', description: 'An ultra-exclusive beachfront mansion on the Palm Jumeirah.', features: ['Private Beach','Olympic Pool','Home Cinema','Wine Room','Helipad'], amenities: ['Beach Club','Fine Dining','Spa','Water Sports'], image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7a5a24?w=800&q=80', gallery: [], featured: true, goldenVisa: true },
  { title: 'Contemporary Loft — JVC', type: 'Apartment', status: 'Off-Plan', price: 980000, bedrooms: 1, bathrooms: 2, area: 850, location: 'JVC', locationSlug: 'jvc', developer: 'Binghatti', description: 'A smartly designed contemporary loft in Jumeirah Village Circle.', features: ['Balcony','Open Kitchen','Built-in Wardrobes'], amenities: ['Community Pool','Gym','Parks'], image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80', gallery: [], featured: false, goldenVisa: false },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Create default admin
    const admin = new Admin({ name: 'Admin', email: 'admin@yourhomes.ae', password: 'admin123' })
    await admin.save()
    console.log('✅ Created default admin: admin@yourhomes.ae / admin123')

    await mongoose.disconnect()
    console.log('Done!')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error.message)
    process.exit(1)
  }
}

seed()
