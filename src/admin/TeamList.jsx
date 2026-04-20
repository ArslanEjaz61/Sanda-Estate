import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchTeamAdmin, deleteTeamMember } from '../utils/teamApi'
import { fetchAreas } from '../utils/api'

export default function TeamList() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [areaNameBySlug, setAreaNameBySlug] = useState({})

  useEffect(() => {
    fetchAreas()
      .then((data) => {
        if (Array.isArray(data)) {
          const map = {}
          data.forEach((a) => {
            if (a.slug) map[a.slug] = a.name || a.slug
          })
          setAreaNameBySlug(map)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchTeamAdmin()
      .then((data) => { if (Array.isArray(data)) setMembers(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return
    try {
      await deleteTeamMember(id)
      setMembers(prev => prev.filter(m => m._id !== id))
    } catch (e) {
      alert(e.message || 'Delete failed')
    }
  }

  const filteredMembers = members.filter((m) => {
    if (!searchTerm) return true
    const q = searchTerm.toLowerCase()
    return [
      m.name,
      m.role,
      m.routingKey,
      m.notifyEmail,
      m.publicEmail,
      m.phone,
      m.routingKeywords,
      m.areaSlug,
      areaNameBySlug[m.areaSlug],
    ].some((v) => String(v || '').toLowerCase().includes(q))
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-white text-[28px] mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Team</h1>
          <p className="text-[13px] text-white/35" style={{ fontFamily: 'var(--font-body)' }}>Manage About page team profiles and chatbot routing</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/[0.03] border border-white/10 px-4 py-2.5 rounded-sm text-[12px] text-white outline-none focus:border-gold-muted/30 transition-all w-64"
              style={{ fontFamily: 'var(--font-body)' }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          <Link to="/admin/team/new" className="btn-gold !py-2.5 !px-6 !text-[11px]">Add Team Member</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-white/20">Loading team...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="col-span-full py-20 text-center text-white/20">No team members found. Add your first profile.</div>
        ) : (
          filteredMembers.map((m, i) => (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden bg-white/[0.03] border border-white/10 p-5 rounded-sm"
            >
              <div className="aspect-video mb-4 overflow-hidden bg-charcoal">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 uppercase tracking-widest text-[10px]">No Image</div>
                )}
              </div>
              <h3 className="text-white text-[18px] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{m.name}</h3>
              <p className="text-white/40 text-[11px] uppercase tracking-[0.1em] mb-3">{m.role}</p>
              <div className="text-[11px] text-white/35 mb-4 space-y-1">
                <div><span className="text-white/20">area:</span> {m.areaSlug ? (areaNameBySlug[m.areaSlug] || m.areaSlug) : '—'}</div>
                <div><span className="text-white/20">phone:</span> {m.phone || '—'}</div>
                <div><span className="text-white/20">routingKey:</span> {m.routingKey || '—'}</div>
                <div><span className="text-white/20">notifyEmail:</span> {m.notifyEmail || '—'}</div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <Link to={`/admin/team/edit/${m._id}`} className="flex-1 py-2 text-center text-[10px] uppercase tracking-widest font-bold bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all">Edit</Link>
                <button
                  onClick={() => handleDelete(m._id)}
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

