import Image from 'next/image'
import { ExploreHeroCarousel } from '@/components/explore'
import { HexagonPattern } from '@/components/ui'

type Attraction = {
  name: string
  description: string
  url?: string
}

function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <div className="bg-white p-6 shadow-sm">
      <h3 className="text-xl font-serif text-stone-900 mb-3">{attraction.name}</h3>
      <p className="text-stone-600 text-sm mb-4">{attraction.description}</p>
      {attraction.url && (
        <a
          href={attraction.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-amber-700 hover:text-amber-800 transition-colors"
        >
          Visit website →
        </a>
      )}
    </div>
  )
}

const cyclingWalking: Attraction[] = [
  {
    name: 'The Montgomeryshire Canal',
    description: 'The scenic Montgomeryshire canal starts in Newtown and ends in Welshpool. Many people park at Berriew and walk either to Welshpool or Newtown taking in the beautiful scenery as they go. Alongside the beautiful canal is a flat towpath allowing for cyclists to enjoy as well.',
    url: 'https://canalrivertrust.org.uk/',
  },
  {
    name: 'Lake Vyrnwy, Llanfyllin',
    description: "Take a scenic walk or bike ride around Lake Vyrnwy and maybe end with a bite to eat or a coffee in the nearby hotel and café. The lake's length is 4.75 miles and the full walk around is around 12 miles. There are also shorter walks to key sights, including Pistyll Rhaeadr - the tallest waterfall in Wales.",
    url: 'https://lakevyrnwy.com/',
  },
  {
    name: "Rodney's Pillar",
    description: "Based near Welshpool with footpaths leading to the summit with wonderful views of Shropshire & Wales. Built in 1781–82 to commemorate the naval victories of Sir George Brydges Rodney during the American War of Independence. Two routes available - one more challenging than the other. Starting point: SY21 7DD.",
  },
]

const touristPoints: Attraction[] = [
  {
    name: 'Powis Castle',
    description: "Originally built in the 13th century, Powis Castle is known for its beautiful well-kept grounds. The Castle houses a popular museum dedicated to its history - learn about its past inhabitants from a Welsh Prince to Robert Clive to Lady Violet. A National Trust property, so bring your pass along.",
    url: 'https://nationaltrust.org.uk/powis-castle-and-garden',
  },
  {
    name: 'Montgomery Castle',
    description: "A stone masonry castle looking over the County of Montgomery in Powys. Many people park in Montgomery and walk to the castle. Be warned, it is very steep but well worth the view! Continue up to the monument above for even more expansive views of the local countryside.",
    url: 'https://castlewales.com/montgom.html',
  },
  {
    name: 'Glansevern Hall & Gardens',
    description: 'Glansevern Hall gardens offer over 25 acres of stunning grounds and exotic planting to enjoy. There is so much to explore in the gardens.',
    url: 'https://glansevern.co.uk/',
  },
  {
    name: 'Gregynog Hall, Tregynon',
    description: 'A historic house with grade 1 gardens, perfect for a relaxed day out. The beautiful grounds offer various levels of difficulty walks, with great places for a picnic.',
    url: 'https://gregynog.org/',
  },
]

const activities: Attraction[] = [
  {
    name: 'Lakeside Golf Course & Driving Range',
    description: 'Situated in the heart of Mid Wales between Welshpool and Newtown. Offers 18 and 9 hole courses plus lessons for any difficulty. Less than 5 minutes away - bring your clubs along for a wonderful afternoon out.',
    url: 'https://lakesidegolfcourse.co.uk/',
  },
  {
    name: 'Kerry Vale Vineyard',
    description: 'A vineyard in Mid Wales? Yes, really. A family run business offering wine tasting and tours opens your eyes to what beautiful wines can be made right on our doorstep.',
    url: 'https://kerryvalevineyard.co.uk/tours-tasting',
  },
  {
    name: 'Welshpool & Llanfair Light Railway',
    description: 'Built in 1903 to link farming communities with the market town of Welshpool. Today it is a 16 mile return journey by narrow gauge steam train through beautiful Mid Wales countryside. A wonderful day out for all the family.',
    url: 'https://wllr.org.uk/',
  },
]

const gardenCentres: Attraction[] = [
  {
    name: 'Kings Nurseries, Garthmyl',
    description: 'A hop, skip and a jump across the road from us. Specialist growers of seasonal bedding & basket plants, hanging baskets & perennials.',
    url: 'https://kingsnurseries.co.uk/',
  },
  {
    name: 'Coed-y-Dinas, Welshpool',
    description: 'Both a Country Store and a Garden & Home Centre with a vast array of products, from footwear and cooking utensils to plants and garden furniture.',
  },
]

export default function ExplorePage() {
  return (
    <div className="-mt-24 lg:-mt-28">
      {/* Hero - 16:9 with min-height for mobile */}
      <section className="relative bg-stone-900 text-white">
        <div className="relative aspect-[16/9] min-h-[400px] sm:min-h-[450px]">
          <ExploreHeroCarousel />
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/70 via-stone-900/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 pb-20 sm:pb-28 lg:pb-36">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl">
                <p className="text-white/80 text-lg sm:text-xl mb-2">Explore · Experience · Enjoy</p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white drop-shadow-lg">
                  Discover Mid Wales
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cycling & Walking */}
      <section className="py-16 lg:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-serif text-stone-900 mb-6">Cycling & Walking</h2>
              <div className="space-y-6">
                {cyclingWalking.map((item) => (
                  <AttractionCard key={item.name} attraction={item} />
                ))}
              </div>
            </div>
            <div className="relative">
              <HexagonPattern className="absolute -right-16 -top-16 w-64 h-64 opacity-60 hidden lg:block" />
              <div className="relative aspect-[4/3] z-10">
                <Image
                  src="/images/explore-cycling.jpg"
                  alt="Lake Vyrnwy Water Tower"
                  fill
                  className="object-cover"
                />
              </div>
              <HexagonPattern className="absolute -left-8 -bottom-12 w-48 h-48 opacity-60 hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Tourist Points */}
      <section className="py-16 lg:py-24 bg-stone-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative order-2 lg:order-1">
              <HexagonPattern className="absolute -left-16 -top-16 w-64 h-64 opacity-60 hidden lg:block" />
              <div className="relative aspect-[4/3] z-10">
                <Image
                  src="/images/attraction-1.jpg"
                  alt="Powis Castle with deer"
                  fill
                  className="object-cover"
                />
              </div>
              <HexagonPattern className="absolute -right-8 -bottom-12 w-48 h-48 opacity-60 hidden lg:block" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-serif text-stone-900 mb-6">Tourist Points</h2>
              <div className="space-y-6">
                {touristPoints.map((item) => (
                  <AttractionCard key={item.name} attraction={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-stone-900 mb-8 text-center">Activities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((item) => (
              <AttractionCard key={item.name} attraction={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Garden Centres */}
      <section className="py-16 lg:py-24 bg-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-stone-900 mb-8 text-center">Garden Centres</h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {gardenCentres.map((item) => (
              <AttractionCard key={item.name} attraction={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Getting Here */}
      <section className="py-16 bg-stone-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Getting Here</h2>
            <p className="text-stone-300 max-w-2xl mx-auto">
              The Nags Head is situated in the village of Garthmyl, just off the
              A483 between Welshpool and Newtown.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-stone-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="font-medium mb-2">By Car</h3>
              <p className="text-sm text-stone-400">Free on-site parking available</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-stone-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚂</span>
              </div>
              <h3 className="font-medium mb-2">By Train</h3>
              <p className="text-sm text-stone-400">Nearest station: Welshpool (8 miles)</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-stone-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚶</span>
              </div>
              <h3 className="font-medium mb-2">On Foot</h3>
              <p className="text-sm text-stone-400">Offa&apos;s Dyke Path runs nearby</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
