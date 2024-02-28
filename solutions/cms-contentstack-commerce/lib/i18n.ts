export const LOCALES = ['en-US', 'es'] as const

export type Locales = (typeof LOCALES)[number]

export interface Locale {
  readonly name: string
  readonly root?: boolean
  readonly img: {
    readonly filename: string
    readonly alt: string
  }
}

export const localesData: Record<Locales, Locale> = {
  es: {
    name: 'Español',
    img: {
      filename: 'flag-es-co.svg',
      alt: 'Bandera Colombiana',
    },
  },
  'en-US': {
    name: 'English',
    root: true,
    img: {
      filename: 'flag-en-us.svg',
      alt: 'US Flag',
    },
  },
}

/**
 * Parses the locale from the pathname and returns an array with the locale and the pathname
 * without the locale.
 */
export function parseLocale(pathname: string): [string, string] {
  const regex = new RegExp(`^/(${LOCALES.join('|')})/?(.*)`)
  const result = regex.exec(pathname)

  return result ? [result[1], `/${result[2]}`] : ['', pathname]
}
