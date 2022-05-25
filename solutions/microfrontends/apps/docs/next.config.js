const ntm = require('next-transpile-modules')

module.exports = ntm([
  '@vercel/examples-ui',
  '@acme/design-system',
  '@acme/pages',
])({
  basePath: '/docs',
})
