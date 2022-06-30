const withTM = require('@vercel/examples-ui/transpile')()
const { withSplit } = require('./scripts/split')

module.exports = withTM(withSplit())
