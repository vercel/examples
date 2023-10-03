/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flag.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
    ]
  },
}
