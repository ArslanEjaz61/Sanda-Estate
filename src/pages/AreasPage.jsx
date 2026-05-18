import { useState, useEffect } from 'react'
import { fetchAreas } from '../utils/api'
import AreaCard from '../components/ui/AreaCard'
import AnimatedReveal from '../components/ui/AnimatedReveal'

export default function AreasPage() {
  const [liveAreas, setLiveAreas] = useState([])

  useEffect(() => {
    fetchAreas().then(data => {
      if (data) setLiveAreas(data)
    })
  }, [])

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#2f1e16' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="container-wide px-6 lg:px-10 relative z-10 pt-48 pb-14 lg:pt-56 lg:pb-20 text-center">
          <AnimatedReveal>
            <span className="eyebrow text-[10px] mb-5 block" style={{ color: 'rgba(194,167,109,0.7)' }}>Dubai Communities</span>
            <h1 className="text-white mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
              Explore Dubai's{' '}
              <span className="italic" style={{ color: '#c2a76d' }}>Premier</span>{' '}
              Areas
            </h1>
            <p className="text-[14px] max-w-xl mx-auto leading-[1.85]" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
              Discover the neighbourhoods that define Dubai's luxury real estate landscape. Each community offers a unique lifestyle and investment profile.
            </p>
          </AnimatedReveal>
        </div>
      </section>

      {/* ═══════════════ AREAS GRID ═══════════════ */}
      <section className="section-padding-lg" style={{ backgroundColor: '#f7f6f3' }}>
        <div className="container-wide px-6 lg:px-10">
          {liveAreas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {liveAreas.map((area, i) => (
                <AreaCard key={area.slug} area={area} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>No Areas Found</h3>
              <p className="text-gray-warm text-[14px]" style={{ fontFamily: 'var(--font-body)' }}>
                We are currently updating our community collections. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ BOTTOM FEATURES STRIP ═══════════════ */}
      <section className="py-14 lg:py-16" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f7f6f3' }}>
        <div className="container-narrow">
          <AnimatedReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Transparency', desc: 'Full market data' },
                { label: 'No Income Tax', desc: 'Tax-free returns' },
                { label: 'Freehold Ownership', desc: 'International buyers' },
                { label: 'High Rental Yields', desc: '5-8% annual returns' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <h4 className="text-[16px] mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>{item.label}</h4>
                  <p className="text-[11px] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: '#9a9a9a' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedReveal>
        </div>
      </section>
    </>
  )
}
