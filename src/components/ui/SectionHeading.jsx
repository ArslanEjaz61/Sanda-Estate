import AnimatedReveal from './AnimatedReveal'

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = 'center',
  light = false,
  className = '',
}) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <AnimatedReveal>
      <div className={`flex flex-col ${alignClass} mb-10 lg:mb-14 ${className}`}>
        {subtitle && (
          <span className="eyebrow mb-4" style={{ color: light ? '#C2A76D' : '#C2A76D' }}>
            {subtitle}
          </span>
        )}
        <div
          className="w-[40px] h-[1.5px] mb-5"
          style={{ background: 'linear-gradient(90deg, #C2A76D, #b6985d)' }}
        />
        <h2
          className="max-w-3xl leading-[1.1]"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: light ? '#ffffff' : '#1a1a1a' }}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-4 max-w-xl text-[14px] leading-[1.8] ${
              light ? 'text-white/60' : 'text-gray-warm'
            }`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {description}
          </p>
        )}
      </div>
    </AnimatedReveal>
  )
}
