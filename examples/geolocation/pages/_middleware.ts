import { NextFetchEvent, NextResponse } from 'next/server'

export function middleware(ev: NextFetchEvent) {
  ev.respondWith(handler(ev))
}

async function handler(ev: NextFetchEvent) {
  const { nextUrl: url, geo } = ev.request
  const country = geo.country?.replace('%20', ' ') || 'US'
  const city = geo.city?.replace('%20', ' ') || 'San Francisco'
  const region = geo.region?.replace('%20', ' ') || 'CA'

  const request = await fetch(`https://restcountries.com/v3.1/alpha/${country}`)
  const info = await request.json()

  const countryInfo = info[0]
  const currencyCode = Object.keys(countryInfo.currencies)[0]
  const currency = countryInfo.currencies[currencyCode]
  const languages = Object.values(countryInfo.languages).join(', ')

  url.searchParams.set('country', country)
  url.searchParams.set('city', city)
  url.searchParams.set('region', region)
  url.searchParams.set('currencyCode', currencyCode)
  url.searchParams.set('currencySymbol', currency.symbol)
  url.searchParams.set('name', currency.name)
  url.searchParams.set('flag', countryInfo.flags.png)
  url.searchParams.set('languages', languages)

  return NextResponse.rewrite(url)
}
