import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_BASE

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.admin))
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#2f1e16' }}>
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center font-bold text-sm" style={{ background: '#c2a76d', color: '#1a1a1a', fontFamily: 'var(--font-body)' }}>SE</div>
            <div>
              <div className="text-white text-[15px] font-semibold" style={{ fontFamily: 'var(--font-body)' }}>Sanda Estate</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: 'var(--font-body)' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-10" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          <h2 className="text-white text-[24px] mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Welcome Back</h2>
          <p className="text-[13px] text-white/40 mb-8" style={{ fontFamily: 'var(--font-body)' }}>Sign in to manage your properties</p>

          {error && (
            <div className="mb-6 p-3 text-[12px] text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontFamily: 'var(--font-body)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-white/40 font-semibold mb-2" style={{ fontFamily: 'var(--font-body)' }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@sandaestate.com" required className="w-full px-4 py-3 text-[13px] text-white outline-none transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-body)' }} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-white/40 font-semibold mb-2" style={{ fontFamily: 'var(--font-body)' }}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required className="w-full px-4 py-3 text-[13px] text-white outline-none transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-body)' }} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 text-[11px] uppercase tracking-[0.18em] font-bold transition-all disabled:opacity-50" style={{ background: '#c2a76d', color: '#1a1a1a', fontFamily: 'var(--font-body)' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
