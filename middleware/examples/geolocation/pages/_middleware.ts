import { NextFetchEvent, NextResponse } from 'next/server'
import countries from '../lib/countries.json'

export function middleware(ev: NextFetchEvent) {
  ev.respondWith(handler(ev))
}

async function handler(ev: NextFetchEvent) {
  const { nextUrl: url, geo } = ev.request
  const country = geo.country?.replace('%20', ' ') || 'US'
  const city = geo.city?.replace('%20', ' ') || 'San Francisco'
  const region = geo.region?.replace('%20', ' ') || 'CA'

  const countryInfo = countries.find(x => x.cca2 === country )

  const currencyCode = Object.keys(countryInfo.currencies)[0]
  const currency = countryInfo.currencies[currencyCode]
  const languages = Object.values(countryInfo.languages).join(', ')

  url.searchParams.set('country', country)
  url.searchParams.set('city', city)
  url.searchParams.set('region', region)
  url.searchParams.set('currencyCode', currencyCode)
  url.searchParams.set('currencySymbol', currency.symbol)
  url.searchParams.set('name', currency.name)
  url.searchParams.set('languages', languages)

  return NextResponse.rewrite(url)
}
