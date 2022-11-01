import cn from 'classnames'
import Link from 'next/link'
import s from './Navbar.module.css'
import Container from '@components/ui/Container'
import I18nWidget from '@components/ui/I18nWidget'
import Logo from '@components/ui/Logo'
import UserNav from '@components/ui/UserNav'
import { Menu, MapPin, Search, Bag, ChevronDown } from '@components/icons'

const Navbar: React.FC<{
  data: {
    bannerText: string
    links: Array<Record<string, Link>>
  }
}> = ({
  data = {
    bannerText: 'Sale | Up To 50% Off Select Full-priced Styles',
    links: [],
  },
}) => {
  return (
    <div className={cn(s.root)}>
      <Container>
        <div className="flex items-center bg-slate-300 py-2 px-6">
          <div className="mr-2">
            <ChevronDown />
          </div>
          <span className="text-sm uppercase tracking-wider font-medium">
            {data.bannerText}
          </span>
        </div>
        <div className="flex justify-between items-center flex-row px-2 py-2 md:py-2 relative">
          <div className="flex flex-1 md:flex">
            <a className={s.link}>My Closet</a>
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
              <Link href="/" className={s.link}>
                Sign In
              </Link>
              <Link href="/search?q=clothes" className={s.link}>
                Register
              </Link>
              <Link href="/search?q=accessories" className={s.link}>
                Find a Store
              </Link>
            </nav>
            <span className="ml-3">
              <I18nWidget />
            </span>
          </div>
        </div>
        <div className={cn(s.mobileNav, 'divide-gray-400 divide-x')}>
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
}

export default Navbar
