const ntm = require('next-transpile-modules')

const { DOCS_URL } = process.env

module.exports = ntm([
  '@vercel/examples-ui',
  '@company/design-system',
  '@company/pages',
])({
  async rewrites() {
    return [
      /**
       * Rewrites for Multi Zones
       */
      {
        source: '/docs',
        destination: `${DOCS_URL}/docs`,
      },
      {
        source: '/docs/:path*',
        destination: `${DOCS_URL}/docs/:path*`,
      },
    ]
  },
})
