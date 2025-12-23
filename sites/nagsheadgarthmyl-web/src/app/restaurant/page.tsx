import Image from 'next/image'
import Link from 'next/link'
import { HexagonPattern } from '@/components/ui'
import { siteConfig } from '@/lib/config'

export default function RestaurantPage() {
  return (
    <div className="-mt-24 lg:-mt-28">
      {/* Hero - 16:9 with min-height for mobile */}
      <section className="relative bg-stone-900 text-white">
        <div className="relative aspect-[16/9] min-h-[400px] sm:min-h-[450px]">
          <Image
            src="/images/restaurant-header-1920x1080.jpg"
            alt="The Nags Head Restaurant"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/70 via-stone-900/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 pb-20 sm:pb-28 lg:pb-36">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl">
                <p className="text-white/80 text-lg sm:text-xl mb-2">Restaurant</p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white drop-shadow-lg">
                  High Quality Homemade Food
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Description */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-stone-600 text-lg mb-6">
              The restaurant is a beautiful, light and airy room with an oak floor,
              full height ceiling and open beams. It is decorated with oak book shelves,
              holding many books, and real foliage planters. At the end of the restaurant,
              double doors lead you directly onto the patio where you can enjoy the sun
              and a beautiful terraced garden.
            </p>
            <p className="text-stone-600 text-lg">
              At The Nags Head Inn we try at all times to source the best local produce,
              fresh to us six days a week. We strive to always provide the best quality
              our area has to offer. Our 5★ awards and Rosette for our restaurant have
              been awarded to us for sourcing the best local produce, for preparing all
              of our dishes on the premises and even growing our own herbs in the sun trap patio.
            </p>
          </div>
        </div>
      </section>

      {/* Restaurant Images */}
      <section className="py-16 lg:py-24 bg-stone-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <HexagonPattern className="absolute -left-16 -top-16 w-64 h-64 opacity-60 hidden lg:block" />
              <div className="relative aspect-[4/3] z-10">
                <Image
                  src="/images/restaurant.jpg"
                  alt="The Nags Head restaurant interior"
                  fill
                  className="object-cover"
                />
              </div>
              <HexagonPattern className="absolute -right-8 -bottom-12 w-48 h-48 opacity-60 hidden lg:block" />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-6">
                A Beautiful Setting
              </h2>
              <p className="text-stone-600 mb-4">
                Our restaurant offers the perfect setting for a relaxed lunch or a
                memorable evening meal. The warm atmosphere, combined with attentive
                service, ensures every visit is special.
              </p>
              <p className="text-stone-600 mb-6">
                Whether you&apos;re celebrating a special occasion or simply enjoying
                a meal with friends and family, we look forward to welcoming you.
              </p>
              <Link
                href="/menus"
                className="inline-flex items-center px-6 py-3 bg-[#7A1B1B] text-white font-medium hover:bg-[#5C1414] transition-colors"
              >
                View Our Menus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Drink Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-1">
              <p className="text-[#7A1B1B] text-lg mb-2">Drink</p>
              <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-6">
                Sit Back and Unwind
              </h2>
              <p className="text-stone-600 mb-4">
                We always showcase beer from local breweries. Whether you&apos;re a fan
                of a golden ale, a stout, a mild or an IPA — we will have something for you!
              </p>
              <p className="text-stone-600 mb-4">
                Our wine list has been hand picked by experts from Tanners Shrewsbury
                to ensure there is something for everyone to enjoy.
              </p>
              <p className="text-stone-600 mb-4">
                We even do cocktails! Select from a choice of classic cocktails perfectly
                tailored to the season.
              </p>
              <p className="text-stone-600">
                We always welcome recommendations so please let us know what you would
                like to see behind our bar!
              </p>
            </div>
            <div className="relative order-2 lg:order-2">
              <HexagonPattern className="absolute -right-16 -top-16 w-64 h-64 opacity-60 hidden lg:block" />
              <div className="relative aspect-[4/3] z-10">
                <Image
                  src="/images/bar-seating-800x600.jpg"
                  alt="Bar seating at The Nags Head"
                  fill
                  className="object-cover"
                />
              </div>
              <HexagonPattern className="absolute -left-8 -bottom-12 w-48 h-48 opacity-60 hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Sunday Lunch */}
      <section className="py-16 lg:py-20 bg-[#7A1B1B] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/80 text-lg mb-2">Don&apos;t forget about our beautiful</p>
          <h2 className="text-3xl lg:text-4xl font-serif mb-6">Sunday Lunch</h2>
          <p className="text-lg lg:text-xl">
            Served from 12pm every week, our beautiful Sunday Lunch is incredibly popular.
            Book in advance to avoid disappointment!
          </p>
        </div>
      </section>

      {/* Dietary Requirements */}
      <section className="py-16 lg:py-20 bg-stone-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#7A1B1B] font-medium mb-2">Did you know?</p>
          <p className="text-stone-600 text-lg mb-6">
            We are able to cater for a variety of dietary requirements, including:
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <span className="px-4 py-2 bg-white text-stone-700 font-medium shadow-sm">Gluten Free</span>
            <span className="px-4 py-2 bg-white text-stone-700 font-medium shadow-sm">Dairy Free</span>
            <span className="px-4 py-2 bg-white text-stone-700 font-medium shadow-sm">Vegetarian</span>
            <span className="px-4 py-2 bg-white text-stone-700 font-medium shadow-sm">Vegan</span>
          </div>
          <p className="text-stone-500">
            Just speak to a member of staff before you order and we will be happy to help as much as possible.
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
            <div className="flex flex-wrap gap-4">
              <Link
                href="/menus"
                className="px-6 py-3 border border-white text-white font-medium hover:bg-white hover:text-stone-900 transition-colors"
              >
                View Menus
              </Link>
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#7A1B1B] text-white font-medium hover:bg-[#5C1414] transition-colors"
              >
                Stay With Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
