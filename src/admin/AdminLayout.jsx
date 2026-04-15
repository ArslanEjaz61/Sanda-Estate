import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_BASE

export default function AdminLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const admin = JSON.parse(localStorage.getItem('admin_user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin/login')
  }

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
    { to: '/admin/properties', label: 'Properties', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
    { to: '/admin/properties/new', label: 'Add Property', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg> },
    { to: '/admin/areas', label: 'Areas', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> },
    { to: '/admin/contacts', label: 'Contacts', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> }
  ]

  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        const res = await fetch(`${API}/contact`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 401 || res.status === 403) {
          handleLogout()
          return
        }
        const data = await res.json()
        if (Array.isArray(data)) {
          setUnreadCount(data.filter(c => c.status === 'unread').length)
        }
      } catch (err) {
        // fail silently
      }
    }
    fetchUnread()
    // Poll every 1 minute
    const interval = setInterval(fetchUnread, 60000)
    return () => clearInterval(interval)
  }, [])

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-[12px] uppercase tracking-[0.12em] font-semibold transition-all duration-200 ${isActive ? 'text-[#c9a84c] bg-white/[0.06]' : 'text-white/50 hover:text-white/80 hover:bg-white/[0.03]'}`

  return (
    <div className="min-h-screen flex" style={{ background: '#0f1a15' }}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: '#0a1f17', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-9 h-9 flex items-center justify-center font-bold text-[11px]" style={{ background: 'linear-gradient(135deg, #c9a84c, #d4af37)', color: '#1a1a1a', fontFamily: 'var(--font-body)' }}>YH</div>
          <div>
            <div className="text-white text-[13px] font-semibold" style={{ fontFamily: 'var(--font-body)' }}>Your Homes</div>
            <div className="text-[8px] uppercase tracking-[0.2em] text-white/30" style={{ fontFamily: 'var(--font-body)' }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1" style={{ fontFamily: 'var(--font-body)' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.to === '/admin/contacts' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-[11px] text-white/50 mb-1" style={{ fontFamily: 'var(--font-body)' }}>{admin.name || 'Admin'}</div>
          <div className="text-[10px] text-white/25 mb-3" style={{ fontFamily: 'var(--font-body)' }}>{admin.email}</div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] font-semibold text-red-400/60 hover:text-red-400 transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="px-6 py-4 flex items-center justify-between" style={{ background: '#0a1f17', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white/60 hover:text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <div className="flex items-center gap-6">
            <div className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-semibold hidden md:block" style={{ fontFamily: 'var(--font-body)' }}>Property Management System</div>
            <div className="relative cursor-pointer hover:text-white text-white/60 transition-colors" onClick={() => navigate('/admin/contacts')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-[#0a1f17]"></span>
                </span>
              )}
            </div>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.12em] text-[#c9a84c]/60 hover:text-[#c9a84c] font-semibold transition-colors" style={{ fontFamily: 'var(--font-body)' }}>View Website →</a>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto" style={{ background: '#111f19' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
