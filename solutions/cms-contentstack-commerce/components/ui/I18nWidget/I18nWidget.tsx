import Link from 'next/link'
import { FC, useState } from 'react'
import { useRouter } from 'next/router'
import { Cross } from '@components/icons'

interface LOCALE_DATA {
  name: string
  img: {
    filename: string
    alt: string
  }
}

const LOCALES_MAP: Record<string, LOCALE_DATA> = {
  es: {
    name: 'Español',
    img: {
      filename: 'flag-es-co.svg',
      alt: 'Bandera Colombiana',
    },
  },
  'en-US': {
    name: 'English',
    img: {
      filename: 'flag-en-us.svg',
      alt: 'US Flag',
    },
  },
}

const I18nWidget: FC = () => {
  const [display, setDisplay] = useState(false)
  const {
    locale,
    locales,
    defaultLocale = 'en-US',
    asPath: currentPath,
  } = useRouter()
  const options = locales?.filter((val) => val !== locale)
  const currentLocale = locale || defaultLocale

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
          src={`/${LOCALES_MAP[currentLocale].img.filename}`}
          alt={LOCALES_MAP[currentLocale].img.alt}
        />
        {options && (
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
        )}
      </div>
      <div className="absolute top-0 right-0">
        {options?.length && display ? (
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
              {options.map((locale) => (
                <li key={locale}>
                  <Link
                    href={currentPath}
                    locale={locale}
                    className="flex cursor-pointer px-6 py-3 flex transition ease-in-out duration-150 text-black leading-6 font-medium items-center capitalize hover:bg-accents-1"
                    onClick={() => setDisplay(false)}
                  >
                    {LOCALES_MAP[locale].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </nav>
  )
}

export default I18nWidget
