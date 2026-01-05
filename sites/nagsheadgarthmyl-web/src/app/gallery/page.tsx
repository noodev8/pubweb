import { GalleryGrid } from '@/components/gallery'
import { getVenueInfo } from '@/lib/services/venue'

export default async function GalleryPage() {
  const venue = await getVenueInfo()

  return (
    <div>
      {/* Hero */}
      <section className="bg-stone-800 text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif sm:text-5xl mb-4">Gallery</h1>
          <p className="text-stone-300 max-w-2xl mx-auto">
            Take a look around {venue.name}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GalleryGrid />
        </div>
      </section>
    </div>
  )
}
