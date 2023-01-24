/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowMiddlewareResponseBody: true
  }
}

module.exports = nextConfig;
