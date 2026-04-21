import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import SectionHeading from '../components/ui/SectionHeading'
import AnimatedReveal from '../components/ui/AnimatedReveal'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import { DeveloperLogos } from '../components/ui/DeveloperLogos'
import { team as teamFallback } from '../data/content'
import { fetchTeamPublic } from '../utils/teamApi'

const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || ''

function normalizeTeamImage(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) return `${SERVER_BASE}${url}`
  return url
}

function telHref(phone) {
  const raw = String(phone || '').trim()
  if (!raw) return ''
  if (raw.startsWith('+')) {
    const rest = raw.slice(1).replace(/\D/g, '')
    return rest ? `+${rest}` : ''
  }
  const digits = raw.replace(/\D/g, '')
  return digits || ''
}

/** Gap between team cards (Tailwind gap-8 = 2rem) */
const TEAM_CARD_GAP_PX = 32

function AboutTeamSection({ members }) {
  const scrollRef = useRef(null)
  const cardMetricsRef = useRef({ cardWidth: 260 })
  const [pause, setPause] = useState(false)
  const [cardWidth, setCardWidth] = useState(260)
  const [selectedMember, setSelectedMember] = useState(null)
  const list = members.map((m, i) => ({
    id: m._id || m.id || i,
    name: m.name,
    role: m.role,
    bio: m.bio,
    image: normalizeTeamImage(m.image) || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    publicEmail: m.publicEmail,
    phone: m.phone,
    areaName: m.areaName || '',
    areaSlug: m.areaSlug || '',
  }))
  const useSlider = list.length > 4

  cardMetricsRef.current.cardWidth = cardWidth

  const measureCards = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const cs = getComputedStyle(el)
    const padL = parseFloat(cs.paddingLeft) || 0
    const padR = parseFloat(cs.paddingRight) || 0
    const W = el.clientWidth - padL - padR
    // Match Tailwind lg/md — use viewport, not strip width (strip shrinks beside arrows).
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
    let perView = 1
    if (vw >= 1024) perView = 4
    else if (vw >= 640) perView = 2
    const inner = W - (perView - 1) * TEAM_CARD_GAP_PX
    const w = Math.max(100, Math.floor(inner / perView))
    setCardWidth(w)
  }, [])

  useLayoutEffect(() => {
    if (!useSlider) return
    measureCards()
    const el = scrollRef.current
    if (!el) return
    const ro = new ResizeObserver(measureCards)
    ro.observe(el)
    window.addEventListener('resize', measureCards)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measureCards)
    }
  }, [useSlider, measureCards, list.length])

  useEffect(() => {
    if (!useSlider || pause) return
    const id = setInterval(() => {
      const el = scrollRef.current
      if (!el) return
      const maxScroll = el.scrollWidth - el.clientWidth
      if (maxScroll <= 0) return
      const cw = cardMetricsRef.current.cardWidth
      const step = cw + TEAM_CARD_GAP_PX
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: 'auto' })
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' })
      }
    }, 5000)
    return () => clearInterval(id)
  }, [useSlider, pause, list.length, cardWidth])

  useEffect(() => {
    if (!selectedMember) return
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedMember(null)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [selectedMember])

  const scrollStep = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const cw = cardMetricsRef.current.cardWidth
    const step = cw + TEAM_CARD_GAP_PX
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll <= 0) return
    if (dir > 0) {
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: 'auto' })
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' })
      }
    } else {
      if (el.scrollLeft <= 2) return
      el.scrollBy({ left: -step, behavior: 'smooth' })
    }
  }

  const arrowBtnClass =
    'hidden md:inline-flex shrink-0 items-center justify-center w-11 h-11 rounded-full border border-[#0e3a2f]/15 bg-white text-[#0e3a2f] shadow-[0_4px_14px_rgba(14,58,47,0.12)] hover:bg-[#f7f6f3] hover:border-[#c2a76d]/40 hover:text-[#0a3028] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2a76d]/50 self-center'

  const arrowBtnMobileClass =
    'inline-flex md:hidden shrink-0 items-center justify-center w-10 h-10 rounded-full border border-[#0e3a2f]/15 bg-white text-[#0e3a2f] shadow-sm active:scale-95 transition-transform'

  const teamCardCompact = (member) => (
    <button
      type="button"
      onClick={() => setSelectedMember(member)}
      className="group h-full w-full text-center cursor-pointer rounded-sm border border-transparent p-1 -m-1 transition-colors hover:border-[#c2a76d]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2a76d]/40"
    >
      <div className="aspect-[3/4] img-zoom mb-3 overflow-hidden rounded-sm">
        <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
      </div>
      <h4 className="text-[17px] mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>{member.name}</h4>
      <div className="text-[10px] uppercase tracking-[0.15em] mb-2" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#c2a76d' }}>{member.role}</div>
      {member.bio && (
        <p
          className="text-[12px] leading-relaxed line-clamp-3 text-left"
          style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}
        >
          {member.bio}
        </p>
      )}
      <span className="mt-3 inline-block text-[10px] uppercase tracking-[0.12em] text-[#0e3a2f]/50 group-hover:text-[#0e3a2f]/80" style={{ fontFamily: 'var(--font-body)' }}>
        View full profile
      </span>
    </button>
  )

  const teamDetailModal = selectedMember && (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(14,58,47,0.55)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-modal-title"
      onClick={() => setSelectedMember(null)}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-sm bg-[#faf9f7] shadow-2xl border border-[#e8e4dc]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setSelectedMember(null)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-md ring-1 ring-black/5 hover:bg-[#f7f6f3] text-xl leading-none"
        >
          ×
        </button>

        <div className="p-6 sm:p-8 lg:p-10 pr-14">
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 sm:items-start">
            {/* Passport-style photo (35×45mm proportion) */}
            <div className="flex justify-center sm:justify-start shrink-0">
              <div
                className="w-[148px] sm:w-[168px] aspect-[35/45] overflow-hidden rounded-[2px] bg-white shadow-[0_2px_12px_rgba(14,58,47,0.12)] ring-1 ring-[#e5e0d9]"
              >
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="h-full w-full object-cover object-[center_15%]"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 flex flex-col text-center sm:text-left">
              <h3
                id="team-modal-title"
                className="text-[clamp(1.35rem,3vw,1.75rem)] mb-2 leading-tight"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}
              >
                {selectedMember.name}
              </h3>
              <p
                className="text-[11px] uppercase tracking-[0.2em] mb-6"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#c2a76d' }}
              >
                {selectedMember.role}
              </p>

              <div className="space-y-4 mb-6">
                {selectedMember.phone && telHref(selectedMember.phone) ? (
                  <div>
                    <span
                      className="block text-[9px] uppercase tracking-[0.2em] text-[#9a9a9a] mb-1"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Phone
                    </span>
                    <a
                      href={`tel:${telHref(selectedMember.phone)}`}
                      className="text-[15px] text-[#0e3a2f] hover:underline font-medium"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {selectedMember.phone}
                    </a>
                  </div>
                ) : null}
                {selectedMember.publicEmail ? (
                  <div>
                    <span
                      className="block text-[9px] uppercase tracking-[0.2em] text-[#9a9a9a] mb-1"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Email
                    </span>
                    <a
                      href={`mailto:${selectedMember.publicEmail}`}
                      className="text-[15px] text-[#0e3a2f] hover:underline font-medium break-all"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {selectedMember.publicEmail}
                    </a>
                  </div>
                ) : null}
                {!selectedMember.phone && !selectedMember.publicEmail && (
                  <p className="text-[13px] text-[#9a9a9a] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    For direct contact, please reach us through the main office or concierge.
                  </p>
                )}
              </div>

              {(selectedMember.areaName && selectedMember.areaSlug) && (
                <p className="text-[12px] text-[#6b6b6b] mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                  <span className="text-[9px] uppercase tracking-[0.18em] text-[#9a9a9a] block mb-1">Area focus</span>
                  <Link
                    to={`/areas/${selectedMember.areaSlug}`}
                    className="text-[#0e3a2f] font-medium hover:underline"
                    onClick={() => setSelectedMember(null)}
                  >
                    {selectedMember.areaName}
                  </Link>
                </p>
              )}
              {selectedMember.areaName && !selectedMember.areaSlug && (
                <p className="text-[12px] text-[#6b6b6b] mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                  <span className="text-[9px] uppercase tracking-[0.18em] text-[#9a9a9a] block mb-1">Area focus</span>
                  {selectedMember.areaName}
                </p>
              )}
            </div>
          </div>

          {selectedMember.bio ? (
            <div className="mt-8 sm:mt-10 pt-8 border-t border-[#e5e0d9]">
              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-4"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#c2a76d' }}
              >
                About
              </p>
              <p
                className="text-[14px] sm:text-[15px] leading-[1.85] text-[#4a4a4a] max-w-none"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {selectedMember.bio}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )

  if (useSlider) {
    return (
      <>
      <div className="w-full">
        <div className="flex items-stretch gap-4 md:gap-6">
          <button
            type="button"
            aria-label="Previous team members"
            onClick={() => scrollStep(-1)}
            className={arrowBtnClass}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div
            ref={scrollRef}
            onMouseEnter={() => setPause(true)}
            onMouseLeave={() => setPause(false)}
            onTouchStart={() => setPause(true)}
            onTouchEnd={() => setPause(false)}
            className="flex min-h-0 min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-visible scroll-smooth pb-5 py-1 touch-pan-x [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ gap: TEAM_CARD_GAP_PX }}
          >
            {list.map((member, i) => (
              <div
                key={String(member.id)}
                className="flex-none shrink-0 snap-center"
                style={{ width: cardWidth, minWidth: cardWidth, maxWidth: cardWidth }}
              >
                {teamCardCompact(member)}
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next team members"
            onClick={() => scrollStep(1)}
            className={arrowBtnClass}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-8 md:hidden">
          <button
            type="button"
            aria-label="Previous team member"
            onClick={() => scrollStep(-1)}
            className={arrowBtnMobileClass}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next team member"
            onClick={() => scrollStep(1)}
            className={arrowBtnMobileClass}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-[#9a9a9a] mt-2" style={{ fontFamily: 'var(--font-body)' }}>Swipe or use arrows to see the full team. Tap a card for details.</p>
      </div>
      {teamDetailModal}
      </>
    )
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {list.map((member, i) => (
        <AnimatedReveal key={member.id} delay={i * 0.1}>
          {teamCardCompact(member)}
        </AnimatedReveal>
      ))}
    </div>
    {teamDetailModal}
    </>
  )
}

const parsedStats = [
  { target: 2.8, prefix: 'AED ', suffix: 'B+', label: 'Portfolio Value Transacted' },
  { target: 1200, prefix: '', suffix: '+', label: 'Properties Sold' },
  { target: 40, prefix: '', suffix: '+', label: 'Countries Served' },
  { target: 22, prefix: '', suffix: '+', label: 'Years of Expertise' },
]

const milestones = [
  { year: '2003', title: 'Founded', desc: 'Your Homes was established in Dubai with a vision to bring genuine property intelligence to the market.' },
  { year: '2008', title: 'Survived the Crisis', desc: 'Navigated the global financial crisis, strengthening our commitment to transparent, research-driven advisory.' },
  { year: '2014', title: 'International Expansion', desc: 'Expanded our client base to 20+ countries, establishing ourselves as a key partner for overseas investors.' },
  { year: '2020', title: 'Digital Transformation', desc: 'Launched AI-powered property advisory and virtual viewing capabilities during the global pandemic.' },
  { year: '2024', title: 'Market Leadership', desc: 'Crossed AED 2.8B in transacted portfolio value, serving 40+ countries with a world-class advisory team.' },
]

const awards = [
  {
    title: 'Best Boutique Agency 2024',
    org: 'Dubai Property Awards',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    title: 'Excellence in Client Service',
    org: 'RERA Recognition',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: 'Top International Advisory',
    org: 'Gulf Real Estate Awards',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    title: 'Luxury Specialist of the Year',
    org: 'Property Finder Awards',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 13L2 9Z" /><path d="M11 3 8 9l4 13 4-13-3-6" /><path d="M2 9h20" />
      </svg>
    ),
  },
]

// SVG icons for the values section
const ValueIcons = {
  Intelligence: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  Curated: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Global: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" /><path d="M12 2c-2.5 4-4 8-4 10s1.5 6 4 10" />
    </svg>
  ),
}

// SVG icons for the process section
const ProcessIcons = {
  Discovery: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Intelligence: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h.01" /><path d="M7 20v-4" /><path d="M12 20v-8" /><path d="M17 20V8" /><path d="M22 4v16" />
    </svg>
  ),
  Experience: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Completion: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
}

export default function AboutPage() {
  const [teamRemote, setTeamRemote] = useState(undefined)

  useEffect(() => {
    fetchTeamPublic()
      .then((data) => setTeamRemote(Array.isArray(data) ? data : []))
      .catch(() => setTeamRemote(null))
  }, [])

  // If API is reachable, always prefer admin-managed team (even if empty).
  // Only fall back to bundled content when the API is unavailable.
  const displayTeam = teamRemote === null ? teamFallback : (teamRemote || [])

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80" 
            alt="Dubai Real Estate" 
            className="w-full h-full object-cover"
          />
          {/* Main Overlay Gradient */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(14,58,47,0.92) 0%, rgba(14,58,47,0.85) 40%, rgba(0,0,0,0.6) 100%)' }} />
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="container-wide px-6 lg:px-10 relative z-10 w-full pt-32 pb-14 lg:pt-40 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <AnimatedReveal>
                <span className="eyebrow text-[10px] mb-5 block" style={{ color: 'rgba(194,167,109,0.85)' }}>About Your Homes</span>
                <h1 className="text-white mb-6" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, lineHeight: 1.05, fontSize: 'clamp(2.5rem, 4.5vw, 3.8rem)' }}>
                  A Trusted Advisory<br />
                  <span className="italic" style={{ color: '#c2a76d' }}>in Dubai Real Estate</span>
                </h1>
                <p className="text-[14px] lg:text-[15px] leading-[1.8] mb-10" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.65)' }}>
                  Property Intelligence is not just our tagline — it's the professional philosophy that drives every decision, 
                  investment recommendation, and lifelong client partnership we build in the UAE.
                </p>
                
                {/* Counter Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  {parsedStats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                      <div className="text-[20px] lg:text-[24px] mb-0.5" style={{ fontFamily: 'var(--font-heading)', color: '#c2a76d', fontWeight: 400 }}>
                        <AnimatedCounter target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
                      </div>
                      <div className="text-[8px] uppercase tracking-[0.2em] font-medium" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </AnimatedReveal>
            </div>

            <AnimatedReveal delay={0.2}>
              <div className="relative group">
                {/* Image Accent Border */}
                <div className="absolute -inset-4 border border-gold-muted/20 -z-10 translate-x-3 translate-y-3 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500" />
                <div className="aspect-[4/5] lg:aspect-square overflow-hidden rounded-sm shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&q=80" 
                    alt="Your Homes advisory team" 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" 
                  />
                </div>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ AWARDS STRIP ═══════════════ */}
      <section className="py-10 lg:py-12" style={{ backgroundColor: '#0e3a2f' }}>
        <div className="container-wide px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center py-4">
                <div className="flex justify-center mb-3 text-[#c2a76d]">{award.icon}</div>
                <div className="text-[12px] font-semibold text-white/80 mb-1" style={{ fontFamily: 'var(--font-body)' }}>{award.title}</div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-white/30" style={{ fontFamily: 'var(--font-body)' }}>{award.org}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STORY ═══════════════ */}
      <section className="section-padding-lg" style={{ backgroundColor: '#f7f6f3' }}>
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimatedReveal>
              <div className="aspect-[4/5] img-zoom">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" alt="Dubai architecture" className="w-full h-full object-cover" />
              </div>
            </AnimatedReveal>
            <AnimatedReveal delay={0.2}>
              <span className="eyebrow mb-4 block">Our Story</span>
              <div className="gold-line mb-6" />
              <h2 className="mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: '#1a1a1a' }}>Two Decades of Property Excellence</h2>
              <div className="space-y-4 text-[14px] leading-[1.85]" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>
                <p>Your Homes was founded on a simple conviction: real estate decisions deserve better intelligence. In a market often driven by hype, we chose to build an advisory firm rooted in research, transparency, and genuine expertise.</p>
                <p>Over 22 years, we have navigated every cycle of the Dubai property market — from its early boom to its global maturation. This gives us a perspective that transcends market noise and delivers real clarity.</p>
                <p>Today, we serve a global clientele of investors, families, and high-net-worth individuals across 40+ countries.</p>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ TIMELINE ═══════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-narrow">
          <SectionHeading subtitle="Our Journey" title="Key Milestones" description="A timeline of growth, resilience, and commitment to excellence." />
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, transparent, var(--color-gold-muted), var(--color-gold-light), transparent)' }} />
            <div className="space-y-8 lg:space-y-0">
              {milestones.map((m, i) => (
                <AnimatedReveal key={i} delay={i * 0.1}>
                  <div className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-10 ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'} mb-10`}>
                    <div className={`lg:w-5/12 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                      <div className="text-[30px] mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#c2a76d', fontWeight: 400 }}>{m.year}</div>
                      <h4 className="text-[19px] mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>{m.title}</h4>
                      <p className="text-[13px] leading-[1.75]" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>{m.desc}</p>
                    </div>
                    <div className="hidden lg:flex w-2/12 justify-center">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#c2a76d', boxShadow: '0 0 0 6px rgba(194,167,109,0.15)' }} />
                    </div>
                    <div className="lg:w-5/12" />
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ VALUES ═══════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#f7f6f3' }}>
        <div className="container-narrow">
          <SectionHeading subtitle="Our Principles" title="What Sets Us Apart" description="Three pillars define every client experience." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: '01', title: 'Intelligence-Led Advisory', desc: "We don't just list properties. We analyze markets, forecast trends, and build strategies that align with your financial and lifestyle goals.", Icon: ValueIcons.Intelligence },
              { num: '02', title: 'Curated, Not Catalogued', desc: 'Every property we present has been vetted, researched, and selected for its alignment with your criteria. Quality over quantity.', Icon: ValueIcons.Curated },
              { num: '03', title: 'Global Client, Local Expert', desc: "Whether you're in London, Singapore, or Riyadh, we bring global service standards with intimate knowledge of every Dubai community.", Icon: ValueIcons.Global },
            ].map((pillar, i) => (
              <AnimatedReveal key={i} delay={i * 0.12}>
                <div className="premium-card p-7 h-full group">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-all duration-300" style={{ background: 'rgba(14,58,47,0.06)', color: '#0e3a2f' }}>
                    <pillar.Icon />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] font-bold mb-3" style={{ fontFamily: 'var(--font-body)', color: '#c2a76d' }}>{pillar.num}</div>
                  <h4 className="text-[18px] mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>{pillar.title}</h4>
                  <p className="text-[13px] leading-[1.75]" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>{pillar.desc}</p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PARTNERSHIPS ═══════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimatedReveal>
              <span className="eyebrow mb-4 block">Developer Partnerships</span>
              <div className="gold-line mb-6" />
              <h2 className="mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: '#1a1a1a' }}>Strategic Relationships with Premier Developers</h2>
              <p className="text-[14px] leading-[1.85] mb-8" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>Our partnerships with Emaar, Nakheel, Damac, Sobha provide clients privileged access to pre-launch opportunities, exclusive inventory, and preferential terms.</p>
              <div className="flex flex-wrap gap-8 items-center text-[#1a1a1a]">
                <div className="hover:text-emerald-deep transition-colors duration-300"><DeveloperLogos.Emaar /></div>
                <div className="hover:text-emerald-deep transition-colors duration-300"><DeveloperLogos.Damac /></div>
                <div className="hover:text-emerald-deep transition-colors duration-300"><DeveloperLogos.Nakheel /></div>
                <div className="hover:text-emerald-deep transition-colors duration-300"><DeveloperLogos.Sobha /></div>
              </div>
            </AnimatedReveal>
            <AnimatedReveal delay={0.2}>
              <div className="aspect-[4/5] img-zoom">
                <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" alt="Dubai skyline" className="w-full h-full object-cover" />
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ TEAM ═══════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#f7f6f3' }}>
        <div className="container-narrow">
          <SectionHeading subtitle="Our Advisors" title="Meet the Team" description="Dedicated property professionals committed to exceptional client experiences." />
          {teamRemote === undefined ? (
            <div className="py-16 text-center text-[13px] text-[#9a9a9a]" style={{ fontFamily: 'var(--font-body)' }}>Loading team...</div>
          ) : Array.isArray(displayTeam) && displayTeam.length === 0 ? (
            <div className="py-16 text-center text-[13px] text-[#9a9a9a]" style={{ fontFamily: 'var(--font-body)' }}>
              No team members yet.
                  </div>
          ) : (
            <AboutTeamSection members={displayTeam} />
          )}
        </div>
      </section>

      {/* ═══════════════ PROCESS ═══════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-narrow">
          <SectionHeading subtitle="How We Work" title="Our Advisory Process" description="A refined, four-step approach designed around you." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: '01', title: 'Discovery', desc: 'We listen. Understanding your goals, timeline, budget, and lifestyle preferences forms the foundation of your strategy.', color: '#0e3a2f', Icon: ProcessIcons.Discovery },
              { step: '02', title: 'Intelligence', desc: 'Our team researches, analyses, and curates a shortlist of properties aligned with your criteria and market conditions.', color: '#155544', Icon: ProcessIcons.Intelligence },
              { step: '03', title: 'Experience', desc: 'Guided viewings, developer introductions, and detailed comparisons — we make the selection process seamless.', color: '#1c6f59', Icon: ProcessIcons.Experience },
              { step: '04', title: 'Completion', desc: 'From negotiation to legal handover, we manage every detail to ensure a smooth, stress-free transaction.', color: '#c2a76d', Icon: ProcessIcons.Completion },
            ].map((item, i) => (
              <AnimatedReveal key={i} delay={i * 0.12}>
                <div className="relative p-6 lg:p-7 h-full overflow-hidden" style={{ backgroundColor: item.color }}>
                  <div className="text-[120px] font-bold absolute -top-2 right-3 opacity-[0.06] text-white leading-none select-none" style={{ fontFamily: 'var(--font-heading)' }}>{item.step}</div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.12)' }}>
                      <span className="text-white"><item.Icon /></span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3" style={{ fontFamily: 'var(--font-body)' }}>Step {item.step}</div>
                    <h4 className="text-[18px] text-white mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>{item.title}</h4>
                    <p className="text-[12px] leading-[1.75] text-white/60" style={{ fontFamily: 'var(--font-body)' }}>{item.desc}</p>
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80" alt="Dubai" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(14,58,47,0.93), rgba(14,58,47,0.82))' }} />
        </div>
        <div className="relative z-10 container-narrow text-center px-6">
          <AnimatedReveal>
            <h2 className="text-white mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
              Let's Find Your <span className="italic" style={{ color: '#c2a76d' }}>Perfect Property</span>
            </h2>
            <p className="text-[14px] max-w-md mx-auto mb-9" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
              Begin with a private consultation. Our team will build a personalised property strategy tailored to your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-gold">Book Your Consultation</Link>
              <Link to="/properties" className="btn-outline btn-outline-light">Explore Properties</Link>
            </div>
          </AnimatedReveal>
        </div>
      </section>
    </>
  )
}
