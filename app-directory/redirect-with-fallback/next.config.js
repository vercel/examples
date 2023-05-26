const redirects = require('./redirects').complexRedirects

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    appDir: true,
  },
  async redirects() {
    return redirects
  },
}
