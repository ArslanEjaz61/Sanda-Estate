import React from 'react'

export default function Logo({ isSolid = true, variant = '', className = 'h-11 w-auto' }) {
  // Determine color scheme based on props
  const isLight = variant === 'light' || (!isSolid && variant !== 'dark')
  
  const textColor = isLight ? '#f7f6f3' : '#2f1e16'
  const subtextColor = isLight ? 'rgba(255,255,255,0.45)' : '#6b6b6b'
  const goldColor = '#c2a76d'

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Premium SVG Icon */}
      <svg 
        width="38" 
        height="38" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Stunning Metallic Gold Gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3e5c8" />
            <stop offset="35%" stopColor="#c2a76d" />
            <stop offset="100%" stopColor="#90733d" />
          </linearGradient>
          {/* Subtle reflection on the background frame */}
          <linearGradient id="frameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isLight ? "rgba(255,255,255,0.15)" : "rgba(47,30,22,0.06)"} />
            <stop offset="100%" stopColor={isLight ? "rgba(255,255,255,0.02)" : "rgba(47,30,22,0.01)"} />
          </linearGradient>
        </defs>

        {/* Outer Hexagonal Shield / Octagon */}
        <path 
          d="M50 5 L89 27.5 V72.5 L50 95 L11 72.5 V27.5 L50 5 Z" 
          fill="url(#frameGrad)" 
          stroke="url(#goldGrad)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />

        {/* Outer thin border inset */}
        <path 
          d="M50 10 L84 29.5 V70.5 L50 90 L16 29.5 V70.5 Z" 
          stroke="url(#goldGrad)" 
          strokeWidth="0.5" 
          strokeDasharray="2 3"
          opacity="0.5"
        />

        {/* Interlocking geometric 'S' Monogram & Pillar */}
        {/* Core Vertical Pillar / Real Estate Core */}
        <rect x="47" y="22" width="6" height="56" rx="2" fill="url(#goldGrad)" />
        
        {/* 'S' Monogram Curves */}
        <path 
          d="M32 36 C32 26 44 24 50 24 C58 24 68 28 68 36 C68 47 50 48 50 54 C50 60 68 60 68 64 C68 74 56 76 50 76 C40 76 32 72 32 64" 
          stroke="url(#goldGrad)" 
          strokeWidth="6" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Accent Diamond Insets */}
        <path d="M50 15 L53 20 L50 25 L47 20 Z" fill="url(#goldGrad)" />
        <path d="M50 75 L53 80 L50 85 L47 80 Z" fill="url(#goldGrad)" />
      </svg>

      {/* Typography Section */}
      <div className="flex flex-col justify-center leading-none">
        <span 
          style={{ 
            color: textColor, 
            fontFamily: "var(--font-heading)", 
            fontWeight: 400,
            fontSize: '18px',
            letterSpacing: '0.12em',
            lineHeight: '1.1'
          }}
        >
          SANDA
        </span>
        <span 
          style={{ 
            color: goldColor, 
            fontFamily: "var(--font-body)", 
            fontWeight: 600,
            fontSize: '9px',
            letterSpacing: '0.3em',
            lineHeight: '1.2',
            marginTop: '2px'
          }}
        >
          ESTATE
        </span>
      </div>
    </div>
  )
}
