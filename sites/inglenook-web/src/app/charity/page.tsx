import Image from 'next/image'
import { getVenueInfo } from '@/lib/services/venue'

export default async function CharityPage() {
  const venue = await getVenueInfo()

  return (
    <div className="-mt-24 lg:-mt-28">
      {/* Hero */}
      <section className="bg-stone-900 text-white pt-24 lg:pt-28">
        <div className="py-10 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-white/70 text-base sm:text-lg mb-2">Giving Back</p>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white mb-4 sm:mb-6">
                Community &amp; Charity
              </h1>
              <p className="text-white/80 text-sm sm:text-base">
                Led by owner Corey Eadson, the {venue.name} team believe in giving back
                to the community. Throughout the year, they run a number of initiatives
                to support local families, young people, and those who serve our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Christmas Dinners */}
      <section className="py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-4">
                Free Christmas Dinners
              </h2>
              <p className="text-stone-600 mb-4">
                Christmas should be a time for everyone to enjoy a warm meal. The
                Inglenook team prepare and give away free fish and chip dinners to
                members of the community over the festive period.
              </p>
              <p className="text-stone-600">
                The team also deliver meals and gifts to local emergency services workers
                who spend their Christmas keeping us safe, making sure no one
                is forgotten during the holidays.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <Image
                  src="/images/charity-xmas-1.jpg"
                  alt="Stacks of fish and chip boxes prepared for free Christmas dinners"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <Image
                  src="/images/charity-xmas-2.jpg"
                  alt="Delivering free meals and gifts to local firefighters at Christmas"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kids Eat Free */}
      <section className="py-12 lg:py-20 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:order-first">
              <Image
                src="/images/Charity-2.jpg"
                alt="Children enjoying free meals during the summer holidays"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-4">
                Kids Eat Free &mdash; Summer Holidays
              </h2>
              <p className="text-stone-600 mb-4">
                The summer holidays can be a tough time for families, with children
                out of school and the cost of keeping them fed adding up. To help out,
                Corey and the team run a kids eat free initiative throughout the summer break.
              </p>
              <p className="text-stone-600">
                It&apos;s a simple idea with a big impact &mdash; making sure local children
                can enjoy a proper meal without putting extra pressure on families
                during the holidays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Youth Club */}
      <section className="py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-4">
                Youth Club Christmas Meals
              </h2>
              <p className="text-stone-600 mb-4">
                The Inglenook team are big supporters of the local youth club, providing free
                Christmas meals for the young people each year. It&apos;s a chance for
                the group to come together, enjoy a festive dinner, and celebrate
                the season.
              </p>
              <p className="text-stone-600">
                Supporting local youth is at the heart of what we do &mdash; the Inglenook
                is proud to play its part in bringing the community&apos;s young people together.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src="/images/Charity-3.jpg"
                  alt="Youth club members enjoying a free Christmas dinner at the Inglenook"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src="/images/Charity-1.jpg"
                  alt="The Inglenook team with members of the local youth club"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
