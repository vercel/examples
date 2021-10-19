import { NextFetchEvent, NextResponse } from 'next/server'

export function middleware(ev: NextFetchEvent) {
  ev.respondWith(handler(ev))
}

async function handler(ev: NextFetchEvent) {
  const { nextUrl: url, geo } = ev.request
  const country = geo.country?.replace('%20', ' ') || 'US'
  const city = geo.city?.replace('%20', ' ') || 'San Francisco'
  const region = geo.region?.replace('%20', ' ') || 'CA'

  const request = await fetch(
    `https://restcountries.eu/rest/v2/alpha/${country}`
  )

  const countryInfo = await request.json()
  const currency = countryInfo['currencies'][0]
  const languages = countryInfo.languages.map((l) => l.name).join(', ')

  url.searchParams.set('country', country)
  url.searchParams.set('city', city)
  url.searchParams.set('region', region)
  url.searchParams.set('currencyCode', currency.code)
  url.searchParams.set('currencySymbol', currency.symbol)
  url.searchParams.set('name', currency.name)
  url.searchParams.set('flag', currency.flag)
  url.searchParams.set('languages', languages)

  return NextResponse.rewrite(url)
}
