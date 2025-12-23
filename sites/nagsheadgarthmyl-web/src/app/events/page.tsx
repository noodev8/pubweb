import Link from 'next/link'
import { getEventMenus } from '@/lib/services/venue'
import { Menu, DietaryTag } from '@/types'

const dietaryLabels: Record<DietaryTag, string> = {
  vegetarian: 'V',
  vegan: 'VE',
  'gluten-free': 'GF',
  'dairy-free': 'DF',
  'nut-free': 'NF',
  'contains-nuts': 'N',
  spicy: '🌶',
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  if (start === end) {
    return startDate.toLocaleDateString('en-GB', options)
  }

  return `${startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} - ${endDate.toLocaleDateString('en-GB', options)}`
}

function EventMenuCard({ menu }: { menu: Menu }) {
  return (
    <div className="bg-white shadow-sm overflow-hidden">
      {/* Image Placeholder */}
      <div className="bg-stone-200 aspect-[2/1] flex items-center justify-center">
        <span className="text-stone-400">{menu.name} image</span>
      </div>

      <div className="p-6">
        {/* Date Badge */}
        {menu.eventDateRange && (
          <p className="text-sm text-amber-600 mb-2">
            {formatDateRange(menu.eventDateRange.start, menu.eventDateRange.end)}
          </p>
        )}

        <h2 className="text-2xl font-serif text-stone-900 mb-3">{menu.name}</h2>

        {menu.description && (
          <p className="text-stone-600 mb-4">{menu.description}</p>
        )}

        {/* Menu Preview */}
        {menu.sections.length > 0 && (
          <div className="border-t border-stone-200 pt-4 mt-4">
            {menu.sections
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((section) => (
                <div key={section.id} className="mb-4 last:mb-0">
                  <h3 className="font-medium text-stone-900 mb-2">
                    {section.name}
                  </h3>
                  {section.description && (
                    <p className="text-sm text-amber-600 mb-2">
                      {section.description}
                    </p>
                  )}
                  <ul className="space-y-2">
                    {section.items
                      .filter((item) => item.isAvailable)
                      .map((item) => (
                        <li key={item.id} className="text-sm text-stone-600">
                          <span className="font-medium text-stone-900">
                            {item.name}
                          </span>
                          {item.description && (
                            <span className="block text-stone-500">
                              {item.description}
                            </span>
                          )}
                          {item.dietaryTags && item.dietaryTags.length > 0 && (
                            <span className="inline-flex gap-1 ml-2">
                              {item.dietaryTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs text-amber-600"
                                >
                                  {dietaryLabels[tag]}
                                </span>
                              ))}
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-4 mt-6">
          {menu.pdfUrl && (
            <a
              href={menu.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
            >
              Download Menu (PDF) →
            </a>
          )}
          <Link
            href="/contact"
            className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
          >
            Book Now →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function EventsPage() {
  const events = await getEventMenus()

  return (
    <div>
      {/* Hero */}
      <section className="bg-stone-800 text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif sm:text-5xl mb-4">
            Special Events
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto">
            Join us for special occasions throughout the year with our specially
            crafted menus.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {events.length > 0 ? (
            <div className="space-y-8">
              {events.map((event) => (
                <EventMenuCard key={event.id} menu={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white shadow-sm">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h2 className="text-xl font-serif text-stone-900 mb-2">
                No Upcoming Events
              </h2>
              <p className="text-stone-600 mb-6 max-w-md mx-auto">
                We don&apos;t have any special events scheduled at the moment.
                Check back soon or follow us on social media for announcements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/menus"
                  className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
                >
                  View Regular Menus
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Private Events CTA */}
      <section className="py-16 lg:py-24 bg-stone-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif text-stone-900 mb-4">
            Planning a Special Occasion?
          </h2>
          <p className="text-stone-600 mb-8 max-w-2xl mx-auto">
            Whether it&apos;s a birthday celebration, anniversary dinner, or
            private gathering, we&apos;d love to help make your event special.
            Contact us to discuss your requirements.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}
