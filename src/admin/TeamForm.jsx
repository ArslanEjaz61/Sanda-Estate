import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createTeamMember, fetchTeamAdmin, updateTeamMember } from '../utils/teamApi'
import { fetchAreas } from '../utils/api'

const API = import.meta.env.VITE_API_BASE
const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || 'http://localhost:5000'

function normalizeMediaUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) return `${SERVER_BASE}${url}`
  return url
}

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  image: '',
  phone: '',
  publicEmail: '',
  notifyEmail: '',
  routingKey: '',
  routingKeywords: '',
  sortOrder: 0,
  isActive: true,
}

export default function TeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [areas, setAreas] = useState([])

  useEffect(() => {
    fetchAreas()
      .then((data) => {
        if (Array.isArray(data)) {
          setAreas([...data].sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''))))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEditing) return
    fetchTeamAdmin()
      .then((data) => {
        const m = Array.isArray(data) ? data.find(x => x._id === id) : null
        if (m) setForm({ ...emptyForm, ...m })
      })
      .catch(() => setError('Failed to load team member'))
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
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
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Upload failed')
      if (data.url) setForm(prev => ({ ...prev, image: data.url }))
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEditing) await updateTeamMember(id, form)
      else await createTeamMember(form)
      navigate('/admin/team')
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)' }
  const labelClass = 'block text-[9px] uppercase tracking-[0.15em] text-white/35 font-semibold mb-2'

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-white text-[28px] mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>{isEditing ? 'Edit Team Member' : 'Add Team Member'}</h1>
        <p className="text-[13px] text-white/35" style={{ fontFamily: 'var(--font-body)' }}>Shown on About page; used for chatbot email routing</p>
      </div>

      {error && (
        <div className="mb-6 p-3 text-[12px] text-red-300 bg-red-500/10 border border-red-500/20">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-white/[0.02] border border-white/10">
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Profile</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} />
            </div>
            <div>
              <label className={labelClass}>Role / Title *</label>
              <input name="role" value={form.role} onChange={handleChange} required className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} />
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Area (optional)</label>
              <select
                name="areaSlug"
                value={form.areaSlug || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 text-[13px] text-white outline-none"
                style={inputStyle}
              >
                <option value="" style={{ color: '#ffffff', background: '#1a1a1a' }}>— Not set —</option>
                {areas.map((a) => (
                  <option key={a._id || a.slug} value={a.slug} style={{ color: '#ffffff', background: '#1a1a1a' }}>
                    {a.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-[11px] text-white/25">Shows which community this advisor covers on the About page.</p>
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="w-full px-4 py-3 text-[13px] text-white outline-none resize-y" style={inputStyle} />
            </div>
            <div>
              <label className={labelClass}>Mobile (optional)</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="+971 …" />
            </div>
            <div>
              <label className={labelClass}>Public email (optional)</label>
              <input type="email" name="publicEmail" value={form.publicEmail} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/[0.02] border border-white/10">
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Photo</h3>
          <div className="space-y-4">
            <input name="image" value={form.image} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="Image URL" />
            <label className="cursor-pointer block text-center py-3 text-[10px] uppercase tracking-widest font-bold bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
              Upload Image
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
            </label>
            {form.image && (
              <img src={normalizeMediaUrl(form.image)} alt="" className="w-40 h-40 object-cover rounded-sm border border-white/10" />
            )}
          </div>
        </div>

        <div className="p-6 bg-white/[0.02] border border-white/10">
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Chatbot routing</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Routing key</label>
              <input name="routingKey" value={form.routingKey} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="e.g. founder, investment" />
            </div>
            <div>
              <label className={labelClass}>Notify email</label>
              <input type="email" name="notifyEmail" value={form.notifyEmail} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="advisor@email.com" />
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Keywords (optional)</label>
              <input name="routingKeywords" value={form.routingKeywords} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} placeholder="founder, chief advisory, investment advisory" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/[0.02] border border-white/10">
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Publishing</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Sort order</label>
              <input type="number" name="sortOrder" value={form.sortOrder} onChange={handleChange} className="w-full px-4 py-3 text-[13px] text-white outline-none" style={inputStyle} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input id="isActive" type="checkbox" name="isActive" checked={Boolean(form.isActive)} onChange={handleChange} />
              <label htmlFor="isActive" className="text-[12px] text-white/60" style={{ fontFamily: 'var(--font-body)' }}>Active (show on About)</label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/admin/team')} className="px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="btn-gold !px-12">
            {loading ? 'Saving...' : isEditing ? 'Update Member' : 'Publish Member'}
          </button>
        </div>
      </form>
    </div>
  )
}

