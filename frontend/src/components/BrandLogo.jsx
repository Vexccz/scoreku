import { useState } from 'react'

export default function BrandLogo({ name, url, fallbackColor, size = 'h-8 w-8', className = '' }) {
  const [error, setError] = useState(false)

  if (error || !url) {
    return (
      <div
        className={`${size} rounded-lg flex items-center justify-center text-white text-xs font-bold ${className}`}
        style={{ backgroundColor: fallbackColor }}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={name}
      className={`${size} rounded object-contain ${className}`}
      onError={() => setError(true)}
    />
  )
}
