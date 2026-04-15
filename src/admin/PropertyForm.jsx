import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API = import.meta.env.VITE_API_BASE
const SERVER_BASE = import.meta.env.VITE_SERVER_BASE

function normalizeMediaUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) return `${SERVER_BASE}${url}`
  return url
}

const emptyForm = {
  title: '', type: 'Apartment', status: 'Ready', price: '', bedrooms: '', bathrooms: '', area: '',
  areaUnit: 'sq ft', location: '', developer: '', description: '', features: '', amenities: '',
  image: '', gallery: '', video: '', floorPlan: '', completionDate: '', serviceCharges: '',
  referenceNumber: '', reraPermit: '', furnishedStatus: '', propertyAge: '', rentFrequency: '',
  agentName: '', agentPhone: '', agentPhoto: '', featured: false, goldenVisa: false,
}

export default function PropertyForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [areas, setAreas] = useState([])

  useEffect(() => {
    if (isEditing) {
      const token = localStorage.getItem('admin_token')
      fetch(`${API}/properties/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          setForm({
            ...data,
            features: Array.isArray(data.features) ? data.features.join(', ') : '',
            amenities: Array.isArray(data.amenities) ? data.amenities.join(', ') : '',
            gallery: Array.isArray(data.gallery) ? data.gallery.join('\n') : '',
            agentName: data.agent?.name || '',
            agentPhone: data.agent?.phone || '',
            agentPhoto: data.agent?.photo || '',
            video: data.video || '',
            floorPlan: data.floorPlan || '',
            completionDate: data.completionDate || '',
            serviceCharges: data.serviceCharges || '',
            referenceNumber: data.referenceNumber || '',
            reraPermit: data.reraPermit || '',
            furnishedStatus: data.furnishedStatus || '',
            propertyAge: data.propertyAge || '',
            rentFrequency: data.rentFrequency || '',
          })
          setImagePreview(data.image || '')
        })
        .catch(() => setError('Failed to load property'))
    }

    // Fetch areas for selection
    fetch(`${API}/areas`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setAreas(data)
      })
      .catch(err => console.error('Failed to load areas'))
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const token = localStorage.getItem('admin_token')
    const formData = new FormData()
    formData.append('image', file)
    try {
      setLoading(true)
      const res = await fetch(`${API}/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
      const data = await res.json()
      if (data.url) {
        setForm(prev => ({ ...prev, image: data.url }))
        setImagePreview(data.url)
      }
    } catch (err) { setError('Image upload failed') } finally { setLoading(false) }
  }

  const handleMultipleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    const token = localStorage.getItem('admin_token')
    const formData = new FormData()
    files.forEach(f => formData.append('images', f))
    try {
      setLoading(true)
      const res = await fetch(`${API}/upload/multiple`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
      const data = await res.json()
      if (data.urls) {
        setForm(prev => {
          const exist = prev.gallery ? prev.gallery.split('\n').filter(Boolean) : []
          return { ...prev, gallery: [...exist, ...data.urls].join('\n') }
        })
      }
    } catch (err) { setError('Gallery upload failed') } finally { setLoading(false) }
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const token = localStorage.getItem('admin_token')
    const formData = new FormData()
    formData.append('video', file)
    try {
      setLoading(true)
      const res = await fetch(`${API}/upload/video`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
      const data = await res.json()
      if (data.url) {
        setForm(prev => ({ ...prev, video: data.url }))
      }
    } catch (err) { setError('Video upload failed') } finally { setLoading(false) }
  }

  const removeMainImage = () => {
    setForm(prev => ({ ...prev, image: '' }))
    setImagePreview('')
  }

  const removeGalleryImage = (index) => {
    setForm(prev => {
      const images = prev.gallery.split('\n').filter(Boolean)
      images.splice(index, 1)
      return { ...prev, gallery: images.join('\n') }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    const body = {
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      serviceCharges: form.serviceCharges ? Number(form.serviceCharges) : undefined,
      features: form.features ? form.features.split(',').map(f => f.trim()).filter(Boolean) : [],
      amenities: form.amenities ? form.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
      gallery: form.gallery ? form.gallery.split('\n').map(g => g.trim()).filter(Boolean) : [],
      agent: {
        name: form.agentName,
        phone: form.agentPhone,
        photo: form.agentPhoto,
      }
    }
    // Remove mongoose internal fields and flattened form helpers
    delete body._id; delete body.__v; delete body.createdAt; delete body.updatedAt
    delete body.agentName; delete body.agentPhone; delete body.agentPhoto

    try {
      const url = isEditing ? `${API}/properties/${id}` : `${API}/properties`
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      navigate('/admin/properties')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)' }
  const labelClass = "block text-[9px] uppercase tracking-[0.15em] text-white/35 font-semibold mb-2"

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-[28px] mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>{isEditing ? 'Edit Property' : 'Add New Property'}</h1>
        <p className="text-[13px] text-white/35" style={{ fontFamily: 'var(--font-body)' }}>{isEditing ? 'Update the property details below' : 'Fill in the details to add a new property'}</p>
      </div>

      {error && (
        <div className="mb-6 p-3 text-[12px] text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontFamily: 'var(--font-body)' }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl" style={{ fontFamily: 'var(--font-body)' }}>
        {/* Basic Info */}
        <div className="p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Basic Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2">
              <label className={labelClass}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. Luxury Penthouse — Palm Jumeirah" />
            </div>
            <div>
              <label className={labelClass}>Type *</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle}>
                {['Apartment','Villa','Penthouse','Townhouse','Duplex','Studio'].map(t => <option key={t} value={t} style={{ color: '#ffffff', background: '#1a1a1a' }}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status *</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle}>
                {['Ready','Off-Plan','Resale','Rental'].map(s => <option key={s} value={s} style={{ color: '#ffffff', background: '#1a1a1a' }}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Price {form.status === 'Rental' ? '(AED) *' : '(AED) *'}</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. 5000000" />
            </div>
            {form.status === 'Rental' && (
              <div>
                <label className={labelClass}>Rent Frequency *</label>
                <select name="rentFrequency" value={form.rentFrequency} onChange={handleChange} required={form.status === 'Rental'} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle}>
                  <option value="" style={{ color: '#ffffff', background: '#1a1a1a' }}>Select Frequency</option>
                  {['Daily','Weekly','Monthly','Yearly'].map(f => <option key={f} value={f} style={{ color: '#ffffff', background: '#1a1a1a' }}>{f}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>Developer</label>
              <input name="developer" value={form.developer} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. Emaar" />
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Specifications</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div><label className={labelClass}>Bedrooms *</label><input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} required className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} /></div>
            <div><label className={labelClass}>Bathrooms *</label><input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} required className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} /></div>
            <div><label className={labelClass}>Area *</label><input name="area" type="number" value={form.area} onChange={handleChange} required className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} /></div>
            <div><label className={labelClass}>Area Unit</label><input name="areaUnit" value={form.areaUnit} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} /></div>
            
            <div><label className={labelClass}>Reference Number</label><input name="referenceNumber" value={form.referenceNumber} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. BAYUT-1234" /></div>
            <div><label className={labelClass}>RERA Permit No.</label><input name="reraPermit" value={form.reraPermit} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. 1234567890" /></div>
            
            <div>
              <label className={labelClass}>Furnished Status</label>
              <select name="furnishedStatus" value={form.furnishedStatus} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle}>
                <option value="" style={{ color: '#ffffff', background: '#1a1a1a' }}>Select...</option>
                {['Furnished', 'Unfurnished', 'Partly Furnished'].map(s => <option key={s} value={s} style={{ color: '#ffffff', background: '#1a1a1a' }}>{s}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Property Age/Handover</label><input name="propertyAge" value={form.propertyAge} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. Built in 2018 or Q3 2025" /></div>

            {/* Legacy Date field - still useful for raw completion mapping, but propertyAge is more versatile for Bayut */}
            <div><label className={labelClass}>Completion</label><input name="completionDate" value={form.completionDate} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. Q4 2026" /></div>
            <div><label className={labelClass}>Service Chg</label><input name="serviceCharges" type="number" value={form.serviceCharges} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="AED / sqft" /></div>
          </div>
        </div>

        {/* Location */}
        <div className="p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Location</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Select Area *</label>
              <select 
                name="location" 
                value={form.location} 
                onChange={(e) => {
                  const selectedArea = areas.find(a => a.name === e.target.value)
                  setForm(prev => ({ 
                    ...prev, 
                    location: e.target.value,
                    locationSlug: selectedArea ? selectedArea.slug : prev.locationSlug 
                  }))
                }} 
                required 
                className="w-full px-4 py-3 text-[13px] text-white outline-none" 
                style={inputStyle}
              >
                <option value="" style={{ color: '#ffffff', background: '#1a1a1a' }}>Select an area...</option>
                {areas.map(area => (
                  <option key={area._id} value={area.name} style={{ color: '#ffffff', background: '#1a1a1a' }}>{area.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Location Slug (Auto-set from Area)</label>
              <input name="locationSlug" value={form.locationSlug || ''} readOnly className="w-full px-4 py-3 text-[13px] text-white/50 outline-none cursor-not-allowed" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Description & Features</h3>
          <div className="space-y-4">
            <div><label className={labelClass}>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 text-[13px] text-white outline-none resize-y" style={inputStyle} /></div>
            <div><label className={labelClass}>Features (comma separated)</label><input name="features" value={form.features} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="Private Pool, Sea View, Smart Home" /></div>
            <div><label className={labelClass}>Amenities (comma separated)</label><input name="amenities" value={form.amenities} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="Gym, Pool, Concierge" /></div>
          </div>
        </div>

        {/* Agent Info */}
        <div className="p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Assigned Agent</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div><label className={labelClass}>Agent Name</label><input name="agentName" value={form.agentName} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. John Doe" /></div>
            <div><label className={labelClass}>Agent Phone</label><input name="agentPhone" value={form.agentPhone} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. +971 4 454 1313" /></div>
            <div><label className={labelClass}>Agent Photo URL</label><input name="agentPhoto" value={form.agentPhoto} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="URL to profile picture" /></div>
          </div>
        </div>

        {/* Images */}
        <div className="p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Images</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Main Image</label>
              <div className="flex items-center gap-4">
                <input name="image" value={form.image} onChange={(e) => { handleChange(e); setImagePreview(e.target.value) }} className="flex-1 px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="Image URL or upload below" />
                <label className="cursor-pointer px-4 py-3 text-[10px] uppercase tracking-[0.12em] font-semibold text-white/50 hover:text-white transition-colors flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Upload
                </label>
              </div>
              {imagePreview && (
                <div className="relative inline-block mt-3">
                  <img src={normalizeMediaUrl(imagePreview)} alt="Preview" className="w-40 h-28 object-cover rounded-sm border border-white/10" />
                  <button 
                    type="button" 
                    onClick={removeMainImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[12px] hover:bg-red-600 shadow-lg transition-all"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <label className={labelClass}>Gallery URLs (one per line)</label>
              <div className="flex items-start gap-4 mb-2">
                <textarea name="gallery" value={form.gallery} onChange={handleChange} rows={4} className="flex-1 px-4 py-3 text-[13px] text-white outline-none resize-y" style={inputStyle} placeholder="https://...&#10;https://..." />
                <label className="cursor-pointer px-4 py-3 text-[10px] uppercase tracking-[0.12em] font-semibold text-white/50 hover:text-white transition-colors flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Upload Multiple
                  <input type="file" accept="image/*" multiple onChange={handleMultipleUpload} className="hidden" />
                </label>
              </div>
              {form.gallery && form.gallery.split('\n').filter(Boolean).length > 0 && (
                <>
                  <div className="text-[11px] text-[#c9a84c] mt-1 mb-2">{form.gallery.split('\n').filter(Boolean).length} gallery images attached</div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                    {form.gallery.split('\n').filter(Boolean).map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={normalizeMediaUrl(url)} alt={`Gallery ${i}`} className="w-full aspect-square object-cover rounded-sm border border-white/10" />
                        <button 
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500/90 rounded-full flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 shadow-xl z-10"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Video Tour</label>
                <div className="flex items-center gap-2">
                  <input name="video" value={form.video} onChange={handleChange} className="flex-1 px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="Video URL or upload" />
                  <label className="cursor-pointer px-4 py-3 text-[10px] uppercase tracking-[0.12em] font-semibold text-white/50 hover:text-white transition-colors shrink-0" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Video
                    <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className={labelClass}>Floor Plan</label>
                <input name="floorPlan" value={form.floorPlan} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="Floorplan Image URL" />
              </div>
            </div>
          </div>
        </div>

        {/* Flags */}
        <div className="p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Additional Options</h3>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-[#c9a84c]" />
              <span className="text-[12px] text-white/60">Featured Property</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="goldenVisa" checked={form.goldenVisa} onChange={handleChange} className="w-4 h-4 accent-[#c9a84c]" />
              <span className="text-[12px] text-white/60">Golden Visa Eligible</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="px-8 py-3.5 text-[11px] uppercase tracking-[0.18em] font-bold transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #c9a84c, #d4af37)', color: '#1a1a1a' }}>
            {loading ? 'Saving...' : isEditing ? 'Update Property' : 'Create Property'}
          </button>
          <button type="button" onClick={() => navigate('/admin/properties')} className="px-8 py-3.5 text-[11px] uppercase tracking-[0.18em] font-bold text-white/40 hover:text-white/60 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
