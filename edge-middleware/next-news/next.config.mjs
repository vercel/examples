export default {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/news/1',
      },
    ]
  },
}
