import { FC } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { Github } from '@components/icons'
import Logo from '@components/ui/Logo'
import Container from '@components/ui/Container'
import I18nWidget from '@components/ui/I18nWidget'
import s from './Footer.module.css'

interface Props {
  className?: string
  children?: any
  pages?: Array<any>
}

const LEGAL_PAGES = ['terms-of-use', 'shipping-returns', 'privacy-policy']

const Footer: FC<Props> = ({ className, pages = [] }) => {
  return (
    <footer className={cn(className, 'border-gray-200 border-t px-6 md:px-2')}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-accents-2 py-12 text-black bg-white transition-colors duration-150">
          <div className="col-span-1 lg:col-span-2">
            <Link href="/">
              <a
                className="flex flex-initial items-center font-bold md:mr-24"
                aria-label="Logo"
              >
                <span className="mr-2">
                  <Logo width="100px" />
                </span>
              </a>
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <ul className="flex flex-initial flex-col md:flex-1">
              <li className="py-3 md:py-0 md:pb-4">
                <Link href="/">
                  <a className="text-black hover:text-accents-6 transition ease-in-out duration-150">
                    Home
                  </a>
                </Link>
              </li>
              <li className="py-3 md:py-0 md:pb-4">
                <Link href="/">
                  <a className="text-black hover:text-accents-6 transition ease-in-out duration-150">
                    Careers
                  </a>
                </Link>
              </li>
              <li className="py-3 md:py-0 md:pb-4">
                <Link href="/blog">
                  <a className="text-black hover:text-accents-6 transition ease-in-out duration-150">
                    Blog
                  </a>
                </Link>
              </li>
              {pages.map((page) => (
                <li key={page} className="py-3 md:py-0 md:pb-4">
                  <Link href={page}>
                    <a className="text-black hover:text-accents-6 transition ease-in-out duration-150">
                      {page}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <ul className="flex flex-initial flex-col md:flex-1">
              {LEGAL_PAGES.map((page) => (
                <li key={page.url} className="py-3 md:py-0 md:pb-4">
                  <Link href={page.url!}>
                    <a className="text-black hover:text-accents-6 transition ease-in-out duration-150">
                      {page.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 lg:col-span-6 flex items-start lg:justify-end text-black">
            <div className="flex space-x-6 items-center h-10">
              <a
                aria-label="Github Repository"
                href="https://github.com/vercel/commerce"
                className={s.link}
              >
                <Github />
              </a>
              <I18nWidget />
            </div>
          </div>
        </div>
        <div className="py-12 flex flex-col md:flex-row justify-between items-center space-y-4">
          <div>
            <span>&copy; 2020 ACME, Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center">
            <span className="text-black">Crafted by</span>
            <a href="https://vercel.com" aria-label="Vercel.com Link">
              <img
                src="/vercel.svg"
                alt="Vercel.com Logo"
                className="inline-block h-6 ml-4 text-black"
              />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
