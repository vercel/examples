/** @type {import('next').NextConfig} */
const withTM = require('@vercel/examples-ui/transpile')()
const withOptimizely = require('./scripts/fetch_optimizely_datafile')

module.exports = withTM(
  withOptimizely({
    reactStrictMode: true,
  })
)
