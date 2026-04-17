import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Area from './models/Area.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined in .env');
    }
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB: ${mongoUri}`);

    // Clear existing areas
    await Area.deleteMany({});
    console.log('Cleared existing areas');

    // Read data from JSON
    const dataPath = join(__dirname, 'areas_data.json');
    const data = JSON.parse(await readFile(dataPath, 'utf8'));

    // Insert new areas
    await Area.insertMany(data);
    console.log(`Successfully seeded ${data.length} areas`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
