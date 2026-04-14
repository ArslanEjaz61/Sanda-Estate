import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Area from './models/Area.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const areas = [
  {
    slug: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    tagline: 'The Icon of Island Living',
    shortDescription: 'The world\'s most recognizable man-made island, offering ultra-luxury beachfront living with unmatched prestige.',
    description: 'Palm Jumeirah stands as one of the most ambitious engineering feats in modern history and Dubai\'s most iconic landmark. This crescent-shaped archipelago offers an exclusive collection of beachfront villas, premium apartments, and world-class hotels. Residents enjoy a resort-like lifestyle with private beaches, five-star dining, and panoramic views of the Arabian Gulf.',
    lifestyle: 'Life on the Palm is defined by exclusivity and tranquility. Morning swims in private pools, sunset views over the Gulf, and evenings at Michelin-starred restaurants create a daily rhythm of refined leisure.',
    investmentAppeal: 'Palm Jumeirah commands some of the highest price per square foot in Dubai, with consistent capital appreciation and strong rental yields driven by premium tourism demand.',
    stats: {
      avgPrice: 'AED 3,200/sq ft',
      rentalYield: '5.2%',
      priceGrowth: '+18% YoY',
      totalUnits: '4,000+',
    },
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80',
  },
  {
    slug: 'downtown-dubai',
    name: 'Downtown Dubai',
    tagline: 'The Centre of Now',
    shortDescription: 'Home to the Burj Khalifa and Dubai Mall — the beating heart of the city\'s urban luxury scene.',
    description: 'Downtown Dubai is the epicentre of modern metropolitan living. Anchored by the Burj Khalifa, Dubai Mall, and the Dubai Fountain, this district represents the pinnacle of urban sophistication.',
    lifestyle: 'Downtown living is about energy, culture, and convenience. Walk to the Opera, dine overlooking the fountains, shop at the world\'s largest mall, and return to a sky-high residence with views that define the Dubai skyline.',
    investmentAppeal: 'Downtown Dubai offers strong capital appreciation and consistent rental demand from both long-term residents and short-term tourists.',
    stats: {
      avgPrice: 'AED 2,800/sq ft',
      rentalYield: '5.8%',
      priceGrowth: '+15% YoY',
      totalUnits: '12,000+',
    },
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80',
  },
  {
    slug: 'dubai-marina',
    name: 'Dubai Marina',
    tagline: 'Waterfront Urban Living',
    shortDescription: 'A vibrant waterfront community with stunning marina views, beach access, and a cosmopolitan lifestyle.',
    description: 'Dubai Marina is one of the largest and most meticulously planned waterfront developments in the world. The marina walk, JBR beach, and a dense cluster of premium towers create a unique urban waterfront experience.',
    lifestyle: 'Marina life blends urban convenience with coastal charm. Morning jogs along the Marina Walk, yacht-watching from your balcony, beach days at JBR, and evenings at the area\'s countless restaurants and cafes.',
    investmentAppeal: 'Dubai Marina continues to deliver strong rental yields, particularly in the short-term rental market. Its popularity with tourists and expats ensures consistent demand.',
    stats: {
      avgPrice: 'AED 1,800/sq ft',
      rentalYield: '6.5%',
      priceGrowth: '+12% YoY',
      totalUnits: '20,000+',
    },
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1600&q=80',
  },
  {
    slug: 'dubai-hills',
    name: 'Dubai Hills Estate',
    tagline: 'The Green Heart of the City',
    shortDescription: 'A sprawling master-planned community offering villas, townhouses, and apartments in a lush green setting.',
    description: 'Dubai Hills Estate is Emaar\'s crown jewel — a sprawling master-planned community built around an 18-hole championship golf course.',
    lifestyle: 'Dubai Hills embodies family-focused luxury. Tree-lined streets, parks at every corner, and a world-class golf course create a serene backdrop for daily life.',
    investmentAppeal: 'As one of Dubai\'s fastest-growing communities, Dubai Hills Estate offers exceptional value appreciation.',
    stats: {
      avgPrice: 'AED 1,600/sq ft',
      rentalYield: '5.5%',
      priceGrowth: '+22% YoY',
      totalUnits: '15,000+',
    },
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80',
  },
  {
    slug: 'business-bay',
    name: 'Business Bay',
    tagline: 'The New Downtown',
    shortDescription: 'A dynamic canal-side district emerging as Dubai\'s most exciting urban investment destination.',
    description: 'Business Bay has evolved from a commercial hub into one of Dubai\'s most exciting mixed-use districts. The Dubai Water Canal provides a stunning waterfront setting.',
    lifestyle: 'Business Bay offers an urban lifestyle defined by convenience and connectivity. Canal-side dining, proximity to Downtown, and a growing array of lifestyle amenities create an attractive proposition.',
    investmentAppeal: 'Business Bay offers one of the best value propositions in central Dubai. With prices significantly below Downtown but similar connectivity.',
    stats: {
      avgPrice: 'AED 1,400/sq ft',
      rentalYield: '7.0%',
      priceGrowth: '+14% YoY',
      totalUnits: '25,000+',
    },
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
  },
  {
    slug: 'jvc',
    name: 'Jumeirah Village Circle',
    tagline: 'Smart Investment, Connected Living',
    shortDescription: 'A family-friendly community offering exceptional rental yields and accessible price points.',
    description: 'Jumeirah Village Circle (JVC) has emerged as one of Dubai\'s most popular residential communities for both families and investors.',
    lifestyle: 'JVC offers a relaxed, community-oriented lifestyle. Parks, playgrounds, and neighbourhood cafes create a village atmosphere.',
    investmentAppeal: 'JVC consistently ranks among Dubai\'s highest-yielding areas. Affordable entry points combined with strong tenant demand.',
    stats: {
      avgPrice: 'AED 900/sq ft',
      rentalYield: '8.2%',
      priceGrowth: '+10% YoY',
      totalUnits: '30,000+',
    },
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
  },
]

async function seed() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Clearing existing areas...')
    await Area.deleteMany({})
    console.log('Inserting areas...')
    await Area.insertMany(areas)
    console.log('Migration complete!')
    process.exit(0)
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(1)
  }
}

seed()
