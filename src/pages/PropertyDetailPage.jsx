import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedReveal from '../components/ui/AnimatedReveal'
import LeadCaptureForm from '../components/ui/LeadCaptureForm'
import PropertyCard from '../components/ui/PropertyCard'
import { properties } from '../data/properties'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const property = properties.find(p => p.id === id)
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center">
          <h2 className="text-3xl mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}>Property Not Found</h2>
          <Link to="/properties" className="btn-outline btn-outline-dark">Back to Properties</Link>
        </div>
      </div>
    )
  }

  const relatedProperties = properties.filter(p => p.id !== property.id && p.locationSlug === property.locationSlug).slice(0, 3)

  return (
    <>
      {/* ═══════════════ HERO BREADCRUMB ═══════════════ */}
      <section className="pt-36 pb-4 lg:pt-44 lg:pb-6" style={{ backgroundColor: '#faf8f5' }}>
        <div className="container-wide px-6 lg:px-10">
          <div className="flex items-center gap-2 text-[11px]" style={{ fontFamily: 'var(--font-body)', color: '#9a9a9a' }}>
            <Link to="/properties" className="hover:text-charcoal transition-colors">Properties</Link>
            <span>→</span>
            <span>{property.location}</span>
            <span>→</span>
            <span style={{ color: '#6b6b6b' }}>{property.title}</span>
          </div>
        </div>
      </section>

      {/* ═══════════════ GALLERY ═══════════════ */}
      <section style={{ backgroundColor: '#faf8f5' }}>
        <div className="container-wide px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1.5">
            <div className="lg:col-span-2 aspect-[16/10] overflow-hidden cursor-pointer group" onClick={() => setLightboxOpen(true)}>
              <img src={property.gallery[activeImage]} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
              {property.gallery.slice(1, 4).map((img, i) => (
                <div key={i} className="aspect-[16/10] lg:aspect-auto overflow-hidden cursor-pointer group" onClick={() => { setActiveImage(i + 1); setLightboxOpen(true) }}>
                  <img src={img} alt={`${property.title} ${i + 2}`} className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.03]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
            <button className="absolute top-6 right-6 text-white/50 hover:text-white text-xl" onClick={() => setLightboxOpen(false)}>✕</button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-2xl" onClick={e => { e.stopPropagation(); setActiveImage(p => (p > 0 ? p - 1 : property.gallery.length - 1)) }}>‹</button>
            <img src={property.gallery[activeImage]} alt={property.title} className="max-w-full max-h-[85vh] object-contain" onClick={e => e.stopPropagation()} />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-2xl" onClick={e => { e.stopPropagation(); setActiveImage(p => (p < property.gallery.length - 1 ? p + 1 : 0)) }}>›</button>
            <div className="absolute bottom-6 flex gap-2">
              {property.gallery.map((_, i) => (
                <button key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImage ? 'bg-white w-4' : 'bg-white/25'}`} onClick={e => { e.stopPropagation(); setActiveImage(i) }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ CONTENT ═══════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#faf8f5' }}>
        <div className="container-wide px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            <div className="lg:col-span-2">
              <AnimatedReveal>
                {/* Title and heading */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`badge ${property.status === 'Ready' ? 'badge-emerald' : 'badge-dark'}`}>{property.status}</span>
                    {property.goldenVisa && <span className="badge badge-gold">Golden Visa Eligible</span>}
                  </div>
                  <h1 className="mb-2.5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#1a1a1a' }}>
                    {property.title}
                  </h1>
                  <div className="text-[12px] mb-4" style={{ fontFamily: 'var(--font-body)', color: '#9a9a9a' }}>
                    {property.location} · {property.type} · {property.developer}
                  </div>
                  <div className="text-[24px] lg:text-[28px]" style={{ fontFamily: 'var(--font-heading)', color: '#064e3b', fontWeight: 500 }}>
                    {property.priceFormatted}
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-5 p-5 mb-8 premium-card">
                  {[
                    { label: 'Bedrooms', value: property.bedrooms },
                    { label: 'Bathrooms', value: property.bathrooms },
                    { label: 'Area', value: `${property.area.toLocaleString()} ${property.areaUnit}` },
                  ].map((spec, i) => (
                    <div key={i} className="text-center">
                      <div className="text-[20px] lg:text-[22px] mb-0.5" style={{ fontFamily: 'var(--font-heading)', color: '#064e3b' }}>{spec.value}</div>
                      <div className="text-[9px] uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#9a9a9a' }}>{spec.label}</div>
                    </div>
                  ))}
                </div>

                <div className="gold-line mb-5" />
                <h3 className="text-[19px] mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>Overview</h3>
                <p className="text-[14px] leading-[1.85] mb-8" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>{property.description}</p>

                <h3 className="text-[19px] mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-8">
                  {property.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-[13px]" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>
                      <span style={{ color: '#c9a84c', fontSize: '6px' }}>◆</span>{feature}
                    </div>
                  ))}
                </div>

                <h3 className="text-[19px] mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>Community Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-8">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-[13px]" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>
                      <span style={{ color: '#064e3b', fontSize: '6px' }}>◆</span>{amenity}
                    </div>
                  ))}
                </div>

                {/* Community Link */}
                <div className="premium-card p-5 flex items-center justify-between mb-8">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.15em] mb-0.5" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#9a9a9a' }}>Community</div>
                    <div className="text-[17px]" style={{ fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}>{property.location}</div>
                  </div>
                  <Link to={`/areas/${property.locationSlug}`} className="eyebrow text-[10px] hover:text-emerald-deep transition-colors">Explore Area →</Link>
                </div>

                {/* Developer logos */}
                <div className="flex flex-wrap items-center gap-6 pt-6" style={{ borderTop: '1px solid #e5e0d9' }}>
                  <span className="text-[9px] uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#9a9a9a' }}>Partnered With</span>
                  {['EMAAR', 'DAMAC', 'NAKHEEL', 'SOBHA'].map(dev => (
                    <span key={dev} className="text-[14px] font-bold tracking-[0.15em]" style={{ fontFamily: 'var(--font-body)', color: '#c4bfb7' }}>{dev}</span>
                  ))}
                </div>
              </AnimatedReveal>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="p-6 lg:p-7" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e0d9' }}>
                  <h3 className="text-[20px] mb-1.5 text-center" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>Interested?</h3>
                  <p className="text-[12px] text-center mb-5" style={{ fontFamily: 'var(--font-body)', color: '#9a9a9a' }}>Request details or schedule a viewing.</p>
                  <LeadCaptureForm variant="compact" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ RELATED PROPERTIES ═══════════════ */}
      {relatedProperties.length > 0 && (
        <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
          <div className="container-wide px-6 lg:px-10">
            <AnimatedReveal>
              <div className="text-center mb-10">
                <span className="eyebrow mb-3 block">Similar Properties</span>
                <div className="gold-line-center mb-5" />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: '#1a1a1a' }}>More in {property.location}</h2>
              </div>
            </AnimatedReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {relatedProperties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
