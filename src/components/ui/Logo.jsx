import React from 'react'

export default function Logo({ isSolid = true, variant = '', className = 'h-11 w-auto' }) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img 
        src="/Sanda-Estate.jpeg" 
        alt="Sanda Estate" 
        className="h-full w-auto object-contain max-h-full transition-transform duration-300 hover:scale-105"
        style={{ display: 'block' }}
      />
    </div>
  )
}

