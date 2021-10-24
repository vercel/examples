const withTM = require('@vercel/edge-functions-ui/transpile')()
const { withSplit } = require('./scripts/split')

module.exports = withTM(withSplit())
