const withTM = require('@vercel/examples-ui/transpile')()

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['xfnr2b9o4lok.usemoralis.com'],
  },
})
