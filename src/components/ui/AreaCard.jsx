import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const areaTags = {
  'palm-jumeirah': ['Waterfront', 'Ultra Luxury'],
  'downtown-dubai': ['Prime Location', 'Iconic'],
  'dubai-marina': ['Waterfront', 'High Yield'],
  'dubai-hills': ['Family', 'Green Living'],
  'business-bay': ['High Yield', 'Urban'],
  'jvc': ['Value', 'High Yield'],
}

export default function AreaCard({ area, index = 0 }) {
  const tags = areaTags[area.slug] || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link to={`/areas/${area.slug}`} className="group block relative overflow-hidden">
        <div className="aspect-[3/4] lg:aspect-[3/4]">
          <img
            src={area.image}
            alt={area.name}
            className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
          {/* Multi-layer gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.02) 100%)',
            }}
          />
          {/* Hover darken */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-600" />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="absolute top-4 left-4 flex gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] font-bold text-white/90 backdrop-blur-sm"
                  style={{ background: 'rgba(201,168,76,0.7)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
            <div className="eyebrow text-[9px] mb-2 text-white/50">
              {area.tagline}
            </div>
            <h3
              className="text-[22px] lg:text-[26px] text-white mb-1.5 leading-[1.15]"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}
            >
              {area.name}
            </h3>
            <p
              className="text-[12px] text-white/50 line-clamp-2 mb-4 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {area.shortDescription}
            </p>
            <div
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/70 group-hover:text-gold-muted transition-colors duration-400"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
            >
              Explore Area
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
