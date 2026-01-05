import Image from 'next/image'
import { getRegularMenus, getVenueInfo } from '@/lib/services/venue'
import { MenusAccordion } from './MenusAccordion'

export default async function MenusPage() {
  const [menus, venue] = await Promise.all([getRegularMenus(), getVenueInfo()])

  return (
    <div className="-mt-24 lg:-mt-28">
      {/* Hero - 16:9 with min-height for mobile */}
      <section className="relative bg-stone-900 text-white">
        <div className="relative aspect-[16/9] min-h-[400px] sm:min-h-[450px]">
          <Image
            src="/images/restaurant-header-1920x1080.jpg"
            alt={`${venue.name} Restaurant`}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/70 via-stone-900/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 pb-20 sm:pb-28 lg:pb-36">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl">
                <p className="text-white/80 text-lg sm:text-xl mb-2">Menus</p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white drop-shadow-lg">
                  Fresh, Local, Homemade
                </h1>
              </div>
            </div>
          </div>
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
          {menus.length > 0 ? (
            <MenusAccordion menus={menus} />
          ) : (
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
