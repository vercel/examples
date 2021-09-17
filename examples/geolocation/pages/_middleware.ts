import type { EdgeRequest, EdgeResponse, EdgeNext } from 'next'

export default async function (
  req: EdgeRequest,
  res: EdgeResponse,
  next: EdgeNext
) {
  const country = req.geo?.country?.replace('%20', ' ') || 'US'
  const city = req.geo?.city?.replace('%20', ' ') || 'San Francisco'
  const region = req.geo?.region?.replace('%20', ' ') || 'CA'

  const request = await fetch(
    `https://restcountries.eu/rest/v2/alpha/${country}`
  )

  const countryInfo = await request.json()
  const currency = countryInfo['currencies'][0]
  const languages = countryInfo.languages.map((l) => l.name).join(', ')

  res.rewrite({
    ...req.url,
    query: {
      ...req.url.query,
      country,
      city,
      region,
      currencyCode: currency.code,
      currencySymbol: currency.symbol,
      name: countryInfo.name,
      flag: countryInfo.flag,
      languages,
    },
  })
}
