import Image from 'next/image'
import { getRegularMenus, getVenueInfo, getGalleryImages } from '@/lib/services/venue'
import { HexagonPattern } from '@/components/ui'
import { MenuSelection } from './MenuSelection'

export default async function MenusPage() {
  const [menus, venue, galleryImages] = await Promise.all([
    getRegularMenus(),
    getVenueInfo(),
    getGalleryImages(),
  ])

  // Get a food image from gallery if available, otherwise use restaurant image
  const foodImage = galleryImages.find(img =>
    img.alt?.toLowerCase().includes('food') ||
    img.caption?.toLowerCase().includes('food')
  )?.src || '/images/restaurant.jpg'

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

      {/* Food Philosophy Section */}
      <section className="py-16 lg:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <HexagonPattern className="absolute -left-16 -top-16 w-64 h-64 opacity-60 hidden lg:block" />
              <div className="relative aspect-[4/3] z-10">
                <Image
                  src={foodImage}
                  alt="Fresh local cuisine"
                  fill
                  className="object-cover"
                />
              </div>
              <HexagonPattern className="absolute -right-8 -bottom-12 w-48 h-48 opacity-60 hidden lg:block" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[#7A1B1B] text-lg mb-2">Our Philosophy</p>
              <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-6">
                The Best of Welsh Produce
              </h2>
              <p className="text-stone-600 mb-4">
                At {venue.name} we source fresh, local produce six days a week, always striving
                to provide the best quality our area has to offer. We prepare all of our dishes
                on the premises and even grow our own herbs in our sun trap patio.
              </p>
              <p className="text-stone-600">
                Our commitment to quality has earned us an AA Rosette for five consecutive years,
                recognising our dedication to exceptional food and service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Selection */}
      <section className="py-16 lg:py-24 bg-stone-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-4">
              Our Menus
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Click on a menu below to view. Our menus change seasonally to showcase
              the freshest ingredients available.
            </p>
          </div>

          <MenuSelection menus={menus} />
        </div>
      </section>

      {/* Sunday Lunch Highlight */}
      <section className="py-16 lg:py-20 bg-[#7A1B1B] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/80 text-lg mb-2">Don&apos;t forget about our beautiful</p>
          <h2 className="text-3xl lg:text-4xl font-serif mb-6">Sunday Lunch</h2>
          <p className="text-lg lg:text-xl mb-2">
            Served from 12pm every week, our beautiful Sunday Lunch is incredibly popular.
          </p>
          <p className="text-white/80">
            Book in advance to avoid disappointment!
          </p>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <Image
              src="/images/aa-1-rosette-2025.png"
              alt="AA 1 Rosette Award 2025"
              width={120}
              height={120}
              className="h-24 w-auto"
            />
            <div className="text-center md:text-left">
              <p className="text-stone-900 font-serif text-xl mb-1">AA Rosette Awarded</p>
              <p className="text-stone-600">
                Recognising culinary excellence for five consecutive years
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dietary Requirements */}
      <section className="py-12 lg:py-16 bg-stone-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#7A1B1B] font-medium mb-2">Dietary Requirements</p>
          <p className="text-stone-600 mb-6">
            We are happy to cater for a variety of dietary requirements:
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="px-4 py-2 bg-white text-stone-700 font-medium shadow-sm border border-stone-200">
              Gluten Free
            </span>
            <span className="px-4 py-2 bg-white text-stone-700 font-medium shadow-sm border border-stone-200">
              Dairy Free
            </span>
            <span className="px-4 py-2 bg-white text-stone-700 font-medium shadow-sm border border-stone-200">
              Vegetarian
            </span>
            <span className="px-4 py-2 bg-white text-stone-700 font-medium shadow-sm border border-stone-200">
              Vegan
            </span>
          </div>
          <p className="text-stone-500 text-sm">
            Please inform us of any allergies or dietary requirements when booking.
          </p>
        </div>
      </section>

      {/* Contact Bar */}
      <section className="py-12 bg-stone-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-lg font-serif mb-1">Ready to book a table?</p>
              <p className="text-stone-400">
                Call us on{' '}
                <a href="tel:01686640600" className="text-white hover:text-amber-400">
                  01686 640 600
                </a>
              </p>
            </div>
            <a
              href="tel:01686640600"
              className="px-6 py-3 bg-[#7A1B1B] text-white font-medium hover:bg-[#5C1414] transition-colors"
            >
              Book a Table
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
