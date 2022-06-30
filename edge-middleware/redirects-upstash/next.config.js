const withTM = require('@vercel/examples-ui/transpile')()
const { withUpstash } = require('./scripts/upstash')

module.exports = withTM(withUpstash())
