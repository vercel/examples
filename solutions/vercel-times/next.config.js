/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static01.nyt.com',
        port: '',
        pathname: '/images/20*/**',
      },
    ],
  },
};

module.exports = nextConfig;
