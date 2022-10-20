const { withCountryInfo } = require('./scripts/countries')

module.exports = withCountryInfo({
  images: {
    domains: ['flagcdn.com'],
  },
})
