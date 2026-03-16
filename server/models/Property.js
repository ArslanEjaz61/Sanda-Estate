import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Duplex', 'Studio'] },
  status: { type: String, required: true, enum: ['Ready', 'Off-Plan', 'Resale', 'Rental'], default: 'Ready' },
  price: { type: Number, required: true },
  priceFormatted: { type: String },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  areaUnit: { type: String, default: 'sq ft' },
  location: { type: String, required: true },
  locationSlug: { type: String, required: true },
  developer: { type: String },
  description: { type: String },
  features: [{ type: String }],
  amenities: [{ type: String }],
  image: { type: String },
  gallery: [{ type: String }],
  video: { type: String },
  floorPlan: { type: String },
  completionDate: { type: String },
  serviceCharges: { type: Number },
  agent: {
    name: { type: String },
    phone: { type: String },
    photo: { type: String },
  },
  featured: { type: Boolean, default: false },
  goldenVisa: { type: Boolean, default: false },
}, { timestamps: true })

// Auto-generate priceFormatted before save
propertySchema.pre('save', function(next) {
  if (this.price) {
    this.priceFormatted = `AED ${this.price.toLocaleString()}`
  }
  if (this.location && !this.locationSlug) {
    this.locationSlug = this.location.toLowerCase().replace(/\s+/g, '-')
  }
  next()
})

// Also generate on update
propertySchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate()
  if (update.price) {
    update.priceFormatted = `AED ${update.price.toLocaleString()}`
  }
  if (update.location && !update.locationSlug) {
    update.locationSlug = update.location.toLowerCase().replace(/\s+/g, '-')
  }
  next()
})

export default mongoose.model('Property', propertySchema)
