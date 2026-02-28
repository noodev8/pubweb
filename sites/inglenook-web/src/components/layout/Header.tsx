import Link from 'next/link'
import Image from 'next/image'
import { MobileMenu } from './MobileMenu'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menus' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Buffets', href: '/buffets' },
  { name: 'Charity', href: '/charity' },
  { name: 'Contact', href: '/contact' },
]

interface HeaderProps {
  venueName: string
  transparent?: boolean
}

export function Header({ venueName, transparent = false }: HeaderProps) {
  return (
    <header className={`${transparent ? 'absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent' : 'bg-stone-900'} text-white`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-24 lg:h-28 items-center justify-between">
          {/* Logo - hidden on mobile to avoid overlapping hero text */}
          <div className="hidden md:block flex-shrink-0 mt-8">
            <Link href="/" className="block">
              <Image
                src="/images/Inglenook-logo.png"
                alt={venueName}
                width={100}
                height={100}
                className="md:w-32 md:h-32 lg:w-40 lg:h-40"
              />
            </Link>
          </div>

          {/* Desktop Navigation - absolutely centered */}
          <nav className="hidden lg:flex lg:space-x-6 absolute left-1/2 -translate-x-1/2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-semibold text-white [text-shadow:_0_1px_4px_rgba(0,0,0,0.9),_0_2px_8px_rgba(0,0,0,0.6)] hover:text-white/80 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu */}
          <div className="flex items-center">
            <MobileMenu venueName={venueName} />
          </div>
        </div>
      </div>
    </header>
  )
}
