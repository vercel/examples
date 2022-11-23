/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    transpilePackages: ['@acme/ui'],
  },
}

module.exports = nextConfig
