/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'images.amazon.com',
        port: '',
      },
    ],
  },
}

export default nextConfig
