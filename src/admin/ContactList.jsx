import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API = import.meta.env.VITE_API_BASE

export default function ContactList() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)

  const fetchContacts = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true)
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${API}/contact`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (Array.isArray(data)) {
        setContacts(data)
        setSelectedMessage((prev) => {
          if (!prev?._id) return prev
          const fresh = data.find((c) => c._id === prev._id)
          return fresh || prev
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let alive = true
    fetchContacts()
    const id = setInterval(() => {
      if (!alive) return
      fetchContacts({ silent: true })
    }, 12000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  const handleMarkRead = async (id, currentStatus) => {
    if (currentStatus === 'read') return
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${API}/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'read' })
      })
      if (res.ok) {
        setContacts(prev => prev.map(c => c._id === id ? { ...c, status: 'read' } : c))
      }
    } catch (err) {
      console.error('Failed to mark as read')
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this message?')) return
    try {
      const token = localStorage.getItem('admin_token')
      await fetch(`${API}/contact/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setContacts(prev => prev.filter(c => c._id !== id))
      if (selectedMessage?._id === id) setSelectedMessage(null)
    } catch (err) {
      alert('Error deleting message')
    }
  }

  const openMessage = (contact) => {
    setSelectedMessage(contact)
    handleMarkRead(contact._id, contact.status)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-[28px] mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Leads</h1>
        <p className="text-[13px] text-white/35" style={{ fontFamily: 'var(--font-body)' }}>{contacts.length} total leads from website</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontFamily: 'var(--font-body)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Status</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Date</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Name</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Email</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold whitespace-nowrap">Phone</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold max-w-[200px]">Message Preview</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="py-10 text-center text-white/30 text-[13px]">Loading messages...</td></tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-24 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-40">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <div>
                      <h3 className="text-[16px] text-white font-medium mb-1">Your pipeline is ready!</h3>
                      <p className="text-[13px] text-white/50 max-w-[280px] mx-auto">All inquiries from the website will appear here automatically as leads.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              contacts.map(c => (
                <tr 
                  key={c._id} 
                  onClick={() => openMessage(c)}
                  className={`cursor-pointer transition-colors ${c.status === 'unread' ? 'bg-white/[0.04] hover:bg-white/[0.06]' : 'hover:bg-white/[0.02]'}`} 
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <td className="py-4 px-4">
                    {c.status === 'unread' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                    ) : (
                      <span className="text-[11px] text-white/30 px-1">Read</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-[12px] text-white/50">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className={`py-4 px-4 text-[13px] ${c.status === 'unread' ? 'text-white font-semibold' : 'text-white/70'}`}>{c.name}</td>
                  <td className="py-4 px-4 text-[12px] text-white/50">{c.email}</td>
                  <td className="py-4 px-4 text-[12px] text-white/60 whitespace-nowrap max-w-[140px]">
                    {c.phone ? (
                      <a
                        href={`tel:${String(c.phone).replace(/\s+/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#c2a76d] hover:underline"
                      >
                        {c.phone}
                      </a>
                    ) : (
                      <span className="text-white/25">—</span>
                    )}
                  </td>
                  <td className={`py-4 px-4 text-[13px] max-w-[250px] truncate ${c.status === 'unread' ? 'text-white/80' : 'text-white/40'}`}>
                    {c.message || 'No message provided...'}
                  </td>
                  <td className="py-4 px-4">
                    <button onClick={(e) => handleDelete(c._id, e)} className="px-3 py-1.5 text-[9px] uppercase tracking-[0.1em] font-semibold text-red-400/50 hover:text-red-400 transition-colors" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-2xl bg-[#111111] border border-white/10 rounded-sm shadow-2xl flex flex-col max-h-[90vh]">
              
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-[20px] text-white" style={{ fontFamily: 'var(--font-heading)' }}>Inquiry Details</h2>
                <button onClick={() => setSelectedMessage(null)} className="text-white/40 hover:text-white transition-colors">✕</button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6" style={{ fontFamily: 'var(--font-body)' }}>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-1">Name</div>
                    <div className="text-[14px] text-white/90">{selectedMessage.name}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-1">Date Received</div>
                    <div className="text-[14px] text-white/90">{new Date(selectedMessage.createdAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-1">Email</div>
                    <a href={`mailto:${selectedMessage.email}`} className="text-[14px] text-[#c2a76d] hover:underline">{selectedMessage.email}</a>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-1">Phone</div>
                    {selectedMessage.phone ? (
                      <a href={`tel:${String(selectedMessage.phone).replace(/\s+/g, '')}`} className="text-[14px] text-[#c2a76d] hover:underline">
                        {selectedMessage.phone}
                      </a>
                    ) : (
                      <div className="text-[14px] text-white/40">N/A</div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-sm grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-1">Budget</div>
                    <div className="text-[13px] text-white/80">{selectedMessage.budget || 'Any'}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-1">Interested Area</div>
                    <div className="text-[13px] text-white/80">{selectedMessage.area || 'Any'}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-1">Property Type</div>
                    <div className="text-[13px] text-white/80">{selectedMessage.propertyType || 'Any'}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-2">Message</div>
                  <div className="text-[14px] leading-relaxed text-white/80 whitespace-pre-wrap p-4 bg-white/[0.02] border border-white-[0.05] rounded-sm">
                    {selectedMessage.message || 'No additional message provided.'}
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
