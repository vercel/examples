import Link from 'next/link'
import { Logo, Menu, MapPin, Search, Bag, ChevronDown } from '../icons'
import { Container } from './container'
import { I18nWidget } from './i18n-widget'
import { UserNav } from './user-nav'

type Props = {
  data: {
    bannertext: string
    links: Array<Record<string, { url: string; title: string }>>
  }
}

const linkStyles =
  'inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-accents-6 text-black underline text-sm hover:text-accents-9 focus:outline-none focus:text-accents-8'

export const Navbar = ({ data }: Props) => (
  <div className="bg-white z-40 transition-all duration-150">
    <Container>
      <div className="flex items-center bg-slate-300 py-2 px-6">
        <div className="mr-2">
          <ChevronDown />
        </div>
        <span className="text-sm uppercase tracking-wider font-medium">
          {data.bannertext}
        </span>
      </div>
      <div className="flex justify-between items-center flex-row px-2 py-2 md:py-2 relative">
        <div className="flex flex-1 md:flex">
          <a className={linkStyles}>My Closet</a>
        </div>
        <div>
          <Link href="/" passHref legacyBehavior>
            <span className="cursor-pointer">
              <Logo />
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <nav className="space-x-4 ml-6 hidden lg:block">
            <Link href="/" className={linkStyles}>
              Sign In
            </Link>
            <Link href="/search?q=clothes" className={linkStyles}>
              Register
            </Link>
            <Link href="/search?q=accessories" className={linkStyles}>
              Find a Store
            </Link>
          </nav>
          <span className="ml-3">
            <I18nWidget />
          </span>
        </div>
      </div>
      <div className="border-t border-b bg-gray-200 grid grid-cols-4 text-center uppercase text-sm tracking-widest md:hidden divide-gray-400 divide-x">
        <div className="flex flex-col items-center py-3">
          <Menu width="18" />
          <span className="mt-1">Menu</span>
        </div>
        <div className="flex flex-col items-center py-3">
          <MapPin width="18" />
          <span className="mt-1">Stores</span>
        </div>
        <div className="flex flex-col items-center py-3">
          <Search width="18" />
          <span className="mt-1">Search</span>
        </div>
        <div className="flex flex-col items-center py-3">
          <Bag width="18" />
          <span className="mt-1">Bag</span>
        </div>
      </div>
    </Container>

    <div className=" border-b border-gray-300 px-4 md:py-4">
      <Container>
        <nav className="hidden lg:flex flex-row space-x-8 items-center justify-center">
          {data.links?.map(({ link }) => (
            <a
              className="cursor-pointer hover:text-gray-600 text-center text-sm uppercase font-medium tracking-widest"
              href={link.url}
              key={link.title}
            >
              {link.title}
            </a>
          ))}
          <div className="flex-1">
            <Link
              href="/"
              className="cursor-pointer hover:text-gray-600 uppercase font-medium text-sm"
            >
              Search
            </Link>
          </div>
          <UserNav />
        </nav>
      </Container>
    </div>
  </div>
)
