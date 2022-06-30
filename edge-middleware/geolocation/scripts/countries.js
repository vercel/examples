const { join } = require('path')
const { writeFile } = require('fs/promises')

const JSON_URL =
  'https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json'

async function setupCountryInfo() {
  const req = await fetch(JSON_URL)
  const countriesData = await req.json()

  // grab only the country data we need
  const data = countriesData.map((x) => ({
    cca2: x.cca2,
    currencies: x.currencies,
    languages: x.languages,
  }))

  const filePath = join(process.cwd(), 'lib/countries.json')
  const content = JSON.stringify(data)

  await writeFile(filePath, content)
}

function withCountryInfo(nextConfig = {}) {
  const { rewrites } = nextConfig
  // Not really adding rewrites but using its async behavior to load the country data
  nextConfig.rewrites = async (...args) => {
    await setupCountryInfo()
    return rewrites?.(...args) ?? {}
  }

  return nextConfig
}

module.exports = { withCountryInfo, setupCountryInfo }
