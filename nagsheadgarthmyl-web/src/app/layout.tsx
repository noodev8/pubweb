import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import './globals.css'
import { Header, Footer } from '@/components/layout'
import { getVenueInfo, getOpeningHours, getAccommodation } from '@/lib/services/venue'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Nags Head Inn | Garthmyl, Montgomery',
  description:
    'A Grade 2 listed former coaching inn offering award-winning dining and luxury 5-star accommodation in the heart of the Welsh countryside.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [venue, hours, accommodation] = await Promise.all([
    getVenueInfo(),
    getOpeningHours(),
    getAccommodation(),
  ])

  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${sourceSans.variable} font-sans antialiased bg-stone-50 text-stone-900`}
      >
        <div className="flex min-h-screen flex-col">
          <Header
            venueName={venue.name}
            bookingUrl={accommodation?.bookingUrl}
          />
          <main className="flex-grow">{children}</main>
          <Footer venue={venue} hours={hours} />
        </div>
      </body>
    </html>
  )
}
