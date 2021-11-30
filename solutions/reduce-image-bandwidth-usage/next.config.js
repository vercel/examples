const withTM = require('@vercel/edge-functions-ui/transpile')()

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
})
