import Link from 'next/link'
import { getVenueInfo, getAccommodation, getAttractions } from '@/lib/services/venue'

export default async function HomePage() {
  const [venue, accommodation, attractions] = await Promise.all([
    getVenueInfo(),
    getAccommodation(),
    getAttractions(),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-stone-800 text-white">
        {/* Placeholder for hero image */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 to-stone-900/80" />
        <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 lg:py-48">
          <div className="text-center">
            <p className="text-amber-500 text-sm uppercase tracking-widest mb-4">
              {venue.tagline}
            </p>
            <h1 className="text-4xl font-serif sm:text-5xl lg:text-6xl mb-6">
              {venue.name}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-stone-300 mb-8">
              {venue.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menus"
                className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
              >
                View Our Menus
              </Link>
              {accommodation?.bookingUrl && (
                <a
                  href={accommodation.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-medium hover:bg-white hover:text-stone-900 transition-colors"
                >
                  Book a Room
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif text-stone-900 mb-6">
                Welcome to {venue.name}
              </h2>
              <p className="text-stone-600 mb-4">
                Nestled in the heart of Garthmyl, Montgomery, we are a beautiful
                Grade 2 listed former coaching inn offering award-winning dining
                and luxury accommodation.
              </p>
              <p className="text-stone-600 mb-6">
                Our AA Rosette-awarded kitchen serves local, quality, homemade
                food, while our 5-star rated bedrooms provide the perfect base
                for exploring the stunning Welsh countryside.
              </p>
              <Link
                href="/restaurant"
                className="text-amber-600 font-medium hover:text-amber-700 transition-colors"
              >
                Discover our restaurant →
              </Link>
            </div>
            <div className="bg-stone-200 aspect-[4/3] flex items-center justify-center">
              <span className="text-stone-400">Restaurant image placeholder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Teaser */}
      {accommodation && (
        <section className="py-16 lg:py-24 bg-stone-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-stone-300 aspect-[4/3] flex items-center justify-center order-2 md:order-1">
                <span className="text-stone-500">Bedroom image placeholder</span>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-serif text-stone-900 mb-6">
                  Stay With Us
                </h2>
                <p className="text-stone-600 mb-4">{accommodation.description}</p>
                <ul className="mb-6 space-y-2">
                  {accommodation.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center text-stone-600">
                      <svg
                        className="h-5 w-5 text-amber-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={accommodation.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
                >
                  Check Availability
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Explore the Area */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-stone-900 mb-4">
              Explore the Area
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              The Nags Head is perfectly situated for exploring the stunning
              Welsh countryside and historic border towns.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {attractions.slice(0, 3).map((attraction) => (
              <div key={attraction.id} className="bg-white p-6 shadow-sm">
                <h3 className="text-xl font-serif text-stone-900 mb-2">
                  {attraction.name}
                </h3>
                {attraction.distance && (
                  <p className="text-sm text-amber-600 mb-3">
                    {attraction.distance}
                  </p>
                )}
                <p className="text-stone-600 text-sm">{attraction.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/explore"
              className="text-amber-600 font-medium hover:text-amber-700 transition-colors"
            >
              View all attractions →
            </Link>
          </div>
        </div>
      </section>

      {/* Awards Bar */}
      {venue.awards && venue.awards.length > 0 && (
        <section className="py-12 bg-stone-800 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
              {venue.awards.map((award, index) => (
                <div key={index} className="text-center">
                  <p className="text-amber-500 font-medium">{award.body}</p>
                  <p className="text-sm text-stone-300">{award.rating}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
