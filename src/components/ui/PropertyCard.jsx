import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PropertyCard({ property, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link to={`/properties/${property.id}`} className="group block">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3] mb-4">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* View Property CTA */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <span
              className="px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-white backdrop-blur-md translate-y-3 group-hover:translate-y-0 transition-transform duration-500"
              style={{ background: 'rgba(6,78,59,0.85)' }}
            >
              View Property
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`badge ${property.status === 'Ready' ? 'badge-emerald' : 'badge-dark'}`}>
              {property.status}
            </span>
          </div>
          {property.goldenVisa && (
            <span className="badge badge-gold absolute top-3 right-3">
              Golden Visa
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-1">
          <div className="eyebrow text-[9px] mb-2.5 tracking-[0.2em]" style={{ color: '#9a9a9a' }}>
            {property.location} · {property.type}
          </div>
          <h3
            className="text-[19px] lg:text-[21px] mb-3 leading-[1.25] group-hover:text-emerald-deep transition-colors duration-400"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
          >
            {property.title}
          </h3>
          <div className="flex items-center gap-3 text-[12px] text-gray-warm mb-3" style={{ fontFamily: 'var(--font-body)' }}>
            {property.bedrooms !== undefined && property.bedrooms !== null && property.bedrooms !== '' && (
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 22V8l9-6 9 6v14H3z"/><path d="M9 22V12h6v10"/></svg>
                {property.bedrooms} Bed
              </span>
            )}
            {property.bedrooms && property.area && <span className="w-px h-3" style={{ background: '#e5e0d9' }} />}
            {property.area !== undefined && property.area !== null && property.area !== '' && (
              <span className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                {property.area?.toLocaleString()} {property.areaUnit || 'sq ft'}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #f0ebe5' }}>
            <span
              className="text-[17px] font-semibold flex items-baseline gap-1"
              style={{ fontFamily: 'var(--font-heading)', color: '#064e3b', fontWeight: 600 }}
            >
              {property.priceFormatted}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-gray-soft group-hover:text-emerald-deep transition-all duration-300 flex items-center gap-1" style={{ fontFamily: 'var(--font-body)' }}>
              Details 
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                →
              </motion.span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
