import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Properties', path: '/properties' },
  { label: 'Areas', path: '/areas' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isSolid = scrolled || !isHome
  const navBg = isSolid
    ? 'bg-white/[0.97] backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)]'
    : 'bg-transparent'
  const textColor = isSolid ? 'text-charcoal' : 'text-white'
  const linkOpacity = isSolid ? 'opacity-70' : 'opacity-80'

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
        style={{ height: '76px' }}
      >
        <div className="container-wide h-full flex items-center justify-between px-8 lg:px-12">
          {/* Logo */}
          <Link to="/" className="flex items-center h-full">
            <img 
              src="/homelogo.png" 
              alt="Your Homes Dubai" 
              className={`h-11 w-auto object-contain transition-all duration-500 ${!isSolid ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-9">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-[11px] uppercase tracking-[0.18em] font-medium transition-all duration-300 ${textColor} ${isActive ? 'opacity-100' : `${linkOpacity} hover:opacity-100`}`}
                  style={{ fontFamily: 'var(--font-body)', color: !isSolid ? '#ffffff' : undefined }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px]"
                      style={{ background: '#c2a76d' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <Link to="/contact" className="hidden lg:block btn-emerald !py-2.5 !px-5 !text-[10px]">
            Book Consultation
          </Link>

          {/* Mobile Hamburger */}
          <button
            className={`lg:hidden relative w-8 h-8 flex items-center justify-center ${textColor}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-3.5">
              <span className={`absolute left-0 top-0 w-full h-[1.5px] transition-all duration-300 ${mobileOpen ? 'rotate-45 top-1.5' : ''}`} style={{ backgroundColor: 'currentColor' }} />
              <span className={`absolute left-0 top-1.5 w-full h-[1.5px] transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : ''}`} style={{ backgroundColor: 'currentColor' }} />
              <span className={`absolute left-0 bottom-0 w-full h-[1.5px] transition-all duration-300 ${mobileOpen ? '-rotate-45 bottom-1.5' : ''}`} style={{ backgroundColor: 'currentColor' }} />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 lg:hidden flex flex-col"
            style={{ backgroundColor: '#0e3a2f' }}
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-7 pt-20">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Link
                    to={link.path}
                    className={`text-[28px] transition-colors duration-300 ${
                      location.pathname === link.path ? 'text-gold-muted' : 'text-white/70 hover:text-white'
                    }`}
                    style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-4"
              >
                <Link to="/contact" className="btn-emerald" onClick={() => setMobileOpen(false)}>
                  Book Consultation
                </Link>
              </motion.div>
            </div>

            {/* Mobile footer info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center pb-10 px-6"
            >
              <a href="tel:+97144541313" className="text-[13px] text-white/30 block mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                +971 4 454 1313
              </a>
              <a href="mailto:info@yourhomes.ae" className="text-[13px] text-white/30" style={{ fontFamily: 'var(--font-body)' }}>
                info@yourhomes.ae
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
