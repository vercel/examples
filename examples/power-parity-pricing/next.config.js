const withTM = require('@vercel/edge-functions-ui/transpile')()

module.exports = withTM({
  images: {
    domains: ['lipis.github.io'],
  },
})
