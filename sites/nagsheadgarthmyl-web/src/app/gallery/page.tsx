import Image from 'next/image'
import { GalleryGrid } from '@/components/gallery'
import { getVenueInfo, getGalleryImages } from '@/lib/services/venue'
import { siteConfig } from '@/lib/config'

export default async function GalleryPage() {
  const [venue, images] = await Promise.all([
    getVenueInfo(),
    getGalleryImages(),
  ])

  // Use first gallery image as hero background, or fallback
  const heroImage = images[0]?.src || '/images/restaurant.jpg'

  return (
    <div className="-mt-24 lg:-mt-28">
      {/* Hero */}
      <section className="relative bg-stone-900 text-white pt-24 lg:pt-28">
        <Image
          src={heroImage}
          alt={`${venue.name} Gallery`}
          fill
          priority
          className="object-cover"
          unoptimized={heroImage.includes('cloudinary')}
        />
        <div className="absolute inset-0 bg-stone-900/70" />

        <div className="relative py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-serif sm:text-5xl mb-4">Gallery</h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Take a look around {venue.name}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 lg:py-16 bg-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GalleryGrid images={images} />
        </div>
      </section>

      {/* Contact Bar */}
      <section className="py-12 bg-stone-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-lg font-serif mb-1">Like what you see?</p>
              <p className="text-stone-400">
                Book your stay or table with us
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:01686640600"
                className="px-6 py-3 border border-white text-white font-medium hover:bg-white hover:text-stone-900 transition-colors"
              >
                Call Us
              </a>
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#7A1B1B] text-white font-medium hover:bg-[#5C1414] transition-colors"
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
