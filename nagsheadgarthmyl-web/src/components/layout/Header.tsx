import Link from 'next/link'
import { MobileMenu } from './MobileMenu'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Accommodation', href: '/accommodation' },
  { name: 'Restaurant', href: '/restaurant' },
  { name: 'Menus', href: '/menus' },
  { name: 'Explore', href: '/explore' },
  { name: 'Events', href: '/events' },
  { name: 'Contact', href: '/contact' },
]

interface HeaderProps {
  venueName: string
  bookingUrl?: string
}

export function Header({ venueName, bookingUrl }: HeaderProps) {
  return (
    <header className="bg-stone-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo / Venue Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-serif tracking-wide">
              {venueName}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-stone-300 hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Booking Button (Desktop) */}
          {bookingUrl && (
            <div className="hidden md:block">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-amber-600 text-sm font-medium text-amber-500 hover:bg-amber-600 hover:text-white transition-colors"
              >
                Book a Room
              </a>
            </div>
          )}

          {/* Mobile Menu */}
          <MobileMenu venueName={venueName} bookingUrl={bookingUrl} />
        </div>
      </div>
    </header>
  )
}
