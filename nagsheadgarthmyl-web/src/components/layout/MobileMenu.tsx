'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Accommodation', href: '/accommodation' },
  { name: 'Restaurant', href: '/restaurant' },
  { name: 'Menus', href: '/menus' },
  { name: 'Explore', href: '/explore' },
  { name: 'Events', href: '/events' },
  { name: 'Contact', href: '/contact' },
]

interface MobileMenuProps {
  venueName: string
  bookingUrl?: string
}

export function MobileMenu({ venueName, bookingUrl }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Hamburger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-stone-300 hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-stone-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-700">
          <span className="text-lg font-serif text-white">{venueName}</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-stone-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded transition-colors ${
                      isActive
                        ? 'bg-stone-800 text-amber-500'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Booking Button */}
        {bookingUrl && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-700">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 text-center bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
            >
              Book a Room
            </a>
          </div>
        )}
      </div>
    </>
  )
}
