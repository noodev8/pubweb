'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const heroImages = [
  {
    src: '/images/explore-hero.jpg',
    alt: 'Lake Vyrnwy Water Tower at sunset',
  },
  {
    src: '/images/explore-hero-2.jpg',
    alt: 'Belan Locks on the Montgomeryshire Canal in winter',
  },
]

export function ExploreHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)

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
