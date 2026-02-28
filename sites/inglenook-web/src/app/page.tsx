import Link from 'next/link'
import Image from 'next/image'
import { HeroCarousel } from '@/components/home'
import { HexagonPattern } from '@/components/ui'
import { getVenueInfo } from '@/lib/services/venue'

export default async function HomePage() {
  const venue = await getVenueInfo()

  return (
    <div className="-mt-24 lg:-mt-28">
      {/* Hero Section - 16:9 with min-height for mobile */}
      <section className="relative bg-stone-900 text-white">
        <div className="relative aspect-[16/9] min-h-[400px] sm:min-h-[450px]">
          <HeroCarousel venueName={venue.name} />
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/60 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 pb-20 sm:pb-28 lg:pb-36">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white mb-4 drop-shadow-lg">
                  {venue.name},
                  <br />
                  {venue.address.town}
                </h1>
                <Link
                  href="/menus"
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
                >
                  <span className="border-b border-white/50 group-hover:border-white">View Our Menus</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-6">
              Good Food, Honest Prices, a Warm Welcome
            </h2>
            <p className="text-stone-600 text-lg mb-4">
              {venue.name} is a family-run cafe in the heart of {venue.address.town}, serving freshly
              prepared breakfasts, lunches and homemade cakes using locally sourced ingredients
              at prices that won&apos;t break the bank.
            </p>
            <p className="text-stone-600 text-lg mb-8">
              Whether you&apos;re popping in for a coffee, settling down for one of our famous
              all-day breakfasts, or treating yourself to something from our daily specials,
              you&apos;ll always find a friendly face and a cosy seat waiting for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 text-sm font-medium rounded-full">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
                Outdoor Seating
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 text-sm font-medium rounded-full">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
                </svg>
                Dine In
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 text-sm font-medium rounded-full">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Dog Friendly
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Section */}
      <section className="py-16 lg:py-24 bg-stone-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {/* Hexagon Pattern - behind image */}
              <HexagonPattern className="absolute -left-16 -bottom-16 w-64 h-64 opacity-60 hidden md:block" />
              <div className="relative aspect-[4/3] overflow-hidden z-10">
                <Image
                  src="/images/breakfast-1.jpg"
                  alt={`Freshly prepared breakfast at ${venue.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Hexagon Pattern - extends below */}
              <HexagonPattern className="absolute -right-8 -bottom-12 w-48 h-48 opacity-60 hidden md:block" />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-6">
                Breakfasts, Lunches &amp; Everything In Between
              </h2>
              <p className="text-stone-600 mb-4">
                Start your day with one of our famous all-day breakfasts — choose from
                Early Bird, Standard or go all out with the Mega. We also do a veggie
                option and our omelettes are not to be missed.
              </p>
              <p className="text-stone-600 mb-6">
                For lunch, tuck into a loaded jacket potato, a freshly made sandwich
                or one of our daily specials. And don&apos;t leave without trying a slice
                of our homemade cake.
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


      {/* Explore the Area Section */}
      <section className="py-16 lg:py-24 bg-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-4">
              Explore the Area
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              {venue.name} is right in the heart of {venue.address.town}, perfectly placed for exploring
              the stunning mid-Wales countryside, historic castles and beautiful lakes.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Attraction 1 - Powis Castle */}
            <div className="relative overflow-hidden group">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/attraction-1.jpg"
                  alt="Powis Castle with deer in foreground"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-serif mb-2">Powis Castle</h3>
                <p className="text-white/80 text-sm">
                  A medieval castle with stunning gardens, world-famous collections
                  and breathtaking views across the Welsh countryside.
                </p>
              </div>
            </div>

            {/* Attraction 2 - Lake Vyrnwy */}
            <div className="relative overflow-hidden group">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/attraction-2.jpg"
                  alt="Lake Vyrnwy surrounded by trees"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-serif mb-2">Lake Vyrnwy</h3>
                <p className="text-white/80 text-sm">
                  A beautiful reservoir set in the Berwyn Mountains, perfect for walking,
                  cycling, bird watching and water sports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Bar */}
      <section className="py-12 bg-stone-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-lg font-serif mb-1">Ready to visit?</p>
              <p className="text-stone-400">Call us on <a href="tel:01686640600" className="text-white hover:text-amber-400">01686 640 600</a></p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/menus"
                className="px-6 py-3 border border-white text-white font-medium hover:bg-white hover:text-stone-900 transition-colors"
              >
                View Menus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
