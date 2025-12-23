'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

const galleryImages = [
  { src: '/images/gallery/restaurant.jpg', alt: 'Restaurant dining area' },
  { src: '/images/gallery/bedroom.jpg', alt: 'Luxury bedroom' },
  { src: '/images/gallery/Nags-Back-Room.jpg', alt: 'Back room with fireplace' },
  { src: '/images/gallery/Nags-Bedroom2.jpg', alt: 'Bedroom suite' },
  { src: '/images/gallery/Nags-Bedroom4.jpg', alt: 'Comfortable bedroom' },
  { src: '/images/gallery/Nags-Open-All-Day.jpg', alt: 'Open all day dining' },
  { src: '/images/gallery/Nags-Pet-Dining.jpg', alt: 'Pet friendly dining area' },
  { src: '/images/gallery/Nags-PostBox.jpg', alt: 'Traditional red postbox' },
]

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-stone-800 text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif sm:text-5xl mb-4">Gallery</h1>
          <p className="text-stone-300 max-w-2xl mx-auto">
            Take a look around The Nags Head Inn
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => openLightbox(index)}
                className="relative aspect-square overflow-hidden bg-stone-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7A1B1B] focus:ring-offset-2"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                {/* Zoom icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-8 h-8 text-white drop-shadow-lg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryImages.map((image) => ({
          src: image.src,
          alt: image.alt,
        }))}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
        }}
      />
    </div>
  )
}
