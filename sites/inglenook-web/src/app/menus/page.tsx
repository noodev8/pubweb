import Image from 'next/image'
import { getRegularMenus, getVenueInfo } from '@/lib/services/venue'
import { HexagonPattern } from '@/components/ui'
import { MenuSelection } from './MenuSelection'

export default async function MenusPage() {
  const [menus, venue] = await Promise.all([
    getRegularMenus(),
    getVenueInfo(),
  ])

  return (
    <div className="-mt-24 lg:-mt-28">
      {/* Hero with Philosophy - Combined */}
      <section className="relative bg-stone-900 text-white pt-24 lg:pt-28">
        <Image
          src="/images/restaurant-header-1920x1080.jpg"
          alt={`${venue.name} Restaurant`}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/80" />

        <div className="relative py-10 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image - hidden on mobile for faster access to menus */}
              <div className="relative hidden sm:block lg:order-1 max-w-sm mx-auto lg:mx-0">
                <HexagonPattern className="absolute -left-8 -top-8 w-32 h-32 opacity-40 hidden lg:block" />
                <div className="relative aspect-[4/3] z-10">
                  <Image
                    src="/images/restaurant.jpg"
                    alt="Fresh local cuisine"
                    fill
                    className="object-cover"
                  />
                </div>
                <HexagonPattern className="absolute -right-6 -bottom-6 w-24 h-24 opacity-40 hidden lg:block" />
              </div>

              {/* Text */}
              <div className="lg:order-2">
                <p className="text-white/70 text-base sm:text-lg mb-2">Our Menus</p>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white mb-4 sm:mb-6">
                  Fresh, Local, Homemade
                </h1>
                <p className="text-white/80 text-sm sm:text-base mb-3 sm:mb-4">
                  At {venue.name} we source fresh, local produce six days a week, always striving
                  to provide the best quality our area has to offer.
                </p>
                <p className="text-white/70 text-xs sm:text-sm">
                  AA Rosette awarded for five consecutive years
                </p>
              </div>
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

      {/* Sunday Lunch Highlight */}
      <section className="py-10 sm:py-16 lg:py-20 bg-[#7A1B1B] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/80 text-base sm:text-lg mb-2">Don&apos;t forget about our beautiful</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-4 sm:mb-6">Sunday Lunch</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-2">
            Served from 12pm every week, our Sunday Lunch is incredibly popular.
          </p>
          <p className="text-white/80 text-sm sm:text-base">
            Book in advance to avoid disappointment!
          </p>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12">
            <Image
              src="/images/aa-1-rosette-2025.png"
              alt="AA 1 Rosette Award 2025"
              width={120}
              height={120}
              className="h-16 sm:h-24 w-auto"
            />
            <div className="text-center sm:text-left">
              <p className="text-stone-900 font-serif text-lg sm:text-xl mb-1">AA Rosette Awarded</p>
              <p className="text-stone-600 text-sm sm:text-base">
                Recognising culinary excellence for five consecutive years
              </p>
            </div>
          </div>
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
            Please inform us of any allergies when booking.
          </p>
        </div>
      </section>

      {/* Contact Bar */}
      <section className="py-8 sm:py-12 bg-stone-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-serif mb-1">Ready to book a table?</p>
              <p className="text-stone-400 text-sm sm:text-base">
                Call us on{' '}
                <a href="tel:01686640600" className="text-white hover:text-amber-400">
                  01686 640 600
                </a>
              </p>
            </div>
            <a
              href="tel:01686640600"
              className="w-full sm:w-auto text-center px-6 py-3 bg-[#7A1B1B] text-white font-medium hover:bg-[#5C1414] transition-colors"
            >
              Book a Table
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
