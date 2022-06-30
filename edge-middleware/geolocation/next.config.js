const withTM = require('@vercel/examples-ui/transpile')()
const { withCountryInfo } = require('./scripts/countries')

module.exports = withTM(
  withCountryInfo({
    images: {
      domains: ['flagcdn.com'],
    },
  })
)
