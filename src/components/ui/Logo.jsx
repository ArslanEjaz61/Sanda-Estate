import React from 'react'

export default function Logo({ isSolid = true, variant = '', className = '', size = '' }) {
  // Determine size class
  let logoHeightClass = 'h-20 md:h-24' // Default header size
  
  if (variant === 'light') {
    logoHeightClass = 'h-32 md:h-40' // Large footer size
  }
  
  if (size === 'sm') {
    logoHeightClass = 'h-10 md:h-12' // Small sidebar / admin size
  }

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img 
        src="/sanda-logo.png" 
        alt="Sanda Estate" 
        className={`${logoHeightClass} w-auto object-contain transition-transform duration-300 hover:scale-105`}
        style={{ display: 'block' }}
      />
    </div>
  )
}



