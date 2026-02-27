'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface HeroCarouselProps {
  venueName: string
}

export function HeroCarousel({ venueName }: HeroCarouselProps) {
  const heroImages = [
    {
      src: '/images/hero-1.jpg',
      alt: `${venueName} at night`,
    },
    {
      src: '/images/hero-2.jpg',
      alt: `${venueName} exterior`,
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000) // Change image every 6 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <>
      {heroImages.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </>
  )
}
