import Image from 'next/image'
import Link from 'next/link'
import { AccommodationHeroCarousel } from '@/components/accommodation'
import { HexagonPattern } from '@/components/ui'
import { getVenueInfo } from '@/lib/services/venue'

export default async function AccommodationPage() {
  const venue = await getVenueInfo()

  return (
    <div className="-mt-24 lg:-mt-28">
      {/* Hero - 16:9 with min-height for mobile */}
      <section className="relative bg-stone-900 text-white">
        <div className="relative aspect-[16/9] min-h-[400px] sm:min-h-[450px]">
          <AccommodationHeroCarousel venueName={venue.name} />
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/70 via-stone-900/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 pb-20 sm:pb-28 lg:pb-36">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl">
                <p className="text-white/80 text-lg sm:text-xl mb-2">Stay With Us</p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white drop-shadow-lg">
                  5★ Quality & Comfort
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-stone-600 text-lg mb-6">
              Once a coaching inn, our Grade II listed building has been brought up to date,
              now offering five star accommodation. Our pet-friendly Inn has been awarded
              five stars from both the AA & Visit Wales every year since 2016.
            </p>
            <p className="text-stone-600 text-lg mb-6">
              At {venue.name} you will find eight ensuite bedrooms. Several of which
              were designed previously by the world renowned Laura Ashley&apos;s furnishings.
              With superking beds and large walk-in showers you get to enjoy both comfort
              and luxury during your stay.
            </p>
            <p className="text-stone-600 text-lg mb-6">
              A warm welcome is assured from our friendly team here. With log burners in
              the winter and a sun-soaked terrace for alfresco dining in the warmer weather,
              we are a great destination any time of year!
            </p>
            <p className="text-stone-600 text-lg">
              During your stay with us be sure not to miss out on lunch or dinner at our
              award winning restaurant. See our{' '}
              <Link href="/restaurant" className="text-[#7A1B1B] hover:text-[#5C1414]">
                restaurant section
              </Link>{' '}
              for more information.
            </p>
          </div>
        </div>
      </section>

      {/* AA Inspector Quote */}
      <section className="py-12 bg-stone-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl lg:text-3xl font-serif text-stone-800 italic">
            &ldquo;Welsh village inn offering quality cuisine using the local larder&rdquo;
          </blockquote>
          <p className="mt-4 text-stone-600">— AA Inspector</p>
        </div>
      </section>

      {/* Call to Book */}
      <section className="py-16 lg:py-20 bg-[#7A1B1B] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg lg:text-xl">
            Call us on{' '}
            <a href="tel:01686640600" className="font-medium hover:text-amber-300 transition-colors">
              01686 640 600
            </a>{' '}
            to book your Mid Wales break and get the chance to indulge in our beautiful
            food offerings after a full day exploring the wonderful local area.
          </p>
        </div>
      </section>

      {/* Weddings Section */}
      <section className="py-16 lg:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-6">Weddings</h2>
              <p className="text-stone-600 mb-4">
                Our Inn is perfectly situated surrounded by many beautiful wedding venues
                allowing great accessibility to these venues, such as Garthmyl Hall just
                over the hedge from us!
              </p>
              <p className="text-stone-600 mb-4">
                We are able to arrange bookings for large parties, early check in and late
                check outs. We are also happy to arrange additional guests to join you for
                breakfast.
              </p>
              <p className="text-stone-600">
                When you stay with us your key enables you to come and go as you please so
                that you can arrange for hairdressers/make up artists to join you at your
                leisure. Contact us directly and we are happy to help with your enquiries.
              </p>
            </div>
            <div className="relative">
              <HexagonPattern className="absolute -right-16 -top-16 w-64 h-64 opacity-60 hidden lg:block" />
              <div className="relative aspect-[4/3] z-10">
                <Image
                  src="/images/bedroom.jpg"
                  alt="Luxury bedroom perfect for wedding guests"
                  fill
                  className="object-cover"
                />
              </div>
              <HexagonPattern className="absolute -left-8 -bottom-12 w-48 h-48 opacity-60 hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Game Shooting Section */}
      <section className="py-16 lg:py-24 bg-stone-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <HexagonPattern className="absolute -left-16 -top-16 w-64 h-64 opacity-60 hidden lg:block" />
              <div className="relative aspect-[4/3] z-10">
                <Image
                  src="/images/attraction-1.jpg"
                  alt="Red Deer Stag in Front of Powis Castle"
                  fill
                  className="object-cover"
                />
              </div>
              <HexagonPattern className="absolute -right-8 -bottom-12 w-48 h-48 opacity-60 hidden lg:block" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-6">Game Shooting</h2>
              <p className="text-stone-600 mb-4">
                Our Inn is the perfect retreat after a cold day&apos;s shoot, warm by the fire
                with a glass of port, indulge in a home cooked award winning dinner — the
                options to round off a successful day are endless.
              </p>
              <ul className="text-stone-600 space-y-2 mb-4">
                <li>Bettws Hall & Vaynor Park — a stones throw away, just &lsquo;over the hill&rsquo;, a 10 minute drive</li>
                <li>Maesmawr Hall/Pool & Plas Dinam — only a 20 minute drive away</li>
                <li>Kempton (Shropshire) — around 25 minutes over the border</li>
                <li>Brigands — around 45 minutes north, half way towards the coast</li>
              </ul>
              <p className="text-stone-600">
                Please contact us directly if you&apos;d like to book accommodation and we will
                be happy to help you, including any early check ins required if you&apos;re
                travelling up before your day&apos;s shoot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Just a Getaway Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-6">
              Or Just a Getaway
            </h2>
            <p className="text-stone-600 text-lg mb-6">
              Located on the A483, {venue.name} is both easy to get to and your gateway
              to all of the unspoilt countryside Mid Wales has to offer. There are a number
              of wonderful activities right on our doorstep.
            </p>
            <p className="text-stone-600 text-lg mb-8">
              From the majestic Powis Castle, to the wondrous views surrounding Lake Vyrnwy,
              and the beautiful Montgomeryshire Canal running a mere 20 yards from our front
              door — you are sure to find plenty to do nearby.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center px-6 py-3 bg-[#7A1B1B] text-white font-medium hover:bg-[#5C1414] transition-colors"
            >
              Explore the Area
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 lg:py-24 bg-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-4">Amenities</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Here at {venue.name} we want to take all the stress out of travelling
              by making sure you have everything you need at your disposal.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                <svg className="w-5 h-5 text-[#7A1B1B]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
              </div>
              <p className="text-sm text-stone-700 font-medium">En-suite</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                <svg className="w-5 h-5 text-[#7A1B1B]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m18-8.25l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0L1.5 8.25" />
                </svg>
              </div>
              <p className="text-sm text-stone-700 font-medium">Tea & Coffee</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                <svg className="w-5 h-5 text-[#7A1B1B]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <p className="text-sm text-stone-700 font-medium">Toiletries</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                <svg className="w-5 h-5 text-[#7A1B1B]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <p className="text-sm text-stone-700 font-medium">Smart TV</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                <svg className="w-5 h-5 text-[#7A1B1B]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <p className="text-sm text-stone-700 font-medium">Hairdryer</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                <svg className="w-5 h-5 text-[#7A1B1B]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                </svg>
              </div>
              <p className="text-sm text-stone-700 font-medium">Iron</p>
            </div>
          </div>
          <p className="text-center text-stone-500 mt-8 text-sm">
            Add to that a wonderfully enthusiastic team ready to assist you in any way they can!
          </p>
        </div>
      </section>

      {/* Contact Bar */}
      <section className="py-12 bg-stone-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-lg font-serif mb-1">Ready to book your stay?</p>
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
              <Link
                href="/explore"
                className="px-6 py-3 bg-[#7A1B1B] text-white font-medium hover:bg-[#5C1414] transition-colors"
              >
                Explore the Area
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
