module.exports = (req, res) => {
  // Expire the `__prerender_bypass` cookie
  res.setHeader(
    'set-cookie',
    `__prerender_bypass=; Expires=${new Date(0).toUTCString()}`
  )

  // Redirect back to `/`
  res.statusCode = 307
  res.setHeader('location', '/')

  res.end()
}
