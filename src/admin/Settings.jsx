import { useState, useEffect } from 'react'
import { fetchAdminSettings, updateSettings } from '../utils/api'

export default function Settings() {
  const [settings, setSettings] = useState({
    address: '',
    phone: '',
    email: '',
    smtpUser: '',
    smtpAppPassword: '',
    managerEmail: '',
    propertyConsultantEmail: '',
    whatsapp: '',
    chatbotAi: {
      priority: ['openai', 'gemini', 'longcat'],
      openai: { isActive: true, apiKey: '', model: 'gpt-4o-mini' },
      gemini: { isActive: false, apiKey: '', model: 'gemini-2.0-flash' },
      longcat: { isActive: true, apiKey: '', model: 'LongCat-Flash-Chat', baseUrl: 'https://api.longcat.chat/openai/v1/chat/completions' },
    },
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
    fetchAdminSettings()
      .then((data) => {
        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
            smtpUser: data.smtpUser || '',
            smtpAppPassword: data.smtpAppPassword || '',
            managerEmail: data.managerEmail || '',
            propertyConsultantEmail: data.propertyConsultantEmail || '',
            chatbotAi: {
              ...prev.chatbotAi,
              ...(data.chatbotAi || {}),
              priority: Array.isArray(data.chatbotAi?.priority) ? data.chatbotAi.priority : prev.chatbotAi.priority,
              openai: { ...prev.chatbotAi.openai, ...(data.chatbotAi?.openai || {}) },
              gemini: { ...prev.chatbotAi.gemini, ...(data.chatbotAi?.gemini || {}) },
              longcat: { ...prev.chatbotAi.longcat, ...(data.chatbotAi?.longcat || {}) },
            },
            socials: { ...prev.socials, ...(data.socials || {}) },
          }))
        }
        setLoading(false)
      })
      .catch(() => {
        setMessage({ type: 'error', text: 'Could not load settings (admin session required).' })
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
    const { name, value, type, checked } = e.target
    if (name.startsWith('socials.')) {
      const socialKey = name.split('.')[1]
      setSettings(prev => ({
        ...prev,
        socials: { ...prev.socials, [socialKey]: value }
      }))
    } else if (name.startsWith('chatbotAi.')) {
      const parts = name.split('.')
      // chatbotAi.priority.0 / chatbotAi.openai.apiKey / chatbotAi.gemini.isActive etc.
      if (parts[1] === 'priority') {
        const idx = Number(parts[2])
        setSettings((prev) => {
          const next = Array.isArray(prev.chatbotAi?.priority) ? [...prev.chatbotAi.priority] : ['openai', 'gemini', 'longcat']
          next[idx] = value
          return { ...prev, chatbotAi: { ...prev.chatbotAi, priority: next } }
        })
        return
      }
      const provider = parts[1]
      const field = parts[2]
      setSettings((prev) => ({
        ...prev,
        chatbotAi: {
          ...prev.chatbotAi,
          [provider]: { ...(prev.chatbotAi?.[provider] || {}), [field]: type === 'checkbox' ? checked : value }
        }
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
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#c2a76d] mb-6 font-bold">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">Office Address</label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
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
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
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
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
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
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
              />
            </div>
          </div>
        </section>

        <section className="p-6 lg:p-8 rounded-lg bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#c2a76d] mb-2 font-bold">Outbound email (leads &amp; chatbot)</h2>
          <p className="text-[12px] text-white/35 mb-6" style={{ fontFamily: 'var(--font-body)' }}>
            Used to send contact form notifications and chatbot lead emails to agents. Gmail / Google Workspace: use the same account with a 16-character{' '}
            <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noreferrer" className="text-[#c2a76d]/90 hover:underline">App Password</a>
            (not your normal login password). If left empty here, the server falls back to <code className="text-white/50">EMAIL_USER</code> / <code className="text-white/50">EMAIL_PASS</code> in <code className="text-white/50">.env</code>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">SMTP sign-in email</label>
              <input
                type="email"
                name="smtpUser"
                value={settings.smtpUser}
                onChange={handleChange}
                placeholder="e.g. notifications@yourdomain.com"
                autoComplete="off"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">App password</label>
              <input
                type="password"
                name="smtpAppPassword"
                value={settings.smtpAppPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep the current saved password"
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
              />
              <p className="mt-2 text-[11px] text-white/30">Saving with this field empty does not erase an existing app password.</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">Manager email (hot leads &amp; fallbacks)</label>
              <input
                type="email"
                name="managerEmail"
                value={settings.managerEmail}
                onChange={handleChange}
                placeholder="Receives priority hot-lead alerts; also used if no area agent is found"
                autoComplete="off"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
              />
              <p className="mt-2 text-[11px] text-white/30">Optional. If set, hot leads go here (SMTP inbox is CC’d). You can also set <code className="text-white/50">MANAGER_EMAIL</code> in <code className="text-white/50">.env</code> instead.</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">Property consultant email (no area match)</label>
              <input
                type="email"
                name="propertyConsultantEmail"
                value={settings.propertyConsultantEmail}
                onChange={handleChange}
                placeholder="Receives 'talk to an agent' leads when no area agent is found"
                autoComplete="off"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
              />
              <p className="mt-2 text-[11px] text-white/30">Optional. If set, unmatched area leads go here first. You can also set <code className="text-white/50">CONSULTANT_EMAIL</code> in <code className="text-white/50">.env</code>.</p>
            </div>
          </div>
        </section>

        <section className="p-6 lg:p-8 rounded-lg bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#c2a76d] mb-2 font-bold">Chatbot AI providers</h2>
          <p className="text-[12px] text-white/35 mb-6" style={{ fontFamily: 'var(--font-body)' }}>
            Choose which AI provider is active and set a fallback priority. The chatbot uses the first active provider (with an API key), then falls back to the next.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded bg-black/20 border border-white/10">
              <div className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-semibold mb-2">Priority #1</div>
              <select
                name="chatbotAi.priority.0"
                value={settings.chatbotAi?.priority?.[0] || 'openai'}
                onChange={handleChange}
                style={{ colorScheme: 'dark' }}
                className="w-full px-3 py-2.5 bg-[#0b0f14] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
              >
                <option value="openai" style={{ backgroundColor: '#0b0f14', color: '#fff' }}>OpenAI</option>
                <option value="gemini" style={{ backgroundColor: '#0b0f14', color: '#fff' }}>Gemini</option>
                <option value="longcat" style={{ backgroundColor: '#0b0f14', color: '#fff' }}>Longcat</option>
              </select>
            </div>
            <div className="p-4 rounded bg-black/20 border border-white/10">
              <div className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-semibold mb-2">Priority #2</div>
              <select
                name="chatbotAi.priority.1"
                value={settings.chatbotAi?.priority?.[1] || 'gemini'}
                onChange={handleChange}
                style={{ colorScheme: 'dark' }}
                className="w-full px-3 py-2.5 bg-[#0b0f14] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
              >
                <option value="openai" style={{ backgroundColor: '#0b0f14', color: '#fff' }}>OpenAI</option>
                <option value="gemini" style={{ backgroundColor: '#0b0f14', color: '#fff' }}>Gemini</option>
                <option value="longcat" style={{ backgroundColor: '#0b0f14', color: '#fff' }}>Longcat</option>
              </select>
            </div>
            <div className="p-4 rounded bg-black/20 border border-white/10">
              <div className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-semibold mb-2">Priority #3</div>
              <select
                name="chatbotAi.priority.2"
                value={settings.chatbotAi?.priority?.[2] || 'longcat'}
                onChange={handleChange}
                style={{ colorScheme: 'dark' }}
                className="w-full px-3 py-2.5 bg-[#0b0f14] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
              >
                <option value="openai" style={{ backgroundColor: '#0b0f14', color: '#fff' }}>OpenAI</option>
                <option value="gemini" style={{ backgroundColor: '#0b0f14', color: '#fff' }}>Gemini</option>
                <option value="longcat" style={{ backgroundColor: '#0b0f14', color: '#fff' }}>Longcat</option>
              </select>
            </div>
            <p className="md:col-span-3 text-[11px] text-white/30" style={{ fontFamily: 'var(--font-body)' }}>
              Tip: avoid duplicates (e.g. OpenAI in all three). If duplicates exist, the server will still try in order but skip invalid entries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* OpenAI */}
            <div className="p-5 rounded bg-black/20 border border-white/10 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] uppercase tracking-[0.15em] text-white/70 font-semibold">OpenAI</div>
                <label className="flex items-center gap-2 text-[12px] text-white/50">
                  <input type="checkbox" name="chatbotAi.openai.isActive" checked={Boolean(settings.chatbotAi?.openai?.isActive)} onChange={handleChange} />
                  Active
                </label>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.12em] text-white/40 mb-2 font-semibold">API key</label>
                <input
                  type="password"
                  name="chatbotAi.openai.apiKey"
                  value={settings.chatbotAi?.openai?.apiKey || ''}
                  onChange={handleChange}
                  placeholder="sk-..."
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.12em] text-white/40 mb-2 font-semibold">Model</label>
                <input
                  type="text"
                  name="chatbotAi.openai.model"
                  value={settings.chatbotAi?.openai?.model || ''}
                  onChange={handleChange}
                  placeholder="gpt-4o-mini"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
                />
              </div>
              <p className="text-[11px] text-white/30">Env fallback: <code className="text-white/50">OPENAI_API_KEY</code></p>
            </div>

            {/* Gemini */}
            <div className="p-5 rounded bg-black/20 border border-white/10 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] uppercase tracking-[0.15em] text-white/70 font-semibold">Gemini</div>
                <label className="flex items-center gap-2 text-[12px] text-white/50">
                  <input type="checkbox" name="chatbotAi.gemini.isActive" checked={Boolean(settings.chatbotAi?.gemini?.isActive)} onChange={handleChange} />
                  Active
                </label>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.12em] text-white/40 mb-2 font-semibold">API key</label>
                <input
                  type="password"
                  name="chatbotAi.gemini.apiKey"
                  value={settings.chatbotAi?.gemini?.apiKey || ''}
                  onChange={handleChange}
                  placeholder="AIza..."
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.12em] text-white/40 mb-2 font-semibold">Model</label>
                <input
                  type="text"
                  name="chatbotAi.gemini.model"
                  value={settings.chatbotAi?.gemini?.model || ''}
                  onChange={handleChange}
                  placeholder="gemini-2.0-flash"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
                />
              </div>
              <p className="text-[11px] text-white/30">Env fallback: <code className="text-white/50">GEMINI_API_KEY</code></p>
            </div>

            {/* Longcat */}
            <div className="p-5 rounded bg-black/20 border border-white/10 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] uppercase tracking-[0.15em] text-white/70 font-semibold">Longcat</div>
                <label className="flex items-center gap-2 text-[12px] text-white/50">
                  <input type="checkbox" name="chatbotAi.longcat.isActive" checked={Boolean(settings.chatbotAi?.longcat?.isActive)} onChange={handleChange} />
                  Active
                </label>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.12em] text-white/40 mb-2 font-semibold">API key</label>
                <input
                  type="password"
                  name="chatbotAi.longcat.apiKey"
                  value={settings.chatbotAi?.longcat?.apiKey || ''}
                  onChange={handleChange}
                  placeholder="ak_..."
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.12em] text-white/40 mb-2 font-semibold">Model</label>
                <input
                  type="text"
                  name="chatbotAi.longcat.model"
                  value={settings.chatbotAi?.longcat?.model || ''}
                  onChange={handleChange}
                  placeholder="LongCat-Flash-Chat"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.12em] text-white/40 mb-2 font-semibold">Base URL</label>
                <input
                  type="text"
                  name="chatbotAi.longcat.baseUrl"
                  value={settings.chatbotAi?.longcat?.baseUrl || ''}
                  onChange={handleChange}
                  placeholder="https://api.longcat.chat/openai/v1/chat/completions"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
                />
              </div>
              <p className="text-[11px] text-white/30">Env fallback: <code className="text-white/50">LONGCAT_API_KEY</code></p>
            </div>
          </div>
        </section>

        {/* Social Links Section */}
        <section className="p-6 lg:p-8 rounded-lg bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#c2a76d] mb-6 font-bold">Social Presence</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">Instagram URL</label>
              <input
                type="url"
                name="socials.instagram"
                value={settings.socials.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">Facebook URL</label>
              <input
                type="url"
                name="socials.facebook"
                value={settings.socials.facebook}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 font-semibold">LinkedIn URL</label>
              <input
                type="url"
                name="socials.linkedin"
                value={settings.socials.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-[#c2a76d] hover:bg-[#b8973b] disabled:bg-[#c2a76d]/30 text-black text-[11px] uppercase tracking-[0.2em] font-bold rounded transition-all duration-300 shadow-lg shadow-gold-muted/10"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
