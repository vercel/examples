const withTM = require('@vercel/edge-functions-ui/transpile')()
const { withCountryInfo } = require('./scripts/countries')

module.exports = withTM(
  withCountryInfo({
    images: {
      domains: ['flagcdn.com'],
    },
  })
)
