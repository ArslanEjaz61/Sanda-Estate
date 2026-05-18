import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <section
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: '#2f1e16' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div
          className="text-[120px] lg:text-[180px] leading-none mb-4"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'rgba(194,167,109,0.15)',
            fontWeight: 300,
          }}
        >
          404
        </div>
        <h2
          className="text-white text-2xl lg:text-3xl mb-4"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
        >
          Page Not Found
        </h2>
        <p
          className="text-white/50 text-base mb-10 max-w-md mx-auto"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          The page you're looking for doesn't exist or has been moved.
          Let us guide you back.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-4 text-[12px] uppercase tracking-[0.15em] font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              fontFamily: 'var(--font-body)',
              backgroundColor: '#c2a76d',
              color: '#1a1a1a',
            }}
          >
            Return Home
          </Link>
          <Link
            to="/properties"
            className="px-8 py-4 text-[12px] uppercase tracking-[0.15em] font-semibold border transition-all duration-300 hover:bg-white/10"
            style={{
              fontFamily: 'var(--font-body)',
              borderColor: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
            }}
          >
            Browse Properties
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
