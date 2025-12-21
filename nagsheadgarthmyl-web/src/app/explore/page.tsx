import { getAttractions, getPageContent } from '@/lib/services/venue'
import { Attraction, AttractionCategory } from '@/types'

const categoryLabels: Record<AttractionCategory, string> = {
  heritage: 'Heritage & History',
  nature: 'Nature & Outdoors',
  activities: 'Activities',
  dining: 'Food & Drink',
  shopping: 'Shopping',
  transport: 'Getting Around',
}

function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <div className="bg-white p-6 shadow-sm">
      {attraction.image ? (
        <div className="bg-stone-200 aspect-[3/2] mb-4 flex items-center justify-center">
          <span className="text-stone-400">{attraction.name} image</span>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="text-xl font-serif text-stone-900">{attraction.name}</h3>
        {attraction.distance && (
          <span className="text-sm text-amber-600 whitespace-nowrap">
            {attraction.distance}
          </span>
        )}
      </div>

      <p className="text-stone-600 text-sm mb-4">{attraction.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-400 uppercase tracking-wide">
          {categoryLabels[attraction.category]}
        </span>
        {attraction.websiteUrl && (
          <a
            href={attraction.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
          >
            Visit website →
          </a>
        )}
      </div>
    </div>
  )
}

export default async function ExplorePage() {
  const [attractions, content] = await Promise.all([
    getAttractions(),
    getPageContent('explore'),
  ])

  // Group attractions by category
  const groupedAttractions = attractions.reduce(
    (acc, attraction) => {
      const category = attraction.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(attraction)
      return acc
    },
    {} as Record<AttractionCategory, Attraction[]>
  )

  return (
    <div>
      {/* Hero */}
      <section className="bg-stone-800 text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif sm:text-5xl mb-4">
            {content?.title || 'Explore the Area'}
          </h1>
          {content?.subtitle && (
            <p className="text-stone-300 max-w-2xl mx-auto">{content.subtitle}</p>
          )}
        </div>
      </section>

      {/* Introduction */}
      {content?.sections && content.sections.length > 0 && (
        <section className="py-12 bg-stone-100">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            {content.sections
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((section) => (
                <p key={section.id} className="text-stone-600">
                  {section.content}
                </p>
              ))}
          </div>
        </section>
      )}

      {/* All Attractions */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Show all attractions in a grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {attractions.map((attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
          </div>

          {attractions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-600">
                Local attraction information coming soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16 bg-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-stone-900 mb-4">
              Getting Here
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              The Nags Head is situated in the village of Garthmyl, just off the
              A483 between Welshpool and Newtown.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="font-medium text-stone-900 mb-2">By Car</h3>
              <p className="text-sm text-stone-600">
                Free on-site parking available
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl">🚂</span>
              </div>
              <h3 className="font-medium text-stone-900 mb-2">By Train</h3>
              <p className="text-sm text-stone-600">
                Nearest station: Welshpool (8 miles)
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl">🚶</span>
              </div>
              <h3 className="font-medium text-stone-900 mb-2">On Foot</h3>
              <p className="text-sm text-stone-600">
                Offa&apos;s Dyke Path runs nearby
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
