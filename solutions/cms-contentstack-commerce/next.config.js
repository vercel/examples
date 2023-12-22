/** @type {import('next').NextConfig} */
module.exports = {
  i18n: {
    locales: ['en-US', 'es'],
    defaultLocale: 'en-US',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
        port: '',
      },
    ],
  },
}
