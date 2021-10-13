const withTM = require('next-transpile-modules')(['@edge-functions/ui'], {
  resolveSymlinks: false,
})

module.exports = withTM({
  typescript: {
    ignoreBuildErrors: true,
  },
})
