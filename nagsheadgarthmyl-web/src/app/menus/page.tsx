import { getRegularMenus } from '@/lib/services/venue'
import { MenusAccordion } from './MenusAccordion'

export default async function MenusPage() {
  const menus = await getRegularMenus()

  return (
    <div>
      {/* Hero */}
      <section className="bg-stone-800 text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif sm:text-5xl mb-4">Our Menus</h1>
          <p className="text-stone-300 max-w-2xl mx-auto">
            Fresh, local, and homemade. Our AA Rosette-awarded kitchen takes
            pride in sourcing the finest ingredients from trusted Welsh suppliers.
          </p>
        </div>
      </section>

      {/* Dietary Key */}
      <section className="bg-stone-100 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="text-stone-600">
              <span className="font-medium">V</span> Vegetarian
            </span>
            <span className="text-stone-600">
              <span className="font-medium">VE</span> Vegan
            </span>
            <span className="text-stone-600">
              <span className="font-medium">GF</span> Gluten Free
            </span>
            <span className="text-stone-600">
              <span className="font-medium">DF</span> Dairy Free
            </span>
          </div>
        </div>
      </section>

      {/* Menus */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {menus.length > 0 ? (
            <MenusAccordion menus={menus} />
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-600">
                Menus are currently being updated. Please check back soon or
                contact us for details.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Note */}
      <section className="bg-stone-100 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-stone-600">
            Please inform us of any allergies or dietary requirements when booking.
            All prices include VAT. A discretionary 10% service charge may be added
            for parties of 6 or more.
          </p>
        </div>
      </section>
    </div>
  )
}
