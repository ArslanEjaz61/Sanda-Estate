import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_BASE

export default function PropertyList() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const url = search ? `${API}/properties?search=${encodeURIComponent(search)}` : `${API}/properties`
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (Array.isArray(data)) setProperties(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchProperties()
    setCurrentPage(1) // Reset to first page on search
  }, [search])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return
    try {
      const token = localStorage.getItem('admin_token')
      await fetch(`${API}/properties/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setProperties(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      alert('Error deleting property')
    }
  }

  // Pagination Logic
  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE)
  const paginatedProperties = properties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-[28px] mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Properties</h1>
          <p className="text-[13px] text-white/35" style={{ fontFamily: 'var(--font-body)' }}>{properties.length} properties found</p>
        </div>
        <Link to="/admin/properties/new" className="px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] font-bold" style={{ background: '#c2a76d', color: '#1a1a1a', fontFamily: 'var(--font-body)' }}>
          + Add Property
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search properties..." className="w-full max-w-md px-4 py-3 text-[13px] text-white outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)' }} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontFamily: 'var(--font-body)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Image</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Title</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Type</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Location</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Price</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Status</th>
              <th className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="py-10 text-center text-white/30 text-[13px]">Loading...</td></tr>
            ) : properties.length === 0 ? (
              <tr><td colSpan="7" className="py-10 text-center text-white/30 text-[13px]">No properties found</td></tr>
            ) : (
              paginatedProperties.map(p => (
                <tr key={p._id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-3 px-4">
                    {p.image ? <img src={p.image} alt="" className="w-14 h-10 object-cover rounded-sm" /> : <div className="w-14 h-10 bg-white/5 rounded-sm" />}
                  </td>
                  <td className="py-3 px-4 text-[13px] text-white/70 max-w-[200px] truncate">{p.title}</td>
                  <td className="py-3 px-4 text-[12px] text-white/40">{p.type}</td>
                  <td className="py-3 px-4 text-[12px] text-white/40">{p.location}</td>
                  <td className="py-3 px-4 text-[12px] text-[#c2a76d]">{p.priceFormatted || `AED ${p.price?.toLocaleString()}`}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 text-[9px] uppercase tracking-[0.1em] font-bold" style={{ background: p.status === 'Ready' ? 'rgba(47,30,22,0.15)' : 'rgba(194,167,109,0.15)', color: p.status === 'Ready' ? '#2f1e16' : '#c2a76d' }}>{p.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/admin/properties/edit/${p._id}`)} className="px-3 py-1.5 text-[9px] uppercase tracking-[0.1em] font-semibold text-white/50 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="px-3 py-1.5 text-[9px] uppercase tracking-[0.1em] font-semibold text-red-400/50 hover:text-red-400 transition-colors" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between" style={{ fontFamily: 'var(--font-body)' }}>
          <div className="text-[12px] text-white/40">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, properties.length)} of {properties.length} properties
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] font-semibold transition-colors disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'white' }}
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] font-semibold transition-colors disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'white' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
