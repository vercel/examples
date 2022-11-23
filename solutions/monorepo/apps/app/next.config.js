/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    transpilePackages: ['@company/ui'],
  },
}

module.exports = nextConfig
