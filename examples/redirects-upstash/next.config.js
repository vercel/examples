const withTM = require('@vercel/edge-functions-ui/transpile')()
const { withUpstash } = require('./scripts/upstash')

module.exports = withTM(withUpstash())
