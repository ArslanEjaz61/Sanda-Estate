import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import SectionHeading from '../components/ui/SectionHeading'
import PropertyCard from '../components/ui/PropertyCard'
import AreaCard from '../components/ui/AreaCard'
import LeadCaptureForm from '../components/ui/LeadCaptureForm'
import AnimatedReveal from '../components/ui/AnimatedReveal'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import { DeveloperLogos } from '../components/ui/DeveloperLogos'
// Removed staticProperties fallback
import { fetchProperties, fetchAreas, fetchSettings } from '../utils/api'
import { testimonials, whyDubai } from '../data/content'

const staticFeatured = []
// previewAreas removed, will be state-driven

const parsedStats = [
  { target: 2.8, prefix: 'AED ', suffix: 'B+', label: 'Portfolio Value Transacted' },
  { target: 1200, prefix: '', suffix: '+', label: 'Properties Sold' },
  { target: 40, prefix: '', suffix: '+', label: 'Countries Served' },
  { target: 22, prefix: '', suffix: '+', label: 'Years of Expertise' },
]

const whyDubaiIcons = [
  <svg key="tax" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M8 10h8M8 14h8" /></svg>,
  <svg key="visa" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M7 15h4" /></svg>,
  <svg key="infra" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
  <svg key="connect" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10" /></svg>,
  <svg key="market" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>,
  <svg key="yield" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
]

export default function HomePage() {
  const [heroSearch, setHeroSearch] = useState({ area: '', type: '', budget: '' })
  const [featuredProperties, setFeaturedProperties] = useState(staticFeatured)
  const [liveAreas, setLiveAreas] = useState([])
  const [settings, setSettings] = useState(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const audioRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProperties({ featured: true }).then(data => {
      if (data) setFeaturedProperties(data.slice(0, 6))
    })
    fetchAreas().then(data => {
      if (data) setLiveAreas(data)
    })
    fetchSettings().then(data => {
      if (data) setSettings(data)
    })
  }, [])

  const defaults = {
    address: 'A-202, Prime Business Center, Dubai',
    phone: '+971 4 454 1313',
    email: 'info@yourhomes.ae'
  }

  const contactInfo = {
    ...defaults,
    ...settings
  }

  const items = [
    { text: contactInfo.address },
    { text: contactInfo.phone, href: `tel:${(contactInfo.phone || '').replace(/\s+/g, '')}` },
    { text: contactInfo.email, href: `mailto:${contactInfo.email}` },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsPlaying(false)
      } else {
        setIsPlaying(true)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Browsers often block autoplaying audio; fail silently
          })
        }
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])
 
  const handleHeroSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (heroSearch.area) params.set('area', heroSearch.area)
    if (heroSearch.type) params.set('type', heroSearch.type)
    
    // Map budget string to index
    const budgetMap = {
      'under-2m': '1',
      '2m-5m': '2',
      '5m-10m': '3',
      '10m+': '4'
    }
    if (heroSearch.budget) params.set('priceRange', budgetMap[heroSearch.budget])
    
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-start overflow-hidden gap-12 lg:gap-16">
        <audio ref={audioRef} src="/voice.mpeg" loop autoPlay />
        <div className="absolute inset-0">
          <video
            src="/home.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.6) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(14,58,47,0.12) 0%, transparent 50%)' }} />
        </div>

        <div className="relative z-10 w-full px-6 lg:pl-16 xl:pl-24 pt-32 lg:pt-40">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
              <span className="eyebrow text-[10px] tracking-[0.35em]" style={{ color: 'rgba(194,167,109,0.8)' }}>
                Premium Property Intelligence — Dubai
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white mt-5 mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, lineHeight: 1.05, fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}
            >
              Discover Dubai's Most{' '}
              <span className="italic" style={{ color: '#c2a76d' }}>Intelligent</span>{' '}
              Property<br />Opportunities
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="text-[15px] lg:text-[16px] max-w-lg mb-9 leading-[1.8]"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}
            >
              Curated real estate for investors, families, and global buyers.
              Luxury discovery. Investment clarity. Trusted advisory.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/properties" className="btn-emerald">Explore Properties</Link>
              <Link to="/contact" className="btn-outline btn-outline-light">Book Consultation</Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="relative z-10 container-wide px-6 lg:px-10 pb-12"
        >
          <div className="glass-dark p-4 lg:p-5 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select value={heroSearch.area} onChange={e => setHeroSearch(p => ({ ...p, area: e.target.value }))} className="premium-input premium-input-dark text-[12px]">
                <option value="">Select Area</option>
                {liveAreas.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
              </select>
              <select value={heroSearch.type} onChange={e => setHeroSearch(p => ({ ...p, type: e.target.value }))} className="premium-input premium-input-dark text-[12px]">
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="townhouse">Townhouse</option>
              </select>
              <select value={heroSearch.budget} onChange={e => setHeroSearch(p => ({ ...p, budget: e.target.value }))} className="premium-input premium-input-dark text-[12px]">
                <option value="">Budget</option>
                <option value="under-2m">Under AED 2M</option>
                <option value="2m-5m">AED 2M – 5M</option>
                <option value="5m-10m">AED 5M – 10M</option>
                <option value="10m+">AED 10M+</option>
              </select>
              <button onClick={handleHeroSearch} className="btn-gold text-center !py-3.5">Search</button>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
          <span className="text-[8px] uppercase tracking-[0.2em] text-white/25" style={{ fontFamily: 'var(--font-body)' }}>Scroll</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }} />
        </motion.div>
      </section>

      {/* ═══════════════ STAT BANNER ═══════════════ */}
      <section className="py-8 lg:py-10" style={{ backgroundColor: '#0e3a2f' }}>
        <div className="container-wide px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-white/10">
            {parsedStats.map((stat, i) => (
              <div key={i} className="text-center lg:px-6">
                <div className="text-2xl lg:text-[28px] mb-0.5" style={{ fontFamily: 'var(--font-heading)', color: '#c2a76d', fontWeight: 400 }}>
                  <AnimatedCounter target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-white/40" style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DEVELOPER PARTNERS — BIG LOGOS ═══════════════ */}
      <section className="py-12 lg:py-14" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f0ebe5' }}>
        <div className="container-wide px-6 lg:px-10">
          <AnimatedReveal>
            <div className="text-center mb-6">
              <span className="eyebrow text-[9px]" style={{ color: '#9a9a9a' }}>Strategic Developer Partnerships</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0 * 0.12 }} className="text-[#1a1a1a] hover:text-emerald-deep transition-colors duration-300">
                <DeveloperLogos.Emaar />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 * 0.12 }} className="text-[#1a1a1a] hover:text-emerald-deep transition-colors duration-300">
                <DeveloperLogos.Damac />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2 * 0.12 }} className="text-[#1a1a1a] hover:text-emerald-deep transition-colors duration-300">
                <DeveloperLogos.Nakheel />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 3 * 0.12 }} className="text-[#1a1a1a] hover:text-emerald-deep transition-colors duration-300">
                <DeveloperLogos.Sobha />
              </motion.div>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* ═══════════════ INTRO ═══════════════ */}
      <section className="section-padding relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80"
            alt="Dubai skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(14,58,47,0.95), rgba(14,58,47,0.9))' }} />
        </div>
        <div className="container-narrow relative z-10">
          <AnimatedReveal>
            <div className="max-w-2xl mx-auto text-center">
              <span className="eyebrow mb-4 block" style={{ color: 'rgba(194,167,109,0.8)' }}>Our Philosophy</span>
              <div className="gold-line-center mb-6" />
              <h2 className="mb-5 text-white" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
                The Art of Property Intelligence
              </h2>
              <p className="text-[14px] leading-[1.9] max-w-lg mx-auto" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.65)' }}>
                In a market as dynamic as Dubai, the right property decision requires more than listings —
                it demands intelligence. We combine deep market expertise, advanced analytics, and
                personalised advisory to guide you toward properties that align with your goals.
              </p>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* ═══════════════ FEATURED PROPERTIES ═══════════════ */}
      <section className="section-padding-lg" style={{ backgroundColor: 'var(--color-white)' }}>
        <div className="container-wide px-6 lg:px-10">
          <SectionHeading
            subtitle="Curated Collection"
            title="Featured Properties"
            description="Handpicked by our advisory team for exceptional quality, value, and lifestyle."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-9">
            {featuredProperties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
          <AnimatedReveal>
            <div className="text-center mt-12">
              <Link to="/properties" className="btn-outline btn-outline-dark">View All Properties</Link>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="section-padding-lg relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=80"
            alt="Dubai luxury real estate process"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(14,58,47,0.95), rgba(14,58,47,0.88))' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03] z-[1]" style={{ backgroundImage: 'radial-gradient(rgba(194,167,109,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="container-wide px-6 lg:px-10 relative z-10">
          <AnimatedReveal>
            <div className="text-center mb-16">
              <span className="eyebrow text-[10px] mb-4 block" style={{ color: 'rgba(194,167,109,0.7)' }}>Your Journey</span>
              <h2 className="text-white mb-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                How It Works
              </h2>
              <p className="text-[14px] max-w-lg mx-auto" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.45)' }}>
                From first conversation to keys in hand — our proven process makes Dubai property simple.
              </p>
            </div>
          </AnimatedReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {[
              {
                step: '01',
                title: 'Tell Us Your Goals',
                description: 'Share your vision — investment, dream home, or rental income. We listen, understand your budget, and identify the right opportunities.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                )
              },
              {
                step: '02',
                title: 'We Curate Options',
                description: 'Our advisors handpick properties that match your criteria from our verified portfolio — saving you weeks of research.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                )
              },
              {
                step: '03',
                title: 'You Decide & We Close',
                description: 'Visit shortlisted properties, negotiate with confidence, and close with our full legal and administrative support.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                )
              }
            ].map((item, i) => (
              <AnimatedReveal key={i} delay={i * 0.15}>
                <div className="relative p-8 lg:p-10 h-full group" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* Step number */}
                  <div className="absolute top-6 right-6 text-[40px] font-bold leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(194,167,109,0.1)' }}>
                    {item.step}
                  </div>
                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center mb-6" style={{ color: '#c2a76d', border: '1px solid rgba(194,167,109,0.2)' }}>
                    {item.icon}
                  </div>
                  <h3 className="text-[18px] text-white mb-3 group-hover:text-[#c2a76d] transition-colors duration-300" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>
                    {item.title}
                  </h3>
                  <p className="text-[13px] leading-[1.8]" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.45)' }}>
                    {item.description}
                  </p>
                </div>
              </AnimatedReveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <AnimatedReveal>
            <div className="text-center mt-14">
              <Link to="/contact" className="btn-gold">Start Your Journey</Link>
            </div>
          </AnimatedReveal>

          {/* Bottom logos */}
          <div className="mt-16 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16 text-white/80">
              <DeveloperLogos.Emaar />
              <DeveloperLogos.Damac />
              <DeveloperLogos.Nakheel />
              <DeveloperLogos.Sobha />
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════ WHY INVEST IN DUBAI ═══════════════ */}
      <section className="section-padding-lg" style={{ backgroundColor: '#faf8f5' }}>
        <div className="container-wide px-6 lg:px-10">
          <SectionHeading
            subtitle="Property Investment Destination"
            title="Why Invest in Dubai"
            description="Consistently ranked among the world's most attractive markets for property investment."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {whyDubai.map((item, i) => (
              <AnimatedReveal key={i} delay={i * 0.08}>
                <div className="premium-card p-7 h-full group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(14,58,47,0.06)', color: '#0e3a2f' }}>
                      {whyDubaiIcons[i]}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.18em] font-bold pt-3" style={{ fontFamily: 'var(--font-body)', color: '#9a9a9a' }}>
                      0{i + 1}
                    </div>
                  </div>
                  <h4 className="text-[18px] mb-2.5 group-hover:text-emerald-deep transition-colors duration-300" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>
                    {item.title}
                  </h4>
                  <p className="text-[13px] leading-[1.75]" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>
                    {item.description}
                  </p>
                </div>
              </AnimatedReveal>
            ))}
          </div>

          {/* Big developer logos after Why Dubai */}
          <AnimatedReveal>
            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-20 text-[#1a1a1a]">
              <div className="hover:text-emerald-deep transition-colors duration-300"><DeveloperLogos.Emaar /></div>
              <div className="hover:text-emerald-deep transition-colors duration-300"><DeveloperLogos.Damac /></div>
              <div className="hover:text-emerald-deep transition-colors duration-300"><DeveloperLogos.Nakheel /></div>
              <div className="hover:text-emerald-deep transition-colors duration-300"><DeveloperLogos.Sobha /></div>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* ═══════════════ COMMUNITIES ═══════════════ */}
      <section className="section-padding-lg relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1920&q=80"
            alt="Dubai Real Estate Communities"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(14,58,47,0.82), rgba(14,58,47,0.88))' }} />
        </div>
        <div className="container-wide px-6 lg:px-10 relative z-10">
          <SectionHeading
            subtitle="Dubai Communities"
            title="Explore Dubai's Premier Areas"
            description="Discover the neighbourhoods that define Dubai's luxury landscape."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {liveAreas.slice(0, 3).map((area, i) => (
              <AreaCard key={area.slug} area={area} index={i} />
            ))}
          </div>
          <AnimatedReveal>
            <div className="text-center mt-12">
              <Link to="/areas" className="btn-outline btn-outline-light">View All Areas</Link>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* ═══════════════ TRACK RECORD ═══════════════ */}
      <section className="section-padding relative overflow-hidden" style={{ backgroundColor: '#111111' }}>
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container-narrow relative z-10">
          <SectionHeading subtitle="Our Track Record" title="Why Your Homes" light />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            {parsedStats.map((stat, i) => (
              <AnimatedReveal key={i} delay={i * 0.12}>
                <div className="text-center p-5" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-[30px] lg:text-[36px] mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#c2a76d', fontWeight: 300 }}>
                    <AnimatedCounter target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.18em]" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'rgba(255,255,255,0.35)' }}>
                    {stat.label}
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>
          <AnimatedReveal>
            <div className="max-w-lg mx-auto text-center">
              <p className="text-[14px] leading-[1.85] mb-8" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.45)' }}>
                With over two decades of experience, we've guided hundreds of international investors
                and families through Dubai's real estate market with transparency, deep knowledge, and genuine care.
              </p>
              <Link to="/about" className="btn-outline btn-outline-light">Our Story</Link>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="section-padding-lg" style={{ backgroundColor: '#faf8f5' }}>
        <div className="container-narrow">
          <SectionHeading subtitle="Client Stories" title="Trusted Worldwide" description="What our clients say about working with Your Homes." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.slice(0, 3).map((t, i) => (
              <AnimatedReveal key={t.id} delay={i * 0.12}>
                <div className="premium-card p-7 h-full flex flex-col relative">
                  <div className="quote-mark absolute -top-2 left-6">"</div>
                  <div className="pt-6 flex-1">
                    <p className="text-[13px] leading-[1.85] mb-6 italic" style={{ fontFamily: 'var(--font-body)', color: '#333333' }}>
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid #f0ebe5' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(14,58,47,0.08)', color: '#0e3a2f', fontFamily: 'var(--font-body)' }}>
                      {t.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-[14px] font-medium" style={{ fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}>
                        {t.name}
                      </div>
                      <div className="text-[10px]" style={{ fontFamily: 'var(--font-body)', color: '#9a9a9a' }}>
                        {t.location} · {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ GOLDEN VISA ═══════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0e3a2f' }}>
        <div className="container-wide px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="py-16 lg:py-20 lg:pr-16 flex flex-col justify-center">
              <AnimatedReveal>
                <span className="eyebrow text-[10px] mb-4 block" style={{ color: 'rgba(194,167,109,0.7)' }}>Investor Advisory</span>
                <h2 className="text-white mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
                  Golden Visa &<br />Investment Advisory
                </h2>
                <p className="text-[14px] leading-[1.85] mb-8 max-w-md" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
                  Property investments of AED 2M+ qualify for a 10-year UAE Golden Visa. Our specialist team
                  handles the entire process — from identifying qualifying properties to visa application support.
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {['10-Year Residency', 'Family Sponsorship', 'Property Selection', 'Visa Processing'].map(item => (
                    <span key={item} className="text-[10px] uppercase tracking-[0.12em] font-semibold px-3 py-1.5" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {item}
                    </span>
                  ))}
                </div>
                <Link to="/contact" className="btn-gold inline-block">Speak to an Advisor</Link>
              </AnimatedReveal>
            </div>
            <div className="relative min-h-[300px] lg:min-h-[400px]">
              <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80" alt="Dubai investment" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(14,58,47,0.2)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONSULTATION CTA ═══════════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920&q=80" alt="Dubai" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(14,58,47,0.93), rgba(14,58,47,0.82))' }} />
        </div>
        <div className="relative z-10 container-narrow text-center px-6">
          <AnimatedReveal>
            <span className="eyebrow text-[10px] mb-4 block" style={{ color: 'rgba(194,167,109,0.7)' }}>Start Your Journey</span>
            <h2 className="text-white mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
              Ready to Find Your Ideal<br />Dubai Property?
            </h2>
            <p className="text-[14px] max-w-md mx-auto mb-9" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
              Schedule a private consultation. We'll understand your goals and curate opportunities tailored to you.
            </p>
            <Link to="/contact" className="btn-gold">Book Your Consultation</Link>
          </AnimatedReveal>
        </div>
      </section>

      {/* ═══════════════ CONTACT FORM ═══════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <AnimatedReveal>
                <span className="eyebrow mb-4 block">Get in Touch</span>
                <div className="gold-line mb-6" />
                <h2 className="mb-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: '#1a1a1a' }}>
                  Let's Start a Conversation
                </h2>
                <p className="text-[14px] leading-[1.85] mb-8" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>
                  Whether exploring investments, searching for a dream home, or seeking expert advice — we're here to help.
                </p>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[13px]" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>
                      <span style={{ color: '#c2a76d', fontSize: '6px' }}>◆</span>
                      {item.href ? <a href={item.href} className="hover:text-charcoal transition-colors">{item.text}</a> : <span>{item.text}</span>}
                    </div>
                  ))}
                </div>
              </AnimatedReveal>
            </div>
            <div className="lg:col-span-3">
              <div className="p-7 lg:p-8" style={{ border: '1px solid #e5e0d9' }}>
                <LeadCaptureForm variant="compact" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
