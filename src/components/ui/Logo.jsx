import React from 'react'

export default function Logo({ isSolid = true, variant = '', className = '' }) {
  // Determine if it is in the footer based on variant
  const isFooter = variant === 'light'
  
  // Set beautiful larger dimensions
  const logoHeightClass = isFooter ? 'h-20 md:h-24' : 'h-14 md:h-16'

  return (
    <div className="flex items-center select-none">
      <img 
        src="/sanda-logo.png" 
        alt="Sanda Estate" 
        className={`${logoHeightClass} w-auto object-contain transition-transform duration-300 hover:scale-105`}
        style={{ display: 'block' }}
      />
    </div>
  )
}


