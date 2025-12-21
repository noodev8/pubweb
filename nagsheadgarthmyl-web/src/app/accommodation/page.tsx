import { getAccommodation } from '@/lib/services/venue'
import { Room } from '@/types'

function RoomCard({ room }: { room: Room }) {
  if (!room.isAvailable) return null

  return (
    <div className="bg-white shadow-sm overflow-hidden">
      {/* Room Image Placeholder */}
      <div className="bg-stone-200 aspect-[4/3] flex items-center justify-center">
        <span className="text-stone-400">{room.name} image</span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-serif text-stone-900 mb-2">{room.name}</h3>
        <p className="text-sm text-amber-600 mb-3 capitalize">
          {room.type} · Sleeps {room.sleeps}
        </p>
        <p className="text-stone-600 text-sm mb-4">{room.description}</p>

        {room.features.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {room.features.map((feature, index) => (
              <li
                key={index}
                className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded"
              >
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default async function AccommodationPage() {
  const accommodation = await getAccommodation()

  if (!accommodation) {
    return (
      <div className="py-24 text-center">
        <p className="text-stone-600">
          Accommodation information is currently unavailable.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-stone-800 text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif sm:text-5xl mb-4">
            Stay With Us
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto">
            Award-winning 5-star accommodation in the heart of the Welsh countryside.
          </p>
        </div>
      </section>

      {/* Awards */}
      {accommodation.awards && accommodation.awards.length > 0 && (
        <section className="bg-amber-50 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8">
              {accommodation.awards.map((award, index) => (
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

      {/* Introduction */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif text-stone-900 mb-6">
                Your Home Away From Home
              </h2>
              <p className="text-stone-600 mb-6">{accommodation.description}</p>

              {/* Features */}
              <ul className="grid grid-cols-2 gap-3 mb-8">
                {accommodation.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-stone-600">
                    <svg
                      className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0"
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
                    <span className="text-sm">{feature}</span>
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
            <div className="bg-stone-200 aspect-[4/3] flex items-center justify-center">
              <span className="text-stone-400">Accommodation image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="py-16 lg:py-24 bg-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-stone-900 mb-4">
              Our Rooms
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Each of our beautifully appointed bedrooms has been individually
              designed with Laura Ashley furnishings.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {accommodation.rooms
              .filter((room) => room.isAvailable)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-16 lg:py-24 bg-stone-800 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif mb-4">Ready to Book?</h2>
          <p className="text-stone-300 mb-8">
            Book directly through our online booking system for the best rates,
            or contact us for special requests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={accommodation.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
            >
              Book Online
            </a>
            {accommodation.bookingEmail && (
              <a
                href={`mailto:${accommodation.bookingEmail}`}
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-medium hover:bg-white hover:text-stone-900 transition-colors"
              >
                Email Us
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
