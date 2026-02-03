'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { GalleryImage } from '@/types'

interface GalleryGridProps {
  images: GalleryImage[]
}

function GalleryThumbnail({
  image,
  onClick,
  featured = false,
}: {
  image: GalleryImage
  onClick: () => void
  featured?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full overflow-hidden bg-stone-200 group cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-[#7A1B1B] focus:ring-offset-2
        ${featured ? 'aspect-[4/3] md:col-span-2 md:row-span-2' : 'aspect-square'}
      `}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        unoptimized={image.src.includes('cloudinary')}
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

      {/* Zoom icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-stone-700"
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
      </div>

      {/* Caption overlay for featured */}
      {featured && image.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-sm font-medium">{image.caption}</p>
        </div>
      )}
    </button>
  )
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-16 bg-white">
        <svg
          className="w-12 h-12 text-stone-300 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <p className="text-stone-500">Gallery images coming soon</p>
      </div>
    )
  }

  // Split into featured (first) and rest
  const [featured, ...rest] = images

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Featured first image - larger */}
        <GalleryThumbnail
          image={featured}
          onClick={() => openLightbox(0)}
          featured
        />

        {/* Rest of the images */}
        {rest.map((image, index) => (
          <GalleryThumbnail
            key={image.id}
            image={image}
            onClick={() => openLightbox(index + 1)}
          />
        ))}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        plugins={[Captions]}
        slides={images.map((image) => ({
          src: image.src,
          alt: image.alt,
          title: image.caption,
        }))}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
        captions={{
          showToggle: false,
          descriptionTextAlign: 'center',
        }}
      />
    </>
  )
}
