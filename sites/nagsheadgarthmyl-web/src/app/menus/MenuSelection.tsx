'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { Menu } from '@/types'
import { cloudinaryLoader, optimisedUrl } from '@/lib/cloudinary'

interface MenuSelectionProps {
  menus: Menu[]
}

function MenuCard({
  menu,
  onViewMenu,
}: {
  menu: Menu
  onViewMenu: () => void
}) {
  // Use first image from images array, fall back to legacy imageUrl
  const thumbnailUrl = menu.images?.[0]?.imageUrl || menu.imageUrl
  if (!thumbnailUrl) return null

  return (
    <div className="bg-white border border-stone-200 hover:border-[#7A1B1B]/30 transition-colors group">
      {/* Card Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Thumbnail - clickable */}
          <button
            type="button"
            onClick={onViewMenu}
            className="relative w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 bg-stone-100 overflow-hidden border border-stone-200 hover:border-[#7A1B1B]/50 transition-all hover:shadow-md cursor-pointer group/thumb"
          >
            <Image
              src={thumbnailUrl}
              alt={menu.name}
              fill
              loader={thumbnailUrl.includes('cloudinary') ? cloudinaryLoader : undefined}
              className="object-cover"
              sizes="96px"
            />
            {/* Hover overlay - desktop only */}
            <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors hidden sm:flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
            </div>

          </button>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-stone-900 mb-1 sm:mb-2 group-hover:text-[#7A1B1B] transition-colors">
              {menu.name}
            </h3>
            {menu.description && (
              <p className="text-stone-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                {menu.description}
              </p>
            )}

            <button
              type="button"
              onClick={onViewMenu}
              className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-[#7A1B1B] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View menu
            </button>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-[#7A1B1B] to-[#7A1B1B]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

export function MenuSelection({ menus }: MenuSelectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxSlides, setLightboxSlides] = useState<Array<{ src: string; alt: string }>>([])

  // Filter to only menus that have images
  const menusWithImages = menus.filter(
    (menu) => (menu.images && menu.images.length > 0) || menu.imageUrl
  )

  const openLightbox = (menu: Menu) => {
    // Build slides from images array, fall back to legacy imageUrl
    const slides = menu.images && menu.images.length > 0
      ? menu.images.map((img, i) => ({
          src: optimisedUrl(img.imageUrl, 1600),
          alt: `${menu.name} - Page ${i + 1}`,
        }))
      : menu.imageUrl
        ? [{ src: optimisedUrl(menu.imageUrl, 1600), alt: menu.name }]
        : []

    if (slides.length > 0) {
      setLightboxSlides(slides)
      setLightboxIndex(0)
      setLightboxOpen(true)
    }
  }

  if (menusWithImages.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-stone-200">
        <div className="max-w-md mx-auto px-4">
          <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <p className="text-stone-600">
            Our menus are currently being updated. Please check back soon or contact us for details.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {menusWithImages.map((menu) => (
          <MenuCard
            key={menu.id}
            menu={menu}
            onViewMenu={() => openLightbox(menu)}
          />
        ))}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3 }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
      />
    </>
  )
}
