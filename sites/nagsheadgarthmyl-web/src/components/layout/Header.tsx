import Link from 'next/link'
import Image from 'next/image'
import { MobileMenu } from './MobileMenu'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Accommodation', href: '/accommodation' },
  { name: 'Restaurant', href: '/restaurant' },
  { name: 'Menus', href: '/menus' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Explore', href: '/explore' },
  { name: 'Contact', href: '/contact' },
]

interface HeaderProps {
  venueName: string
  bookingUrl?: string
  transparent?: boolean
}

export function Header({ venueName, bookingUrl, transparent = false }: HeaderProps) {
  return (
    <header className={`${transparent ? 'absolute top-0 left-0 right-0 z-50 bg-transparent' : 'bg-stone-900'} text-white`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 lg:h-28 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 mt-8">
            <Link href="/" className="block">
              <Image
                src="/images/logo.svg"
                alt={venueName}
                width={100}
                height={100}
                className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] hover:text-white/80 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Booking Button (Desktop) + Mobile Menu */}
          <div className="flex items-center gap-4">
            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-[#7A1B1B] text-sm font-medium text-white hover:bg-[#5C1414] transition-colors"
              >
                Stay With Us
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </a>
            )}
            <MobileMenu venueName={venueName} bookingUrl={bookingUrl} />
          </div>
        </div>
      </div>
    </header>
  )
}
