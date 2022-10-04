/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
    esmExternals: true,
  },
  swcMinify: true,
}

module.exports = nextConfig
