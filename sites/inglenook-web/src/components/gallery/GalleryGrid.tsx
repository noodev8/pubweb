'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { GalleryImage, GalleryResponse } from '@/types'
import { cloudinaryLoader, optimisedUrl } from '@/lib/cloudinary'

interface GalleryGridProps {
  initialImages: GalleryImage[]
  totalCount: number
  batchSize: number
}

function GalleryThumbnail({
  image,
  onClick,
}: {
  image: GalleryImage
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full aspect-square overflow-hidden bg-stone-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7A1B1B] focus:ring-offset-2 active:scale-[0.98] transition-transform"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        loader={image.src.includes('cloudinary') ? cloudinaryLoader : undefined}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      {/* Hover overlay - desktop only */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors hidden sm:block" />

      {/* Zoom icon - desktop hover only */}
      <div className="absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
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
    </button>
  )
}

export function GalleryGrid({ initialImages, totalCount, batchSize }: GalleryGridProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [loading, setLoading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const hasMore = images.length < totalCount

  const loadMore = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/gallery?limit=${batchSize}&offset=${images.length}`)
      const data: GalleryResponse = await res.json()
      setImages(prev => [...prev, ...data.images])
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-3 md:gap-4">
        {images.map((image, index) => (
          <GalleryThumbnail
            key={image.id}
            image={image}
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8 sm:mt-12">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-[#7A1B1B] text-white font-medium hover:bg-[#5e1515] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        plugins={[Captions]}
        slides={images.map((image) => ({
          src: optimisedUrl(image.src, 1600),
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
