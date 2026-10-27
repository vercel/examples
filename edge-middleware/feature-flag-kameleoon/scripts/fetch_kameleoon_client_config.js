const fs = require('fs')
const fetch = require('node-fetch')

const CLIENT_CONFIG_DIR = './lib/kameleoon'

async function fetchClientConfiguration() {
  const siteCode = process.env.KAMELEOON_SITE_CODE
  console.log(
    `Fetching Kameleoon client configuration for siteCode: ${siteCode}`
  )

  const response = await fetch(
    `https://client-config.kameleoon.com/mobile?siteCode=${siteCode}`
  )
  const responseJson = await response.text()
  if (!fs.existsSync(CLIENT_CONFIG_DIR)) {
    fs.mkdirSync(CLIENT_CONFIG_DIR, { recursive: true })
  }
  fs.writeFileSync(
    `${CLIENT_CONFIG_DIR}/client-configuration.json`,
    responseJson
  )
  console.log(`Kameleoon client configuration fetched successfully`)
}

function withKameleoon(nextConfig = {}) {
  return {
    ...nextConfig,
    rewrites: async () => {
      await fetchClientConfiguration()
      return nextConfig.rewrites ? nextConfig.rewrites() : {}
    },
  }
}

module.exports = withKameleoon
