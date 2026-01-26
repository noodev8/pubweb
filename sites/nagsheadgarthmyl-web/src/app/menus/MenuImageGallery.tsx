'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu } from '@/types'

interface MenuImageGalleryProps {
  menus: Menu[]
}

function MenuCard({ menu, onImageClick }: { menu: Menu; onImageClick: () => void }) {
  if (!menu.imageUrl) return null

  return (
    <div className="bg-white shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-serif text-stone-900 mb-2">{menu.name}</h2>
        {menu.description && (
          <p className="text-stone-600 text-sm mb-4">{menu.description}</p>
        )}
      </div>

      {/* Menu Image - Click to view full */}
      <button
        type="button"
        onClick={onImageClick}
        className="relative w-full aspect-[3/4] bg-stone-100 group cursor-pointer"
      >
        <Image
          src={menu.imageUrl}
          alt={`${menu.name}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          {/* Desktop: show on hover */}
          <span className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-full text-stone-900 font-medium text-sm shadow-lg">
            Click to view full menu
          </span>
        </div>
        {/* Mobile: always visible at bottom */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center md:hidden">
          <span className="bg-white/90 px-3 py-1.5 rounded-full text-stone-700 text-xs font-medium shadow">
            Tap to enlarge
          </span>
        </div>
      </button>

      {/* PDF download link if available */}
      {menu.pdfUrl && (
        <div className="p-4 border-t border-stone-100">
          <a
            href={`/api/menu-pdf/${menu.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
          >
            Download PDF version →
          </a>
        </div>
      )}
    </div>
  )
}

function Lightbox({ imageUrl, menuName, onClose }: { imageUrl: string; menuName: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Menu name */}
      <div className="absolute top-4 left-4 text-white/80 font-serif text-lg">
        {menuName}
      </div>

      {/* Image container */}
      <div
        className="relative w-full h-full max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageUrl}
          alt={menuName}
          fill
          className="object-contain"
          sizes="100vw"
          priority
          unoptimized
        />
      </div>
    </div>
  )
}

export function MenuImageGallery({ menus }: MenuImageGalleryProps) {
  const [lightboxMenu, setLightboxMenu] = useState<Menu | null>(null)

  // Filter to only menus that have images
  const menusWithImages = menus.filter(menu => menu.imageUrl)

  if (menusWithImages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600">
          Menus are currently being updated. Please check back soon or contact us for details.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2">
        {menusWithImages.map((menu) => (
          <MenuCard
            key={menu.id}
            menu={menu}
            onImageClick={() => setLightboxMenu(menu)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxMenu && lightboxMenu.imageUrl && (
        <Lightbox
          imageUrl={lightboxMenu.imageUrl}
          menuName={lightboxMenu.name}
          onClose={() => setLightboxMenu(null)}
        />
      )}
    </>
  )
}
