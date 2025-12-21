import Link from 'next/link'
import { getPageContent, getVenueInfo } from '@/lib/services/venue'

export default async function RestaurantPage() {
  const [content, venue] = await Promise.all([
    getPageContent('restaurant'),
    getVenueInfo(),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="bg-stone-800 text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif sm:text-5xl mb-4">
            {content?.title || 'Restaurant'}
          </h1>
          {content?.subtitle && (
            <p className="text-stone-300 max-w-2xl mx-auto">{content.subtitle}</p>
          )}
        </div>
      </section>

      {/* Awards Banner */}
      {venue.awards && venue.awards.length > 0 && (
        <section className="bg-amber-50 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8">
              {venue.awards
                .filter((a) => a.body === 'AA' && a.name === 'Rosette')
                .map((award, index) => (
                  <div key={index} className="text-center">
                    <span className="text-amber-700 font-medium">
                      {award.body} {award.rating}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Sections */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {content?.sections && content.sections.length > 0 ? (
            <div className="space-y-24">
              {content.sections
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((section, index) => (
                  <div
                    key={section.id}
                    className={`grid md:grid-cols-2 gap-12 items-center ${
                      section.layout === 'image-left' ? '' : ''
                    }`}
                  >
                    <div
                      className={
                        section.layout === 'image-left'
                          ? 'order-2'
                          : 'order-2 md:order-1'
                      }
                    >
                      {section.title && (
                        <h2 className="text-3xl font-serif text-stone-900 mb-6">
                          {section.title}
                        </h2>
                      )}
                      <p className="text-stone-600 mb-6">{section.content}</p>
                      {index === 0 && (
                        <Link
                          href="/menus"
                          className="text-amber-600 font-medium hover:text-amber-700 transition-colors"
                        >
                          View our menus →
                        </Link>
                      )}
                    </div>
                    <div
                      className={`bg-stone-200 aspect-[4/3] flex items-center justify-center ${
                        section.layout === 'image-left'
                          ? 'order-1'
                          : 'order-1 md:order-2'
                      }`}
                    >
                      <span className="text-stone-400">
                        {section.title || 'Restaurant'} image
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif text-stone-900 mb-6">
                  A Beautiful Setting
                </h2>
                <p className="text-stone-600 mb-4">
                  Our restaurant is a beautiful, light and airy room featuring
                  oak furnishings with doors leading out to the garden patio.
                  The perfect setting for a relaxed lunch or memorable evening
                  meal.
                </p>
                <p className="text-stone-600 mb-6">
                  We take pride in sourcing the finest local ingredients from
                  trusted Welsh suppliers. Our AA Rosette-awarded kitchen
                  creates dishes that celebrate the best of the region.
                </p>
                <Link
                  href="/menus"
                  className="text-amber-600 font-medium hover:text-amber-700 transition-colors"
                >
                  View our menus →
                </Link>
              </div>
              <div className="bg-stone-200 aspect-[4/3] flex items-center justify-center">
                <span className="text-stone-400">Restaurant image</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-16 lg:py-24 bg-stone-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif text-stone-900 mb-6">
            Local, Quality, Homemade
          </h2>
          <p className="text-stone-600 mb-8">
            From Welsh lamb and beef to fresh seasonal vegetables from nearby
            farms, we believe in letting quality ingredients speak for
            themselves. Our dishes are prepared with care and served with pride.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌾</span>
              </div>
              <h3 className="font-medium text-stone-900 mb-2">Locally Sourced</h3>
              <p className="text-sm text-stone-600">
                Ingredients from trusted Welsh suppliers
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍🍳</span>
              </div>
              <h3 className="font-medium text-stone-900 mb-2">Homemade</h3>
              <p className="text-sm text-stone-600">
                Prepared fresh in our award-winning kitchen
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-medium text-stone-900 mb-2">Award-Winning</h3>
              <p className="text-sm text-stone-600">
                AA Rosette for culinary excellence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif text-stone-900 mb-4">
            Join Us for a Meal
          </h2>
          <p className="text-stone-600 mb-8">
            We recommend booking in advance, especially for weekends and special
            occasions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menus"
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
            >
              View Menus
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 transition-colors"
            >
              Make a Reservation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
