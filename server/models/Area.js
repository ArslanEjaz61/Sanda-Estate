import mongoose from 'mongoose'

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  tagline: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  lifestyle: { type: String },
  investmentAppeal: { type: String },
  stats: {
    avgPrice: { type: String },
    rentalYield: { type: String },
    priceGrowth: { type: String },
    totalUnits: { type: String },
  },
  distanceFromDubaiMall: { type: String },
  image: { type: String }, // Main preview image
  heroImage: { type: String }, // Large hero background image
}, { timestamps: true })

export default mongoose.model('Area', areaSchema)
