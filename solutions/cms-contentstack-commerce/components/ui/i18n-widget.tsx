'use client'

import { useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Cross } from '../icons'
import { LOCALES, Locales, localesData, parseLocale } from '@lib/i18n'

export const I18nWidget = () => {
  const params = useParams<{ lang: Locales }>()
  const pathname = usePathname() || '/'
  const [display, setDisplay] = useState(false)
  const lang = params?.lang

  if (!lang) {
    throw new Error('I18nWidget needs to be used in a page with a lang param')
  }

  const localeData = localesData[lang]
  const locales = LOCALES.filter((val) => val !== lang)

  return (
    <nav className="relative">
      <div className="flex items-center relative">
        <button
          className="h-10 px-2 rounded-md flex items-center justify-center focus:outline-none"
          aria-label="Language selector"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="block mr-2 w-5"
          src={`/${localeData.img.filename}`}
          alt={localeData.img.alt}
        />
        <span className="cursor-pointer" onClick={() => setDisplay(!display)}>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            shapeRendering="geometricPrecision"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
      <div className="absolute top-0 right-0">
        {display && (
          <div className="fixed right-0 top-10 mt-2 origin-top-right outline-none bg-white z-40 w-full h-full md:absolute md:border md:border-accents-1 md:shadow-lg md:w-56 md:h-auto">
            <div className="flex flex-row justify-end px-6">
              <button
                onClick={() => setDisplay(false)}
                aria-label="Close panel"
                className="transition ease-in-out duration-150 hover:text-gray-500 md:hidden"
              >
                <Cross className="h-6 w-6" />
              </button>
            </div>
            <ul>
              {locales.map((locale) => {
                const data = localesData[locale]
                const [, p] = parseLocale(pathname)

                return (
                  <li key={locale}>
                    <Link
                      href={data.root ? p : locale + p}
                      className="flex cursor-pointer px-6 py-3 transition ease-in-out duration-150 text-black leading-6 font-medium items-center capitalize hover:bg-accents-1"
                      onClick={() => setDisplay(false)}
                    >
                      {data.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
