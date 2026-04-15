import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Property from './models/Property.js';
import Area from './models/Area.js';
import axios from 'axios';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

puppeteer.default.use(StealthPlugin());

const urls = [
  'https://www.bayut.com/property/details-14128906.html',
  'https://www.bayut.com/property/details-13755233.html',
  'https://www.bayut.com/property/details-14282518.html',
  'https://www.bayut.com/property/details-14282885.html',
  'https://www.bayut.com/property/details-14453060.html',
  'https://www.bayut.com/property/details-14485283.html',
  'https://www.bayut.com/property/details-13522333.html',
  'https://www.bayut.com/property/details-14196971.html',
  'https://www.bayut.com/property/details-14016253.html',
  'https://www.bayut.com/property/details-14469523.html',
  'https://www.bayut.com/property/details-14055238.html',
  'https://www.bayut.com/property/details-13037852.html'
];

function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      }
    });

    // Determine extension from content-type or URL
    let ext = '.jpg';
    if(response.headers['content-type'] === 'image/webp') ext = '.webp';
    if(response.headers['content-type'] === 'image/jpeg') ext = '.jpg';
    if(response.headers['content-type'] === 'image/png') ext = '.png';

    const fullPath = filepath + ext;
    await fs.writeFile(fullPath, response.data);
    return path.basename(fullPath);
  } catch (err) {
    console.log(`Failed to download image ${url}`);
    return null;
  }
}

async function scrapeAll() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/your-homes-dubai');
  
  console.log('Clearing old DB entries...');
  await Property.deleteMany({});
  await Area.deleteMany({});
  
  const uploadDir = path.join(__dirname, 'uploads', 'scraped');
  await fs.mkdir(uploadDir, { recursive: true });

  console.log('Launching browser...');
  const browser = await puppeteer.default.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  for (const url of urls) {
    try {
      console.log(`Scraping ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      
      const content = await page.content();
      const $ = cheerio.load(content);
      
      let title = $('h1').text().trim();
      if (!title) {
         console.log('Cloudflare blocked or page not fully loaded, trying to wait for selector...');
         try {
           await page.waitForSelector('h1', {timeout: 10000});
           const loadedContent = await page.content();
           title = cheerio.load(loadedContent)('h1').text().trim();
         } catch(e) {
           console.log('Skipping due to block...');
           continue;
         }
      }

      const rawPrice = $('span[aria-label="Price"]').text().trim() || '0';
      const numericPrice = parseInt(rawPrice.replace(/[^0-9]/g, ''), 10) || 0;
      const priceFormatted = `AED ${numericPrice.toLocaleString()}`;

      let locationText = $('div[aria-label="Property header"] h2').text().trim() || $('div[aria-label="Property Location"]').text().trim() || 'Dubai';
      let locParts = locationText.split(',');
      let areaName = locParts.length > 1 ? locParts[locParts.length - 2].trim() : 'Dubai';
      if(areaName.includes('Dubai') && locParts.length > 2) areaName = locParts[locParts.length - 3].trim();
      let areaSlug = generateSlug(areaName);
      
      // Upsert Area
      let area = await Area.findOne({ slug: areaSlug });
      if (!area) {
        area = new Area({
          name: areaName,
          slug: areaSlug,
          shortDescription: `A premium real estate destination in ${areaName}.`,
          description: `Experience luxury living in ${areaName}, offering a blend of modern amenities and unparalleled comfort. Ideal for families and professionals alike.`,
          lifestyle: `Vibrant and dynamic. Living in ${areaName} means being surrounded by top-tier facilities, shopping centers, and recreational spaces.`,
          investmentAppeal: `High rental yields and consistent capital appreciation make ${areaName} a prime choice for real estate investors.`,
          tagline: 'Exclusive Living',
          stats: {
            avgPrice: 'AED 1,200/sq ft',
            rentalYield: '6.5%',
            priceGrowth: '+8% YoY',
            totalUnits: '5000+'
          },
        });
        await area.save();
        console.log(`Created new area: ${areaName}`);
      }

      const pTypeRaw = $('span[aria-label="Type"]').text().trim().toLowerCase();
      let pType = 'Apartment';
      if (pTypeRaw.includes('villa')) pType = 'Villa';
      if (pTypeRaw.includes('townhouse')) pType = 'Townhouse';
      if (pTypeRaw.includes('penthouse')) pType = 'Penthouse';

      const bedsRaw = $('span[aria-label="Beds"]').text().trim();
      const beds = parseInt(bedsRaw.replace(/[^0-9]/g, ''), 10) || 1;
      
      const bathsRaw = $('span[aria-label="Baths"]').text().trim();
      const baths = parseInt(bathsRaw.replace(/[^0-9]/g, ''), 10) || 1;
      
      const areaRaw = $('span[aria-label="Area"]').text().trim();
      const areaSqft = parseInt(areaRaw.replace(/[^0-9]/g, ''), 10) || 1000;
      
      const description = $('div[aria-label="Property description"]').first().text().substring(0, 800) || `${title} located in ${locationText}.`;
      
      const rawImages = [];
      $('img').each((i, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (src && (src.includes('bayut') || src.includes('cdn')) && !src.includes('svg')) {
          // Attempt to get higher res version if available
          let hqSrc = src.replace('w_400', 'w_1200').replace('h_300', 'h_800');
          rawImages.push(hqSrc);
        }
      });
      
      const uniqueImages = [...new Set(rawImages)].slice(0, 6);
      const downloadedPaths = [];
      
      let idx = 1;
      for (const imgUrl of uniqueImages) {
        const p = path.join(uploadDir, `prop-${Date.now()}-${idx}`);
        const filename = await downloadImage(imgUrl, p);
        if (filename) {
          downloadedPaths.push(`/uploads/scraped/${filename}`);
          
          // Also set the area image if it doesn't have one
          if (!area.image) {
            area.image = `/uploads/scraped/${filename}`;
            area.heroImage = `/uploads/scraped/${filename}`;
            await area.save();
          }
        }
        idx++;
      }

      await Property.create({
        title,
        type: pType,
        status: 'Ready',
        price: numericPrice,
        priceFormatted,
        bedrooms: beds,
        bathrooms: baths,
        area: areaSqft,
        areaUnit: 'sqft',
        location: areaName,
        locationSlug: areaSlug,
        developer: 'Bayut Listing', // Default if unknown
        description,
        features: ['Balcony', 'Built-in Wardrobes', 'Central A/C'],
        amenities: ['Shared Pool', 'Shared Gym', 'Security'],
        image: downloadedPaths[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        gallery: downloadedPaths,
        featured: numericPrice > 5000000, // Make high price ones featured
        goldenVisa: numericPrice >= 2000000
      });
      
      console.log(`Saved property: ${title}\n`);
      
      // Delay slightly between requests
      await new Promise(r => setTimeout(r, 3000));
      
    } catch (err) {
       console.error(`Error scraping ${url}:`, err.message);
    }
  }

  await browser.close();
  console.log('Scraping complete. Disconnecting DB.');
  mongoose.disconnect();
}

scrapeAll();
