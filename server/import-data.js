import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Property from './models/Property.js';
import Area from './models/Area.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}  
 
const luxuryImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687930-cef5694d11cf?w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
  'https://images.unsplash.com/photo-1613490908653-b09e4404052f?w=1200&q=80',
  'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=1200&q=80',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80'
];

const areaImages = {
  'jvc': 'https://images.unsplash.com/photo-1582647509711-c8aa8a8b1bf2?w=1200&q=80', // Dubai look
  'dubai-sports-city': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80', // Golf/Sports look
  'jbr': 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=80', // Beach look
  'impz': 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=1200&q=80' // City look
};

async function importData() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sanda-estate-dubai');
  
  console.log('Clearing old DB entries...');
  await Property.deleteMany({});
  await Area.deleteMany({});

  const dataPath = path.join(__dirname, 'scraped_data.json');
  const rawData = await fs.readFile(dataPath, 'utf-8');
  const properties = JSON.parse(rawData);

  console.log(`Processing ${properties.length} properties...`);

  for (const item of properties) {
    let priceNumeric = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
    // If it's a yearly rent, mark it
    const isRent = item.price.toLowerCase().includes('yearly');
    let priceFormatted = isRent ? `AED ${priceNumeric.toLocaleString()} / Year` : `AED ${priceNumeric.toLocaleString()}`;

    // Extract area details
    let locParts = item.location.split(',');
    let areaName = 'Dubai';
    let baseSlugKey = 'dubai';

    if (item.location.includes('Jumeirah Village Circle') || item.location.includes('JVC')) {
      areaName = 'Jumeirah Village Circle (JVC)';
      baseSlugKey = 'jvc';
    } else if (item.location.includes('Sports City')) {
      areaName = 'Dubai Sports City';
      baseSlugKey = 'dubai-sports-city';
    } else if (item.location.includes('JBR')) {
      areaName = 'Jumeirah Beach Residence (JBR)';
      baseSlugKey = 'jbr';
    } else if (item.location.includes('IMPZ')) {
      areaName = 'Dubai Production City (IMPZ)';
      baseSlugKey = 'impz';
    } else if (locParts.length >= 2) {
       areaName = locParts[locParts.length - 2].trim();
       baseSlugKey = generateSlug(areaName);
    }

    let areaSlug = generateSlug(areaName);
    
    // Upsert Area
    let area = await Area.findOne({ slug: areaSlug });
    if (!area) {
      let coverImage = areaImages[baseSlugKey] || luxuryImages[Math.floor(Math.random() * luxuryImages.length)];
      area = new Area({
        name: areaName,
        slug: areaSlug,
        shortDescription: `A premium real estate destination in ${areaName}.`,
        description: `Experience luxury living in ${areaName}, offering a blend of modern amenities and unparalleled comfort. Ideal for families and professionals alike.`,
        lifestyle: `Vibrant and dynamic. Living in ${areaName} means being surrounded by top-tier facilities, shopping centers, and recreational spaces.`,
        investmentAppeal: `High rental yields and consistent capital appreciation make ${areaName} a prime choice for real estate investors.`,
        tagline: 'Exclusive Living',
        image: coverImage,
        heroImage: coverImage,
        stats: {
          avgPrice: 'AED 1,200/sq ft',
          rentalYield: isRent ? '7.5%' : '6.5%',
          priceGrowth: '+8% YoY',
          totalUnits: '5000+'
        },
      });
      await area.save();
      console.log(`[+] Created new area: ${areaName}`);
    }

    // Get random images and shuffle them
    const shuffledLuxury = [...luxuryImages].sort(() => 0.5 - Math.random());
    const gallery = shuffledLuxury.slice(0, 6);
    
    // Extract numbers safely
    const beds = typeof item.bedrooms === 'number' ? item.bedrooms : (parseInt(item.bedrooms) || 1);
    const baths = typeof item.bathrooms === 'number' ? item.bathrooms : (parseInt(item.bathrooms) || 1);
    const areaSqft = typeof item.area === 'number' ? item.area : (parseInt(item.area.replace(/[^0-9]/g, '')) || 1000);

    const property = new Property({
      title: item.title,
      type: item.type || 'Apartment',
      status: isRent ? 'Rental' : 'Ready',
      price: priceNumeric,
      priceFormatted: priceFormatted,
      bedrooms: beds,
      bathrooms: baths,
      area: areaSqft,
      areaUnit: 'sqft',
      location: areaName,
      locationSlug: areaSlug,
      developer: 'Sanda Estate Real Estate LLC',
      description: item.description,
      features: ['Balcony', 'Built-in Wardrobes', 'Central A/C', 'Covered Parking', 'Maid Room'],
      amenities: ['Shared Pool', 'Shared Gym', 'Security', 'Children Play Area'],
      image: gallery[0],
      gallery: gallery,
      featured: true, // Make them featured so they look great on the home page
      goldenVisa: priceNumeric >= 2000000 && !isRent
    });
    
    await property.save();
    console.log(`[+] Saved property: ${item.title}`);
  }

  console.log('\nData Import Complete!');
  mongoose.disconnect();
}

importData().catch(console.error);
