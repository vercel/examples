const redirects = require('./redirects').complexRedirects

/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return redirects
  },
}
