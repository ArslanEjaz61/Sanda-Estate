import { useState, useMemo, useEffect } from 'react'
import PropertyCard from '../components/ui/PropertyCard'
import AnimatedReveal from '../components/ui/AnimatedReveal'
import { DeveloperLogos } from '../components/ui/DeveloperLogos'
import { propertyTypes, priceRanges, bedroomOptions, statusOptions } from '../data/properties'
import { fetchProperties, fetchAreas } from '../utils/api'

const ITEMS_PER_PAGE = 9

export default function PropertiesPage() {
  const [filters, setFilters] = useState({
    search: '', type: 'All', priceRange: 0, area: 'All', bedrooms: 'Any', status: 'All', sort: 'featured',
  })
  const [liveAreas, setLiveAreas] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [allProperties, setAllProperties] = useState([])

  const [debounceSearch, setDebounceSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(filters.search)
    }, 500)
    return () => clearTimeout(timer)
  }, [filters.search])

  useEffect(() => {
    fetchAreas().then(data => {
      if (data) setLiveAreas(data)
    })
  }, [])

  useEffect(() => {
    fetchProperties({ search: debounceSearch }).then(data => {
      if (data) {
        setAllProperties(data)
      } else {
        setAllProperties([])
      }
    }).catch(() => {
      setAllProperties([])
    })
  }, [debounceSearch])

  const filteredProperties = useMemo(() => {
    let result = [...allProperties]

    if (filters.type !== 'All') result = result.filter(p => p.type === filters.type)
    const range = priceRanges[filters.priceRange]
    result = result.filter(p => p.price >= range.min && p.price <= range.max)
    if (filters.area !== 'All') result = result.filter(p => p.locationSlug === filters.area)
    if (filters.bedrooms !== 'Any') {
      const beds = parseInt(filters.bedrooms)
      if (filters.bedrooms === '6+') result = result.filter(p => p.bedrooms >= 6)
      else result = result.filter(p => p.bedrooms === beds)
    }
    if (filters.status !== 'All') result = result.filter(p => p.status === filters.status)
    switch (filters.sort) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'newest': result.reverse(); break
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    return result
  }, [filters, allProperties])

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const paginatedProperties = filteredProperties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const updateFilter = (key, value) => { setFilters(prev => ({ ...prev, [key]: value })); setCurrentPage(1) }

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80"
            alt="Dubai Luxury Properties"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,78,59,0.92), rgba(4,56,42,0.88))' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03] z-[1]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="container-wide px-6 lg:px-10 relative z-10 pt-48 pb-10 lg:pt-56 lg:pb-14">
          <AnimatedReveal>
            <span className="eyebrow text-[10px] mb-3 block" style={{ color: 'rgba(201,168,76,0.7)' }}>Our Collection</span>
            <h1 className="text-white mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
              Explore Dubai's{' '}
              <span className="italic" style={{ color: '#C2A76D' }}>Premier</span>{' '}
              Properties
            </h1>
            <p className="text-[14px] max-w-lg" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
              Browse our curated portfolio of premium Dubai properties, selected for quality, value, and lifestyle.
            </p>
          </AnimatedReveal>
        </div>
      </section>

      {/* ═══════════════ FILTERS ═══════════════ */}
      <section className="py-5 lg:py-6" style={{ backgroundColor: '#f7f6f3', borderBottom: '1px solid #f7f6f3' }}>
        <div className="container-wide px-6 lg:px-10">
          <button
            className="lg:hidden w-full py-3 mb-3 text-[11px] uppercase tracking-[0.15em] font-semibold"
            style={{ fontFamily: 'var(--font-body)', border: '1px solid #e5e0d9', color: '#1a1a1a' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'} ({filteredProperties.length})
          </button>

          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-4">
              <div>
                <label className="premium-label">Search</label>
                <input
                  type="text"
                  placeholder="Property name..."
                  value={filters.search}
                  onChange={e => updateFilter('search', e.target.value)}
                  className="premium-input text-[12px] w-full"
                />
              </div>
              {[
                { label: 'Type', key: 'type', options: propertyTypes.map(t => ({ value: t, label: t })) },
                { label: 'Price Range', key: 'priceRange', options: priceRanges.map((r, i) => ({ value: i, label: r.label })), isIndex: true },
                { label: 'Area', key: 'area', options: [{ value: 'All', label: 'All Areas' }, ...liveAreas.map(a => ({ value: a.slug, label: a.name }))] },
                { label: 'Bedrooms', key: 'bedrooms', options: bedroomOptions.map(b => ({ value: b, label: b })) },
                { label: 'Status', key: 'status', options: [{ value: 'All', label: 'All Status' }, { value: 'Ready', label: 'Ready' }, { value: 'Off-Plan', label: 'Off-Plan' }, { value: 'Resale', label: 'Resale' }, { value: 'Rental', label: 'Rental' }] },
                { label: 'Sort By', key: 'sort', options: [{ value: 'featured', label: 'Featured' }, { value: 'price-low', label: 'Price: Low–High' }, { value: 'price-high', label: 'Price: High–Low' }, { value: 'newest', label: 'Newest' }] },
              ].map(filter => (
                <div key={filter.key}>
                  <label className="premium-label">{filter.label}</label>
                  <select
                    value={filters[filter.key]}
                    onChange={e => updateFilter(filter.key, filter.isIndex ? parseInt(e.target.value) : e.target.value)}
                    className="premium-input text-[12px]"
                  >
                    {filter.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              ))}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({ search: '', type: 'All', priceRange: 0, area: 'All', bedrooms: 'Any', status: 'All', sort: 'featured' })
                    setDebounceSearch('')
                    setCurrentPage(1)
                  }}
                  className="w-full text-[12px] uppercase tracking-[0.1em] font-semibold flex items-center justify-center gap-2 h-[42px] transition-all hover:bg-white"
                  style={{ fontFamily: 'var(--font-body)', background: 'rgba(255,255,255,0.5)', border: '1px solid #e5e0d9', color: '#1a1a1a', borderRadius: '2px' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-between">
            <span className="text-[12px]" style={{ fontFamily: 'var(--font-body)', color: '#9a9a9a' }}>
              Showing {paginatedProperties.length} of {filteredProperties.length} properties
            </span>
            <span className="text-[11px] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#9a9a9a' }}>
              Grid View  ·  Map View
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════ GRID ═══════════════ */}
      <section className="section-padding pt-8" style={{ backgroundColor: '#f7f6f3' }}>
        <div className="container-wide px-6 lg:px-10">
          {paginatedProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-9">
                {paginatedProperties.map((property, i) => (
                  <PropertyCard key={property.id} property={property} index={i} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-14">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => { setCurrentPage(page); window.scrollTo(0, 300) }}
                      className="w-10 h-10 flex items-center justify-center text-[12px] transition-all duration-300"
                      style={{
                        fontFamily: 'var(--font-body)',
                        backgroundColor: currentPage === page ? '#0E3A2F' : 'transparent',
                        color: currentPage === page ? '#ffffff' : '#6b6b6b',
                        border: currentPage === page ? 'none' : '1px solid #e5e0d9',
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}>No Properties Found</h3>
              <p className="text-[14px]" style={{ fontFamily: 'var(--font-body)', color: '#9a9a9a' }}>Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ DEVELOPER LOGOS FOOTER ═══════════════ */}
      <section className="py-12 lg:py-14" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f7f6f3' }}>
        <div className="container-wide px-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-20">
            <span className="text-[9px] uppercase tracking-[0.15em] mb-2 lg:mb-0" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#9a9a9a' }}>Featured Developers</span>
            <div className="flex flex-wrap items-center gap-8 lg:gap-16 text-[#1a1a1a]">
              <div className="hover:text-emerald-deep transition-colors"><DeveloperLogos.Emaar /></div>
              <div className="hover:text-emerald-deep transition-colors"><DeveloperLogos.Damac /></div>
              <div className="hover:text-emerald-deep transition-colors"><DeveloperLogos.Nakheel /></div>
              <div className="hover:text-emerald-deep transition-colors"><DeveloperLogos.Sobha /></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
