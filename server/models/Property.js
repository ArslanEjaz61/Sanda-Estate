import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Duplex', 'Studio'] },
  status: { type: String, required: true, enum: ['Ready', 'Off-Plan', 'Resale', 'Rental'], default: 'Ready' },
  purpose: { type: String, enum: ['For Sale', 'For Rent'], default: 'For Sale' },
  usage: { type: String, enum: ['Residential', 'Commercial'], default: 'Residential' },
  price: { type: Number, required: true },
  priceFormatted: { type: String },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  areaUnit: { type: String, default: 'sq ft' },
  location: { type: String, required: true },
  locationSlug: { type: String, required: true },
  subLocation: { type: String },
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
  referenceNumber: { type: String },
  reraPermit: { type: String },
  furnishedStatus: { type: String, enum: ['Furnished', 'Unfurnished', 'Partly Furnished', ''] },
  rentFrequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly', ''], default: '' },
  propertyAge: { type: String },
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
    if (this.status === 'Rental' && this.rentFrequency) {
      this.priceFormatted = `AED ${this.price.toLocaleString()} / ${this.rentFrequency}`
    } else {
      this.priceFormatted = `AED ${this.price.toLocaleString()}`
    }
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
    const isRental = update.status === 'Rental' || (this._update && this._update.status === 'Rental')
    const freq = update.rentFrequency
    
    if (isRental && freq) {
      update.priceFormatted = `AED ${update.price.toLocaleString()} / ${freq}`
    } else {
      update.priceFormatted = `AED ${update.price.toLocaleString()}`
    }
  }
  if (update.location && !update.locationSlug) {
    update.locationSlug = update.location.toLowerCase().replace(/\s+/g, '-')
  }
  next()
})

export default mongoose.model('Property', propertySchema)
