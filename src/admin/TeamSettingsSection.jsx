import { useState } from 'react'

const API = import.meta.env.VITE_API_BASE
const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || 'http://localhost:5000'

function normalizeMediaUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) return `${SERVER_BASE}${url}`
  return url
}

const emptyMember = () => ({
  name: '',
  role: '',
  bio: '',
  image: '',
  publicEmail: '',
  notifyEmail: '',
  routingKey: '',
  routingKeywords: '',
})

export default function TeamSettingsSection({ team, onTeamChange, loading }) {
  const [busyIdx, setBusyIdx] = useState(null)
  const list = Array.isArray(team) && team.length ? team : []

  const updateAt = (index, field, value) => {
    const next = [...list]
    next[index] = { ...next[index], [field]: value }
    onTeamChange(next)
  }

  const add = () => {
    onTeamChange([...list, emptyMember()])
  }

  const remove = (index) => {
    onTeamChange(list.filter((_, i) => i !== index))
  }

  const move = (index, dir) => {
    const j = index + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[index], next[j]] = [next[j], next[index]]
    onTeamChange(next)
  }

  const handleUpload = async (e, index) => {
    const file = e.target.files?.[0]
    if (!file) return
    const token = localStorage.getItem('admin_token')
    const formData = new FormData()
    formData.append('image', file)
    try {
      setBusyIdx(index)
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Upload failed')
      if (data.url) updateAt(index, 'image', data.url)
    } catch {
      alert('Image upload failed')
    } finally {
      setBusyIdx(null)
      e.target.value = ''
    }
  }

  const inputClass = 'w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded text-white text-[13px] outline-none focus:border-[#c2a76d]/50 transition-colors'
  const labelClass = 'block text-[10px] uppercase tracking-[0.12em] text-white/40 mb-1.5 font-semibold'

  return (
    <section className="p-6 lg:p-8 rounded-lg bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#c2a76d] mb-2 font-bold">About Page — Team</h2>
          <p className="text-[12px] text-white/40 max-w-xl" style={{ fontFamily: 'var(--font-body)' }}>
            Profiles shown on About. If you have more than four members, the site shows a horizontal carousel.
            Chatbot routing: set a unique Routing key and Notify email so the AI can alert the right person when a client asks for that advisor.
          </p>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={loading}
          className="px-5 py-3 text-[10px] uppercase tracking-[0.15em] font-bold bg-white/5 border border-white/10 hover:border-[#c2a76d]/30 text-white/70 rounded"
        >
          + Add member
        </button>
      </div>

      <div className="space-y-6">
        {list.length === 0 && (
          <p className="text-[13px] text-white/30 py-6 text-center border border-dashed border-white/10 rounded">
            No team members yet. Click &quot;Add member&quot; or save to use default About copy until you add profiles.
          </p>
        )}
        {list.map((m, i) => (
          <div key={i} className="p-5 rounded-lg bg-black/20 border border-white/[0.06] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#c2a76d] font-bold">Member {i + 1}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="px-2 py-1 text-[10px] text-white/40 hover:text-white disabled:opacity-20">Up</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} className="px-2 py-1 text-[10px] text-white/40 hover:text-white disabled:opacity-20">Down</button>
                <button type="button" onClick={() => remove(i)} className="px-3 py-1 text-[10px] text-red-400/60 hover:text-red-400">Remove</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name</label>
                <input className={inputClass} value={m.name || ''} onChange={(e) => updateAt(i, 'name', e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className={labelClass}>Role / Title</label>
                <input className={inputClass} value={m.role || ''} onChange={(e) => updateAt(i, 'role', e.target.value)} placeholder="e.g. Founder & Chief Advisory Officer" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Bio</label>
              <textarea rows={3} className={`${inputClass} resize-y min-h-[5rem]`} value={m.bio || ''} onChange={(e) => updateAt(i, 'bio', e.target.value)} placeholder="Short biography" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Photo</label>
                <input className={inputClass} value={m.image || ''} onChange={(e) => updateAt(i, 'image', e.target.value)} placeholder="Image URL" />
                <label className="mt-2 cursor-pointer inline-block px-4 py-2 text-[9px] uppercase tracking-widest font-bold bg-white/5 hover:bg-white/10 text-white/50 rounded border border-white/10">
                  {busyIdx === i ? 'Uploading…' : 'Upload image'}
                  <input type="file" className="hidden" accept="image/*" disabled={busyIdx !== null} onChange={(e) => handleUpload(e, i)} />
                </label>
                {m.image && (
                  <img src={normalizeMediaUrl(m.image)} alt="" className="mt-3 h-24 w-24 object-cover rounded border border-white/10" />
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Public email (optional, About page)</label>
                  <input type="email" className={inputClass} value={m.publicEmail || ''} onChange={(e) => updateAt(i, 'publicEmail', e.target.value)} placeholder="shown on site if set" />
                </div>
                <div>
                  <label className={labelClass}>Notify email (chatbot routing)</label>
                  <input type="email" className={inputClass} value={m.notifyEmail || ''} onChange={(e) => updateAt(i, 'notifyEmail', e.target.value)} placeholder="receives &quot;client wants to talk&quot; alerts" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Routing key (unique)</label>
                <input className={inputClass} value={m.routingKey || ''} onChange={(e) => updateAt(i, 'routingKey', e.target.value)} placeholder="e.g. founder, investment" />
              </div>
              <div>
                <label className={labelClass}>Match keywords (optional)</label>
                <input className={inputClass} value={m.routingKeywords || ''} onChange={(e) => updateAt(i, 'routingKeywords', e.target.value)} placeholder="founder, chief advisory, CEO" />
              </div>
            </div>
            <p className="text-[11px] text-white/25 leading-relaxed">
              Emails are sent using the Gmail credentials in server <code className="text-white/40">.env</code> (EMAIL_USER / EMAIL_PASS). Each advisor only needs a routing key + notify email.
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
