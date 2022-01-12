const withTM = require('@vercel/examples-ui/transpile')()
const { withConfigcat } = require('./scripts/configcat')

module.exports = withTM(withConfigcat())
