import { getRegularMenus, getVenueInfo } from '@/lib/services/venue'
import { MenuSelection } from './MenuSelection'

export default async function MenusPage() {
  const [menus, venue] = await Promise.all([
    getRegularMenus(),
    getVenueInfo(),
  ])

  return (
    <div className="-mt-24 lg:-mt-28">
      {/* Hero */}
      <section className="bg-stone-900 text-white pt-24 lg:pt-28">
        <div className="py-10 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-white/70 text-base sm:text-lg mb-2">Our Menus</p>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white mb-4 sm:mb-6">
                Good Food, Honest Prices
              </h1>
              <p className="text-white/80 text-sm sm:text-base">
                At {venue.name} everything is freshly prepared and cooked to order.
                From our famous all-day breakfasts to homemade cakes and daily specials,
                there&apos;s something for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Selection */}
      <section className="py-12 lg:py-16 bg-stone-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <MenuSelection menus={menus} />
        </div>
      </section>

      {/* Dietary Requirements */}
      <section className="py-8 sm:py-12 lg:py-16 bg-stone-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#7A1B1B] font-medium text-sm sm:text-base mb-2">Dietary Requirements</p>
          <p className="text-stone-600 text-sm sm:text-base mb-4 sm:mb-6">
            We cater for a variety of dietary requirements:
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-stone-700 text-sm font-medium shadow-sm border border-stone-200">
              Gluten Free
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-stone-700 text-sm font-medium shadow-sm border border-stone-200">
              Dairy Free
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-stone-700 text-sm font-medium shadow-sm border border-stone-200">
              Vegetarian
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-stone-700 text-sm font-medium shadow-sm border border-stone-200">
              Vegan
            </span>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm">
            If you have any allergies, please let us know in advance so we can make sure we have everything to cater for you.
          </p>
        </div>
      </section>
    </div>
  )
}
