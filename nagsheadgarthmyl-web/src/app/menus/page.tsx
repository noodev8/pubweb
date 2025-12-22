import Image from 'next/image'
import { getRegularMenus } from '@/lib/services/venue'
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

function MenuCard({ menu }: { menu: Menu }) {
  return (
    <div className="bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-900 mb-2">{menu.name}</h2>
          {menu.description && (
            <p className="text-stone-600">{menu.description}</p>
          )}
          {menu.pdfUrl && (
            <div className="mt-4">
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
        </div>

        {/* Menu Image Thumbnail */}
        {menu.imageUrl && (
          <a
            href={menu.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 block group"
          >
            <Image
              src={menu.imageUrl}
              alt={`${menu.name} menu`}
              width={128}
              height={128}
              className="w-32 h-32 object-cover rounded-lg shadow-sm border border-stone-200 group-hover:shadow-md transition-shadow"
              unoptimized
            />
            <span className="text-xs text-stone-500 mt-1 block text-center group-hover:text-amber-600">
              View image
            </span>
          </a>
        )}
      </div>

      {/* Menu sections - only show if there are items */}
      {menu.sections.length > 0 && menu.sections.some(s => s.items.some(i => i.isAvailable)) && (
        <div>
          {menu.sections
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((section) => (
              <MenuSectionComponent key={section.id} section={section} />
            ))}
        </div>
      )}
    </div>
  )
}

export default async function MenusPage() {
  const menus = await getRegularMenus()

  return (
    <div>
      {/* Hero */}
      <section className="bg-stone-800 text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif sm:text-5xl mb-4">Our Menus</h1>
          <p className="text-stone-300 max-w-2xl mx-auto">
            Fresh, local, and homemade. Our AA Rosette-awarded kitchen takes
            pride in sourcing the finest ingredients from trusted Welsh suppliers.
          </p>
        </div>
      </section>

      {/* Dietary Key */}
      <section className="bg-stone-100 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="text-stone-600">
              <span className="font-medium">V</span> Vegetarian
            </span>
            <span className="text-stone-600">
              <span className="font-medium">VE</span> Vegan
            </span>
            <span className="text-stone-600">
              <span className="font-medium">GF</span> Gluten Free
            </span>
            <span className="text-stone-600">
              <span className="font-medium">DF</span> Dairy Free
            </span>
          </div>
        </div>
      </section>

      {/* Menus */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {menus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} />
            ))}
          </div>

          {menus.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-600">
                Menus are currently being updated. Please check back soon or
                contact us for details.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Note */}
      <section className="bg-stone-100 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-stone-600">
            Please inform us of any allergies or dietary requirements when booking.
            All prices include VAT. A discretionary 10% service charge may be added
            for parties of 6 or more.
          </p>
        </div>
      </section>
    </div>
  )
}
