import Image from 'next/image'
import { GalleryGrid } from '@/components/gallery'
import { getVenueInfo, getGalleryImages } from '@/lib/services/venue'
import { siteConfig } from '@/lib/config'

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

      {/* Contact Bar */}
      <section className="py-8 sm:py-12 bg-stone-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-serif mb-1">Like what you see?</p>
              <p className="text-stone-400 text-sm sm:text-base">
                Book your stay or table with us
              </p>
            </div>
            <div className="flex w-full sm:w-auto gap-3 sm:gap-4">
              <a
                href="tel:01686640600"
                className="flex-1 sm:flex-none text-center px-4 sm:px-6 py-3 border border-white text-white font-medium hover:bg-white hover:text-stone-900 transition-colors text-sm sm:text-base"
              >
                Call Us
              </a>
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none text-center px-4 sm:px-6 py-3 bg-[#7A1B1B] text-white font-medium hover:bg-[#5C1414] transition-colors text-sm sm:text-base"
              >
                Book a Room
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
