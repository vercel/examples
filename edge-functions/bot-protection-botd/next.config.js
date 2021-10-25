const withTM = require('next-transpile-modules')(
  ['@vercel/edge-functions-ui'],
  {
    resolveSymlinks: false,
  }
)

module.exports = withTM({
  typescript: {
    ignoreBuildErrors: true,
  },
})
