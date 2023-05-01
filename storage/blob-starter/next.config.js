/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['public.blob.vercel-storage.com'],
  },
}

module.exports = nextConfig
