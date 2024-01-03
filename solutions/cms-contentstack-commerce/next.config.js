/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
        port: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/en-US',
      },
    ]
  },
}
