import Image from 'next/image'

export default function BuffetsPage() {
  return (
    <div className="-mt-24 lg:-mt-28">
      {/* Hero */}
      <section className="bg-stone-900 text-white pt-24 lg:pt-28">
        <div className="py-10 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-white/70 text-base sm:text-lg mb-2">Sister Company</p>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white mb-4 sm:mb-6">
                The Little Nook Buffet
              </h1>
              <p className="text-white/80 text-sm sm:text-base">
                From The Inglenook family comes The Little Nook Buffet &mdash; a dedicated
                buffet delivery service for all occasions. Whether it&apos;s a birthday,
                christening, funeral, work event, or just a get-together, Sharon and
                the team will put together something special for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Gallery */}
      <section className="py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-4">
              Fresh, Homemade &amp; Delivered
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Everything is freshly prepared and beautifully presented, ready
              to be delivered straight to your door. Choose from a range of
              platters and boxes to suit your event.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/images/buffet-1.jpg"
                alt="Afternoon tea box with scones, sandwiches, cupcakes, and fresh strawberries"
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                <p className="text-white font-serif text-lg">Afternoon Tea Boxes</p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/images/buffet-2.jpg"
                alt="Freshly made sandwich platters with a variety of fillings"
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                <p className="text-white font-serif text-lg">Sandwich Platters</p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/images/buffet-3.jpg"
                alt="Savoury platter with scotch eggs, sausage rolls, pork pies, and quiche"
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                <p className="text-white font-serif text-lg">Savoury Platters</p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/images/buffet-4.jpg"
                alt="Fresh fruit and vegetable platter with breadsticks and dips"
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                <p className="text-white font-serif text-lg">Fresh Fruit &amp; Veg</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch */}
      <section className="py-12 lg:py-20 bg-stone-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-stone-600 mb-8">
            To discuss your event, get a quote, or place an order, contact Sharon
            who manages all buffet enquiries. You can also find us on Facebook for
            the latest platters, offers, and availability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:07551428162"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              07551 428162
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61555788602413"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-800 text-white font-medium hover:bg-stone-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook Page
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
