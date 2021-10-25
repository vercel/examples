const withTM = require('@vercel/edge-functions-ui/transpile')()
const { withConfigcat } = require('./scripts/configcat')

module.exports = withTM(withConfigcat())
