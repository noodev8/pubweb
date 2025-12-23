'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const heroImages = [
  {
    src: '/images/hero-1.jpg',
    alt: 'The Nags Head Inn at night',
  },
  {
    src: '/images/hero-2.jpg',
    alt: 'The Nags Head Inn exterior',
  },
]

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000) // Change image every 6 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {heroImages.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </>
  )
}
