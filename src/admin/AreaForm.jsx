import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API = 'http://localhost:5000/api'

const emptyForm = {
  name: '',
  slug: '',
  tagline: '',
  shortDescription: '',
  description: '',
  lifestyle: '',
  investmentAppeal: '',
  stats: {
    avgPrice: '',
    rentalYield: '',
    priceGrowth: '',
    totalUnits: '',
  },
  image: '',
  heroImage: '',
}

export default function AreaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditing) {
      const fetchArea = async () => {
        try {
          const res = await fetch(`${API}/areas`)
          const data = await res.json()
          const area = data.find(a => a._id === id)
          if (area) setForm(area)
        } catch (err) {
          setError('Failed to load area')
        }
      }
      fetchArea()
    }
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('stat_')) {
      const statKey = name.replace('stat_', '')
      setForm(prev => ({
        ...prev,
        stats: { ...prev.stats, [statKey]: value }
      }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
      if (name === 'name' && !isEditing) {
        setForm(prev => ({ ...prev, slug: value.toLowerCase().replace(/\s+/g, '-') }))
      }
    }
  }

  const handleUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    const token = localStorage.getItem('admin_token')
    const formData = new FormData()
    formData.append('image', file)
    try {
      setLoading(true)
      const res = await fetch(`${API}/upload`, { 
        method: 'POST', 
        headers: { Authorization: `Bearer ${token}` }, 
        body: formData 
      })
      const data = await res.json()
      if (data.url) {
        setForm(prev => ({ ...prev, [field]: data.url }))
      }
    } catch (err) { 
      setError('Upload failed') 
    } finally { 
      setLoading(false) 
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const token = localStorage.getItem('admin_token')
    try {
      const url = isEditing ? `${API}/areas/${id}` : `${API}/areas`
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Operation failed')
      }
      navigate('/admin/areas')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)' }
  const labelClass = "block text-[9px] uppercase tracking-[0.15em] text-white/35 font-semibold mb-2"

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-white text-[28px] mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>{isEditing ? 'Edit Area' : 'Add New Area'}</h1>
        <p className="text-[13px] text-white/35" style={{ fontFamily: 'var(--font-body)' }}>Define neighborhood characteristics and investment stats</p>
      </div>

      {error && (
        <div className="mb-6 p-3 text-[12px] text-red-300 bg-red-500/10 border border-red-500/20">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="p-6 bg-white/[0.02] border border-white/10">
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Identity</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. Palm Jumeirah" />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input name="slug" value={form.slug} onChange={handleChange} required className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="palm-jumeirah" />
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Tagline *</label>
              <input name="tagline" value={form.tagline} onChange={handleChange} required className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. The Icon of Island Living" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 bg-white/[0.02] border border-white/10">
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Content</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Short Description (Grid Cards)</label>
              <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} className="w-full px-4 py-3 text-[13px] text-white outline-none resize-none" style={inputStyle} />
            </div>
            <div>
              <label className={labelClass}>Description (Detail Page)</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Lifestyle Details</label>
                <textarea name="lifestyle" value={form.lifestyle} onChange={handleChange} rows={3} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} />
              </div>
              <div>
                <label className={labelClass}>Investment Appeal</label>
                <textarea name="investmentAppeal" value={form.investmentAppeal} onChange={handleChange} rows={3} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 bg-white/[0.02] border border-white/10">
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Market Stats</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div><label className={labelClass}>Avg Price</label><input name="stat_avgPrice" value={form.stats.avgPrice} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="AED 3,200/sq ft" /></div>
            <div><label className={labelClass}>Rental Yield</label><input name="stat_rentalYield" value={form.stats.rentalYield} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="5.2%" /></div>
            <div><label className={labelClass}>Price Growth</label><input name="stat_priceGrowth" value={form.stats.priceGrowth} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="+18% YoY" /></div>
            <div><label className={labelClass}>Total Units</label><input name="stat_totalUnits" value={form.stats.totalUnits} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="4,000+" /></div>
          </div>
        </div>

        {/* Images */}
        <div className="p-6 bg-white/[0.02] border border-white/10">
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Visuals</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Preview Image (800w)</label>
              <div className="space-y-4">
                <input name="image" value={form.image} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} />
                <label className="cursor-pointer block text-center py-3 text-[10px] uppercase tracking-widest font-bold bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                  Upload Image
                  <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'image')} />
                </label>
              </div>
            </div>
            <div>
              <label className={labelClass}>Hero Background (1920w)</label>
              <div className="space-y-4">
                <input name="heroImage" value={form.heroImage} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} />
                <label className="cursor-pointer block text-center py-3 text-[10px] uppercase tracking-widest font-bold bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                  Upload Hero
                  <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'heroImage')} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/admin/areas')} className="px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="btn-gold !px-12">
            {loading ? 'Saving...' : isEditing ? 'Update Area' : 'Publish Area'}
          </button>
        </div>
      </form>
    </div>
  )
}
