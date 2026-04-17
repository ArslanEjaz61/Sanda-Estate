import { useParams, Link } from 'react-router-dom'
import AnimatedReveal from '../components/ui/AnimatedReveal'
import PropertyCard from '../components/ui/PropertyCard'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import { fetchProperties, fetchAreaBySlug } from '../utils/api'
import { useState, useEffect } from 'react'

export default function AreaDetailPage() {
  const { slug } = useParams()
  const [area, setArea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [areaProperties, setAreaProperties] = useState([])

  useEffect(() => {
    fetchAreaBySlug(slug).then(data => {
      setArea(data)
      setLoading(false)
    })
  }, [slug])

  useEffect(() => {
    if (slug) {
      fetchProperties({ location: slug }).then(data => {
        if (data) setAreaProperties(data.slice(0, 3))
      })
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <p className="text-[13px] text-[#6b6b6b]" style={{ fontFamily: 'var(--font-body)' }}>Loading area details...</p>
      </div>
    )
  }

  if (!area) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center">
          <h2 className="text-3xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Area Not Found</h2>
          <Link to="/areas" className="text-emerald-deep underline" style={{ fontFamily: 'var(--font-body)' }}>
            Back to Areas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={area.heroImage} alt={area.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)' }} />
        </div>
        <div className="relative z-10 container-wide px-6 lg:px-10 pb-16 lg:pb-20">
          <AnimatedReveal>
            <div className="flex items-center gap-2 text-[12px] text-white/50 mb-4" style={{ fontFamily: 'var(--font-body)' }}>
              <Link to="/areas" className="hover:text-white transition-colors">Areas</Link>
              <span>→</span>
              <span className="text-white/70">{area.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <div className="text-[11px] uppercase tracking-[0.25em]" style={{ color: '#c9a84c', fontFamily: 'var(--font-body)' }}>
                {area.tagline}
              </div>
              {area.distanceFromDubaiMall && (
                <>
                  <span className="text-white/30">•</span>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-white/70" style={{ fontFamily: 'var(--font-body)' }}>
                    {area.distanceFromDubaiMall} to Dubai Mall
                  </div>
                </>
              )}
            </div>
            <h1 className="text-white" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              {area.name}
            </h1>
          </AnimatedReveal>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <AnimatedReveal>
              <div className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-4" style={{ color: '#c9a84c', fontFamily: 'var(--font-body)' }}>
                Overview
              </div>
              <div className="gold-line mb-8" />
              <h2 className="mb-6" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>
                {area.name}
              </h2>
              <p className="text-[15px] text-gray-warm leading-[1.9]" style={{ fontFamily: 'var(--font-body)' }}>
                {area.description}
              </p>
            </AnimatedReveal>
            <AnimatedReveal delay={0.2}>
              <div className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-4" style={{ color: '#c9a84c', fontFamily: 'var(--font-body)' }}>
                Lifestyle
              </div>
              <div className="gold-line mb-8" />
              <h3 className="text-xl mb-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Living in {area.name}
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]" style={{ fontFamily: 'var(--font-body)' }}>
                {area.lifestyle}
              </p>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* Investment Appeal + Stats */}
      <section className="section-padding" style={{ backgroundColor: '#faf8f5' }}>
        <div className="container-narrow">
          <AnimatedReveal>
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-4" style={{ color: '#c9a84c', fontFamily: 'var(--font-body)' }}>
              Investment Profile
            </div>
            <div className="gold-line mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <h3 className="text-xl mb-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                  Why Invest in {area.name}
                </h3>
                <p className="text-[15px] text-gray-warm leading-[1.9]" style={{ fontFamily: 'var(--font-body)' }}>
                  {area.investmentAppeal}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {area.stats && Object.entries(area.stats).map(([key, value], i) => (
                  <AnimatedReveal key={key} delay={i * 0.15} direction="up">
                    <div className="p-8 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e0d9' }}>
                      <div className="text-2xl lg:text-3xl mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#064e3b' }}>
                        <AnimatedCounter
                          target={String(value || '').replace(/[^0-9.]/g, '')}
                          prefix={String(value || '').startsWith('AED') ? 'AED ' : ''}
                          suffix={String(value || '').includes('%') ? '%' : String(value || '').includes('+') ? '+' : String(value || '').includes('/sq ft') ? '/sq ft' : ''}
                        />
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-gray-soft" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  </AnimatedReveal>
                ))}
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* Featured Properties in Area */}
      {areaProperties.length > 0 && (
        <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
          <div className="container-wide px-6 lg:px-10">
            <AnimatedReveal>
              <div className="text-center mb-12">
                <div className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-4" style={{ color: '#c9a84c', fontFamily: 'var(--font-body)' }}>Featured in {area.name}</div>
                <div className="gold-line-center mb-6" />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}>Available Properties</h2>
              </div>
            </AnimatedReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {areaProperties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
            <AnimatedReveal>
              <div className="text-center mt-12">
                <Link to="/properties" className="inline-block px-8 py-4 text-[12px] uppercase tracking-[0.15em] font-semibold border transition-all duration-300 hover:bg-charcoal hover:text-white" style={{ fontFamily: 'var(--font-body)', borderColor: '#1a1a1a', color: '#1a1a1a' }}>
                  View All Properties
                </Link>
              </div>
            </AnimatedReveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#064e3b' }}>
        <div className="container-narrow text-center px-6">
          <AnimatedReveal>
            <h2 className="text-white mb-6" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
              Interested in <span style={{ color: '#c9a84c' }}>{area.name}</span>?
            </h2>
            <p className="text-white/60 text-base max-w-xl mx-auto mb-10" style={{ fontFamily: 'var(--font-body)' }}>
              Speak with our area specialist for personalised insights, off-market opportunities, and expert guidance on {area.name}.
            </p>
            <Link to="/contact" className="inline-block px-10 py-4 text-[12px] uppercase tracking-[0.15em] font-semibold transition-all duration-300 hover:scale-[1.02]" style={{ fontFamily: 'var(--font-body)', backgroundColor: '#c9a84c', color: '#1a1a1a' }}>
              Talk to an Advisor
            </Link>
          </AnimatedReveal>
        </div>
      </section>
    </>
  )
}
