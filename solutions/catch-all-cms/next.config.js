const withTM = require('@vercel/examples-ui/transpile')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverComponents: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
  },
}

module.exports = withTM(nextConfig)
