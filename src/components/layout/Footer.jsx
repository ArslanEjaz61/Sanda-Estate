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
            <Link to="/" className="inline-block mb-5">
              <img 
                src="/homelogo.png" 
                alt="Your Homes Dubai" 
                className="h-12 w-auto object-contain brightness-0 invert opacity-90"
              />
            </Link>
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
                { name: 'WhatsApp', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c0-5.445 4.439-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
                { name: 'Instagram', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                { name: 'LinkedIn', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
              ].map(social => (
                <a key={social.name} href="#" className="w-9 h-9 flex items-center justify-center text-white/35 hover:text-gold-muted transition-all duration-300 hover:border-gold-muted/30" style={{ border: '1px solid rgba(255,255,255,0.08)' }} aria-label={social.name}>
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
