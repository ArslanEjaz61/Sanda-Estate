import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchAreas } from '../../utils/api'

export default function LeadCaptureForm({ variant = 'full', light = false }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', budget: '', area: '', propertyType: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [areas, setAreas] = useState([])

  useEffect(() => {
    fetchAreas().then(data => {
      if (data) setAreas(data)
    })
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    setSubmitError('')
    setSending(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 5000)
        setFormData({ name: '', email: '', phone: '', budget: '', area: '', propertyType: '', message: '' })
      } else {
        let serverMsg = ''
        try {
          const data = await res.json()
          serverMsg = data?.message ? String(data.message) : ''
        } catch {
          // ignore
        }
        setSubmitError(serverMsg || 'Failed to send message. Please try again.')
      }
    } catch (err) {
      setSubmitError('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const inputClass = light ? 'premium-input premium-input-dark' : 'premium-input'

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key="form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <fieldset disabled={sending} className="border-0 p-0 m-0 min-w-0 space-y-4">
          {/* Trust Strip */}
          <div className="flex items-center gap-4 mb-2 pb-4" style={{ borderBottom: `1px solid ${light ? 'rgba(255,255,255,0.08)' : '#f7f6f3'}` }}>
            {['Confidential', 'Tailored Guidance', 'No Obligation'].map((item, i) => (
              <span key={i} className={`text-[9px] uppercase tracking-[0.15em] font-semibold flex items-center gap-1.5 ${light ? 'text-white/40' : 'text-gray-soft'}`} style={{ fontFamily: 'var(--font-body)' }}>
                <span style={{ color: '#c2a76d', fontSize: '6px' }}>◆</span>
                {item}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="premium-label" style={light ? { color: 'rgba(255,255,255,0.4)' } : {}}>Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className="premium-label" style={light ? { color: 'rgba(255,255,255,0.4)' } : {}}>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="premium-label" style={light ? { color: 'rgba(255,255,255,0.4)' } : {}}>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+971 50 000 0000" className={inputClass} />
            </div>
            <div>
              <label className="premium-label" style={light ? { color: 'rgba(255,255,255,0.4)' } : {}}>Budget</label>
              <select name="budget" value={formData.budget} onChange={handleChange} className={inputClass}>
                <option value="">Select budget</option>
                <option value="under-2m">Under AED 2M</option>
                <option value="2m-5m">AED 2M – 5M</option>
                <option value="5m-10m">AED 5M – 10M</option>
                <option value="10m-25m">AED 10M – 25M</option>
                <option value="25m+">AED 25M+</option>
              </select>
            </div>
          </div>

          {variant === 'full' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="premium-label" style={light ? { color: 'rgba(255,255,255,0.4)' } : {}}>Preferred Area</label>
                <select name="area" value={formData.area} onChange={handleChange} className={inputClass}>
                  <option value="">Select area</option>
                  {areas.map(a => (
                    <option key={a._id} value={a.slug}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="premium-label" style={light ? { color: 'rgba(255,255,255,0.4)' } : {}}>Property Type</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={inputClass}>
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="premium-label" style={light ? { color: 'rgba(255,255,255,0.4)' } : {}}>Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows={3} placeholder="Tell us about your property requirements..." className={`${inputClass} resize-none`} />
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={sending}
          className="btn-gold w-full text-center disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
        >
          {sending ? 'Sending…' : 'Request Private Consultation'}
        </button>

        {sending && (
          <p
            className={`text-center text-[12px] pt-1 ${light ? 'text-white/45' : 'text-[#0e3a2f]/70'}`}
            style={{ fontFamily: 'var(--font-body)' }}
            aria-live="polite"
          >
            Sending your message…
          </p>
        )}

        {submitted && !sending && !submitError && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className={`mt-3 rounded px-4 py-3 text-[12px] ${light ? 'bg-emerald-400/10 text-emerald-200 border border-emerald-400/20' : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'}`}
            style={{ fontFamily: 'var(--font-body)' }}
            role="status"
            aria-live="polite"
          >
            Message sent successfully. Our advisory team will contact you soon.
          </motion.div>
        )}

        {submitError && !sending && (
          <p className="text-center text-[12px] text-red-600/90 pt-1" style={{ fontFamily: 'var(--font-body)' }} role="alert">
            {submitError}
          </p>
        )}
      </motion.form>
    </AnimatePresence>
  )
}
