import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_BASE

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, featured: 0, ready: 0, offPlan: 0, leads: 0 })
  const [recent, setRecent] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    let alive = true

    const fetchProperties = () => {
      fetch(`${API}/properties`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (!alive) return
          if (Array.isArray(data)) {
            setStats(prev => ({
              ...prev,
              total: data.length,
              featured: data.filter(p => p.featured).length,
              ready: data.filter(p => p.status === 'Ready').length,
              offPlan: data.filter(p => p.status === 'Off-Plan').length,
            }))
            setRecent(data.slice(0, 5))
          }
        })
        .catch(() => {})
    }

    const fetchLeadsCount = () => {
      fetch(`${API}/contact`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (!alive) return
          if (Array.isArray(data)) {
            setStats(prev => ({ ...prev, leads: data.length }))
          }
        })
        .catch(() => {})
    }

    // initial
    fetchProperties()
    fetchLeadsCount()

    // refresh counts periodically so dashboard doesn't need reload
    const leadsId = setInterval(fetchLeadsCount, 12000)

    return () => {
      alive = false
      clearInterval(leadsId)
    }
  }, [])

  const statCards = [
    { label: 'Total Properties', value: stats.total, color: '#0e3a2f' },
    { label: 'Featured', value: stats.featured, color: '#c2a76d' },
    { label: 'Off-Plan', value: stats.offPlan, color: '#155544' },
    { label: 'Total Leads', value: stats.leads, color: '#1c6f59' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-[28px] mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Dashboard</h1>
        <p className="text-[13px] text-white/35" style={{ fontFamily: 'var(--font-body)' }}>Overview of your property portfolio</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((s, i) => (
          <div key={i} className="p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[32px] mb-1" style={{ fontFamily: 'var(--font-heading)', color: s.color, fontWeight: 400 }}>{s.value}</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-white/35 font-semibold" style={{ fontFamily: 'var(--font-body)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-white text-[18px]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Recent Properties</h3>
        <Link to="/admin/properties" className="text-[10px] uppercase tracking-[0.12em] text-[#c2a76d]/60 hover:text-[#c2a76d] font-semibold transition-colors" style={{ fontFamily: 'var(--font-body)' }}>View All →</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontFamily: 'var(--font-body)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Property</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Type</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Price</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(p => (
              <tr key={p._id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {p.image && <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-sm" />}
                    <span className="text-[13px] text-white/70">{p.title}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-[12px] text-white/40">{p.type}</td>
                <td className="py-3 px-4 text-[12px] text-[#c2a76d]">{p.priceFormatted || `AED ${p.price?.toLocaleString()}`}</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-1 text-[9px] uppercase tracking-[0.1em] font-bold" style={{ background: p.status === 'Ready' ? 'rgba(14,58,47,0.15)' : 'rgba(194,167,109,0.15)', color: p.status === 'Ready' ? '#0e3a2f' : '#c2a76d' }}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
