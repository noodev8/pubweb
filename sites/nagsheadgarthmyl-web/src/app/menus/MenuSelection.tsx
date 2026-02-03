'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu } from '@/types'

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
  if (!menu.imageUrl) return null

  return (
    <div className="bg-white border border-stone-200 hover:border-[#7A1B1B]/30 transition-colors group">
      {/* Card Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Thumbnail - clickable */}
          <button
            type="button"
            onClick={onViewMenu}
            className="relative w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 bg-stone-100 overflow-hidden border border-stone-200 hover:border-[#7A1B1B]/50 transition-all hover:shadow-md group/thumb"
          >
            <Image
              src={menu.imageUrl}
              alt={menu.name}
              fill
              className="object-cover"
              sizes="96px"
              unoptimized
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors flex items-center justify-center">
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

            {/* PDF download if available */}
            {menu.pdfUrl && (
              <a
                href={`/api/menu-pdf/${menu.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-[#7A1B1B] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download PDF
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-[#7A1B1B] to-[#7A1B1B]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

function Lightbox({
  imageUrl,
  menuName,
  onClose,
}: {
  imageUrl: string
  menuName: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      {/* Top bar with menu name and close button */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/50 to-transparent">
        <span className="text-white/90 font-serif text-sm sm:text-lg truncate pr-4">
          {menuName}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 sm:p-2 text-white/80 hover:text-white transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Instruction - hidden on mobile */}
      <div className="absolute bottom-4 left-0 right-0 text-center hidden sm:block">
        <p className="text-white/60 text-sm">Click anywhere to close</p>
      </div>

      {/* Image container */}
      <div
        className="relative w-full h-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] mt-12 sm:mt-0"
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

export function MenuSelection({ menus }: MenuSelectionProps) {
  const [lightboxMenu, setLightboxMenu] = useState<Menu | null>(null)

  // Filter to only menus that have images
  const menusWithImages = menus.filter((menu) => menu.imageUrl)

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
            onViewMenu={() => setLightboxMenu(menu)}
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
