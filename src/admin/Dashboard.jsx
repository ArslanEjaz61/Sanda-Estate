import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_BASE

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, featured: 0, ready: 0, offPlan: 0, leads: 0 })
  const [recent, setRecent] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    // Fetch Properties
    fetch(`${API}/properties`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
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

    // Fetch Leads Count
    fetch(`${API}/contact`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStats(prev => ({ ...prev, leads: data.length }))
        }
      })
      .catch(() => {})
  }, [])

  const statCards = [
    { label: 'Total Properties', value: stats.total, color: '#0E3A2F' },
    { label: 'Featured', value: stats.featured, color: '#C2A76D' },
    { label: 'Off-Plan', value: stats.offPlan, color: '#0a7c5e' },
    { label: 'Total Leads', value: stats.leads, color: '#047857' },
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
        <Link to="/admin/properties" className="text-[10px] uppercase tracking-[0.12em] text-[#C2A76D]/60 hover:text-[#C2A76D] font-semibold transition-colors" style={{ fontFamily: 'var(--font-body)' }}>View All →</Link>
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
                <td className="py-3 px-4 text-[12px] text-[#C2A76D]">{p.priceFormatted || `AED ${p.price?.toLocaleString()}`}</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-1 text-[9px] uppercase tracking-[0.1em] font-bold" style={{ background: p.status === 'Ready' ? 'rgba(4,120,87,0.15)' : 'rgba(201,168,76,0.15)', color: p.status === 'Ready' ? '#047857' : '#C2A76D' }}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
