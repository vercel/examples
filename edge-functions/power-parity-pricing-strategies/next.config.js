const withTM = require('@vercel/examples-ui/transpile')()

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
