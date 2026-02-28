import Image from 'next/image'
import { GalleryGrid } from '@/components/gallery'
import { getVenueInfo, getGalleryImages } from '@/lib/services/venue'

const BATCH_SIZE = 12

export default async function GalleryPage() {
  const [venue, gallery] = await Promise.all([
    getVenueInfo(),
    getGalleryImages(BATCH_SIZE, 0),
  ])

  return (
    <div className="-mt-24 lg:-mt-28">
      {/* Hero */}
      <section className="relative bg-stone-900 text-white pt-24 lg:pt-28">
        <Image
          src="/images/hero-2.jpg"
          alt={`${venue.name} Gallery`}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/70" />

        <div className="relative py-10 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-2 sm:mb-4">Gallery</h1>
            <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto">
              Take a look around {venue.name}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-6 sm:py-12 lg:py-16 bg-stone-100">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <GalleryGrid
            initialImages={gallery.images}
            totalCount={gallery.totalCount}
            batchSize={BATCH_SIZE}
          />
        </div>
      </section>
    </div>
  )
}
