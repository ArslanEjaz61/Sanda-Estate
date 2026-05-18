import React from 'react'

export default function Logo({ isSolid = true, variant = '', className = '', size = '' }) {
  // Check if a custom height class (like h-12, h-16, md:h-20 etc.) is supplied in className
  const hasCustomHeight = className.split(' ').some(c => c.startsWith('h-') || c.startsWith('max-h-') || c.startsWith('md:h-'))
  
  // Set beautiful default dimensions if no custom height is provided
  let logoHeightClass = ''
  if (!hasCustomHeight) {
    logoHeightClass = 'h-20 md:h-24' // Default header size
    if (variant === 'light') {
      logoHeightClass = 'h-32 md:h-40' // Large footer size
    }
    if (size === 'sm') {
      logoHeightClass = 'h-10 md:h-12' // Small sidebar / admin size
    }
  }

  return (
    <div className={`flex items-center justify-center select-none overflow-hidden aspect-square ${logoHeightClass} ${className}`}>
      <img 
        src="/sanda-logo.png" 
        alt="Sanda Estate" 
        className="h-full w-full object-contain transition-transform duration-300 scale-[2.1] hover:scale-[2.2]"
        style={{ display: 'block' }}
      />
    </div>
  )
}



