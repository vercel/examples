const withTM = require('next-transpile-modules')(['@vercel/examples-ui'], {
  resolveSymlinks: false,
})

module.exports = withTM({
  typescript: {
    ignoreBuildErrors: true,
  },
})
