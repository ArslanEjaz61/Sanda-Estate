import { useState, useEffect } from 'react'
import { fetchSettings, updateSettings } from '../utils/api'

export default function Settings() {
  const [settings, setSettings] = useState({
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    socials: {
      instagram: '',
      facebook: '',
      linkedin: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchSettings().then(data => {
      if (data) setSettings(data)
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      await updateSettings(settings)
      setMessage({ type: 'success', text: 'Settings updated successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('socials.')) {
      const socialKey = name.split('.')[1]
      setSettings(prev => ({
        ...prev,
        socials: { ...prev.socials, [socialKey]: value }
      }))
    } else {
      setSettings(prev => ({ ...prev, [name]: value }))
    }
  }

  if (loading) return <div className="text-white/50 text-[13px]">Loading settings...</div>

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl text-white mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>Site Settings</h1>
        <p className="text-[13px] text-white/40" style={{ fontFamily: 'var(--font-body)' }}>Update global contact details and social media links appearing across the site.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded text-[12px] font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Contact Section */}
        <section className="p-6 lg:p-8 rounded-lg bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#C2A76D] mb-6 font-bold">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">Office Address</label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#C2A76D]/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">Contact Phone</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#C2A76D]/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">Contact Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#C2A76D]/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">WhatsApp Number (For links)</label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                placeholder="e.g. 97144541313"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#C2A76D]/50 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Social Links Section */}
        <section className="p-6 lg:p-8 rounded-lg bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#C2A76D] mb-6 font-bold">Social Presence</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">Instagram URL</label>
              <input
                type="url"
                name="socials.instagram"
                value={settings.socials.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#C2A76D]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">Facebook URL</label>
              <input
                type="url"
                name="socials.facebook"
                value={settings.socials.facebook}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#C2A76D]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">LinkedIn URL</label>
              <input
                type="url"
                name="socials.linkedin"
                value={settings.socials.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#C2A76D]/50 transition-colors"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-[#C2A76D] hover:bg-[#b8973b] disabled:bg-[#C2A76D]/30 text-black text-[11px] uppercase tracking-[0.2em] font-bold rounded transition-all duration-300 shadow-lg shadow-gold-muted/10"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
