/** @type {import('next').NextConfig} */
const withTM = require('@vercel/edge-functions-ui/transpile')()
const withOptimizely = require('./scripts/fetch_optimizely_datafiles');

module.exports = withTM(withOptimizely({
  reactStrictMode: true,
}))
