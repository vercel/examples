const withTM = require('next-transpile-modules')(['@edge-functions/ui'], {
  resolveSymlinks: false,
})

module.exports = withTM({
  images: {
    domains: ['lipis.github.io'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/edge',
        permanent: true,
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
})
