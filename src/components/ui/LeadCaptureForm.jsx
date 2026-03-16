import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LeadCaptureForm({ variant = 'full', light = false }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', budget: '', area: '', propertyType: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 5000)
        setFormData({ name: '', email: '', phone: '', budget: '', area: '', propertyType: '', message: '' })
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (err) {
      alert('Network error. Please try again.')
    }
  }

  const inputClass = light ? 'premium-input premium-input-dark' : 'premium-input'

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-14"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #c9a84c, #d4af37)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h3 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-heading)', color: light ? '#fff' : '#1a1a1a' }}>
            Thank You
          </h3>
          <p className={`text-[13px] ${light ? 'text-white/50' : 'text-gray-warm'}`} style={{ fontFamily: 'var(--font-body)' }}>
            Our advisory team will contact you within 24 hours.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Trust Strip */}
          <div className="flex items-center gap-4 mb-2 pb-4" style={{ borderBottom: `1px solid ${light ? 'rgba(255,255,255,0.08)' : '#f0ebe5'}` }}>
            {['Confidential', 'Tailored Guidance', 'No Obligation'].map((item, i) => (
              <span key={i} className={`text-[9px] uppercase tracking-[0.15em] font-semibold flex items-center gap-1.5 ${light ? 'text-white/40' : 'text-gray-soft'}`} style={{ fontFamily: 'var(--font-body)' }}>
                <span style={{ color: '#c9a84c', fontSize: '6px' }}>◆</span>
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
                  <option value="palm-jumeirah">Palm Jumeirah</option>
                  <option value="downtown">Downtown Dubai</option>
                  <option value="marina">Dubai Marina</option>
                  <option value="dubai-hills">Dubai Hills</option>
                  <option value="business-bay">Business Bay</option>
                  <option value="jvc">JVC</option>
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

          <button type="submit" className="btn-gold w-full text-center">
            Request Private Consultation
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
