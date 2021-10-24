const withTM = require('@vercel/edge-functions-ui/transpile')()

module.exports = withTM({
  async redirects() {
    return [
      {
        source: '/',
        destination: '/edge',
        permanent: false,
      },
    ]
  },
})
