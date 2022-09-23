/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
    esmExternals: true,
  },
  swcMinify: true,
}

module.exports = nextConfig
