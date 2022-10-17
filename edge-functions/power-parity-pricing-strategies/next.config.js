module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/edge',
        permanent: false,
      },
    ]
  },
}
