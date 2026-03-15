import { Link } from 'react-router-dom'
import { useState } from 'react'

const footerLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Properties', path: '/properties' },
  { label: 'Areas', path: '/areas' },
  { label: 'Contact', path: '/contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer style={{ backgroundColor: '#0a1f17' }}>
      {/* Pre-footer CTA */}
      <div className="container-wide px-6 lg:px-10">
        <div className="py-14 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h3 className="text-2xl lg:text-[28px] text-white mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
              Begin Your Property Journey
            </h3>
            <p className="text-[13px] text-white/40" style={{ fontFamily: 'var(--font-body)' }}>
              Speak with our advisory team for personalised guidance.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/contact" className="btn-gold !py-3">
              Book Consultation
            </Link>
            <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer" className="btn-outline btn-outline-light !py-3 flex items-center gap-2">
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide px-6 lg:px-10">
        <div className="py-14 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6">
          {/* Brand — 4 cols */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.1)', fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: '#c9a84c', letterSpacing: '0.05em' }}>
                YH
              </div>
              <div>
                <div className="text-[15px] text-white leading-none" style={{ fontFamily: 'var(--font-heading)' }}>Your Homes</div>
                <div className="text-[8px] uppercase tracking-[0.3em] text-white/35 mt-0.5" style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>Property Intelligence</div>
              </div>
            </div>
            <p className="text-[13px] text-white/40 leading-[1.8] max-w-[280px] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
              Curated real estate intelligence for investors, families, and global buyers seeking premium Dubai properties.
            </p>
            {/* Newsletter */}
            <div className="flex gap-0 max-w-[300px]">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-3 py-2.5 text-[12px] bg-white/[0.05] border border-white/10 border-r-0 text-white/70 placeholder-white/25 outline-none focus:border-gold-muted/40 transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <button className="px-4 py-2.5 text-[9px] uppercase tracking-[0.15em] font-bold" style={{ background: 'linear-gradient(135deg, #c9a84c, #d4af37)', color: '#1a1a1a', fontFamily: 'var(--font-body)' }}>
                Subscribe
              </button>
            </div>
          </div>

          {/* Navigation — 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="eyebrow text-[9px] mb-5 text-gold-muted/70">Navigation</h4>
            <ul className="space-y-2.5">
              {footerLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-[13px] text-white/40 hover:text-white/80 transition-colors duration-300" style={{ fontFamily: 'var(--font-body)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="eyebrow text-[9px] mb-5 text-gold-muted/70">Contact</h4>
            <div className="space-y-3 text-[13px] text-white/40" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8 }}>
              <p>Boulevard Plaza, Tower 1<br />Downtown Dubai, UAE</p>
              <p><a href="tel:+971501234567" className="hover:text-white/70 transition-colors">+971 50 123 4567</a></p>
              <p><a href="mailto:hello@yourhomes.ae" className="hover:text-white/70 transition-colors">hello@yourhomes.ae</a></p>
            </div>
          </div>

          {/* Social — 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="eyebrow text-[9px] mb-5 text-gold-muted/70">Connect</h4>
            <div className="flex gap-2 mb-6">
              {[
                { name: 'WhatsApp', icon: 'W' },
                { name: 'Instagram', icon: 'In' },
                { name: 'LinkedIn', icon: 'Li' },
              ].map(social => (
                <a key={social.name} href="#" className="w-9 h-9 flex items-center justify-center text-[10px] font-semibold text-white/35 hover:text-gold-muted transition-all duration-300 hover:border-gold-muted/30" style={{ border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)' }} aria-label={social.name}>
                  {social.icon}
                </a>
              ))}
            </div>
            <ul className="space-y-2">
              {legalLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-[11px] text-white/25 hover:text-white/50 transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container-wide px-6 lg:px-10">
        <div className="py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-white/20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', fontFamily: 'var(--font-body)' }}>
          <span>© {new Date().getFullYear()} Your Homes — Property Intelligence. All rights reserved.</span>
          <span>RERA Licensed · Dubai, UAE</span>
        </div>
      </div>
    </footer>
  )
}
