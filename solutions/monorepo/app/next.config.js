const ntm = require('next-transpile-modules')

module.exports = ntm(
  ['@vercel/edge-functions-ui', '@company/ui', '@company/utils'],
  { resolveSymlinks: false }
)
