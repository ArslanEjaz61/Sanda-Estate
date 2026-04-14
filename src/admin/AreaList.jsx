import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const API = 'http://localhost:5000/api'

export default function AreaList() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAreas = async () => {
    try {
      const res = await fetch(`${API}/areas`)
      const data = await res.json()
      if (Array.isArray(data)) setAreas(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAreas() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this area? Properties linked to this area will still exist but might lose their connection.')) return
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${API}/areas/${id}`, { 
        method: 'DELETE', 
        headers: { Authorization: `Bearer ${token}` } 
      })
      if (res.ok) {
        setAreas(prev => prev.filter(a => a._id !== id))
      }
    } catch (err) {
      alert('Delete failed')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-white text-[28px] mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Dubai Communities</h1>
          <p className="text-[13px] text-white/35" style={{ fontFamily: 'var(--font-body)' }}>Manage neighborhoods and area details</p>
        </div>
        <Link to="/admin/areas/new" className="btn-gold !py-2.5 !px-6 !text-[11px]">Add New Area</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-white/20">Loading areas...</div>
        ) : areas.length === 0 ? (
          <div className="col-span-full py-20 text-center text-white/20">No areas found. Add your first area to get started.</div>
        ) : (
          areas.map((area, i) => (
            <motion.div 
              key={area._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden bg-white/[0.03] border border-white/10 p-5 rounded-sm"
            >
              <div className="aspect-video mb-4 overflow-hidden bg-charcoal">
                {area.image ? (
                  <img src={area.image} alt={area.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 uppercase tracking-widest text-[10px]">No Image</div>
                )}
              </div>
              <h3 className="text-white text-[18px] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{area.name}</h3>
              <p className="text-white/40 text-[11px] uppercase tracking-[0.1em] mb-4">{area.tagline}</p>
              
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <Link to={`/admin/areas/edit/${area._id}`} className="flex-1 py-2 text-center text-[10px] uppercase tracking-widest font-bold bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all">Edit Details</Link>
                <button 
                  onClick={() => handleDelete(area._id)} 
                  className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
