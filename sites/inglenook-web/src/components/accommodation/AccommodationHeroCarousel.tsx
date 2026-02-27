'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface AccommodationHeroCarouselProps {
  venueName: string
}

export function AccommodationHeroCarousel({ venueName }: AccommodationHeroCarouselProps) {
  const heroImages = [
    {
      src: '/images/bedroom1-1920x1080.jpg',
      alt: `Luxury bedroom at ${venueName}`,
    },
    {
      src: '/images/bedroom2-1920x1080.jpg',
      alt: 'Elegant ensuite bedroom with Laura Ashley furnishings',
    },
    {
      src: '/images/bedroom3-1920x1080.jpg',
      alt: `Comfortable accommodation at ${venueName}`,
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)

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
