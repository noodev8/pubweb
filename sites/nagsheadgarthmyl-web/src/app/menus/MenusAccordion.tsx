'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, MenuSection as MenuSectionType, DietaryTag } from '@/types'

const dietaryLabels: Record<DietaryTag, string> = {
  vegetarian: 'V',
  vegan: 'VE',
  'gluten-free': 'GF',
  'dairy-free': 'DF',
  'nut-free': 'NF',
  'contains-nuts': 'N',
  spicy: '🌶',
}

function DietaryBadge({ tag }: { tag: DietaryTag }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded">
      {dietaryLabels[tag]}
    </span>
  )
}

function MenuItem({
  name,
  description,
  price,
  priceNote,
  dietaryTags,
  isAvailable,
}: {
  name: string
  description?: string
  price?: number
  priceNote?: string
  dietaryTags?: DietaryTag[]
  isAvailable: boolean
}) {
  if (!isAvailable) return null

  return (
    <div className="py-4 border-b border-stone-200 last:border-0">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-stone-900">{name}</h4>
            {dietaryTags?.map((tag) => (
              <DietaryBadge key={tag} tag={tag} />
            ))}
          </div>
          {description && (
            <p className="text-sm text-stone-600 mt-1">{description}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          {price !== undefined && (
            <span className="font-medium text-stone-900">
              £{price.toFixed(2)}
            </span>
          )}
          {priceNote && (
            <span className="text-sm text-stone-600">{priceNote}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function MenuSectionComponent({ section }: { section: MenuSectionType }) {
  const availableItems = section.items.filter((item) => item.isAvailable)
  if (availableItems.length === 0) return null

  return (
    <div className="mb-10">
      <h3 className="text-2xl font-serif text-stone-900 mb-2">{section.name}</h3>
      {section.description && (
        <p className="text-stone-600 mb-4">{section.description}</p>
      )}
      <div>
        {availableItems.map((item) => (
          <MenuItem
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            priceNote={item.priceNote}
            dietaryTags={item.dietaryTags}
            isAvailable={item.isAvailable}
          />
        ))}
      </div>
    </div>
  )
}

function MenuAccordionItem({ menu, isOpen, onToggle }: { menu: Menu; isOpen: boolean; onToggle: () => void }) {
  const hasItems = menu.sections.length > 0 && menu.sections.some(s => s.items.some(i => i.isAvailable))

  return (
    <div className="bg-white shadow-sm overflow-hidden">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
      >
        <div className="flex-grow">
          <h2 className="text-2xl font-serif text-stone-900">{menu.name}</h2>
          {menu.description && (
            <p className="text-stone-600 text-sm mt-1">{menu.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4 ml-4">
          {/* Menu Image Thumbnail - clickable to view full image */}
          {menu.imageUrl && (
            <a
              href={menu.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:block relative group"
              title="View full menu image"
            >
              <Image
                src={menu.imageUrl}
                alt={`${menu.name} menu`}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded border border-stone-200 group-hover:border-amber-400 transition-colors"
                unoptimized
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                </svg>
              </span>
            </a>
          )}
          {/* Chevron */}
          <svg
            className={`w-6 h-6 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {/* Accordion Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 border-t border-stone-100">
          {/* PDF link only (image link now on thumbnail) */}
          {menu.pdfUrl && (
            <div className="mt-4 mb-6">
              <a
                href={menu.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
              >
                Download PDF →
              </a>
            </div>
          )}

          {/* Menu sections */}
          {hasItems && (
            <div className="mt-4">
              {menu.sections
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((section) => (
                  <MenuSectionComponent key={section.id} section={section} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function MenusAccordion({ menus }: { menus: Menu[] }) {
  // Start with the first menu open
  const [openMenuId, setOpenMenuId] = useState<string | null>(menus[0]?.id ?? null)

  const handleToggle = (menuId: string) => {
    setOpenMenuId(openMenuId === menuId ? null : menuId)
  }

  return (
    <div className="space-y-4">
      {menus.map((menu) => (
        <MenuAccordionItem
          key={menu.id}
          menu={menu}
          isOpen={openMenuId === menu.id}
          onToggle={() => handleToggle(menu.id)}
        />
      ))}
    </div>
  )
}
