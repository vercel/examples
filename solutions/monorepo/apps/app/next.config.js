const withTM = require('next-transpile-modules')(['@company/ui'])

module.exports = withTM({
  reactStrictMode: true,
})
