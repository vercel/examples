/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/vercel/examples/tree/main/solutions/alt-tag-generator",
        permanent: false,
      },
      {
        source: "/deploy",
        destination: "https://vercel.com/templates/next.js/ai-alt-text-generator",
        permanent: false,
      },   
    ]
  },
}

module.exports = nextConfig
