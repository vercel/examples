// The bypass token can be a randomly generated string of at least 32 characters.
// This is meant to be *private* - DO NOT expose this value on the client-side.
const bypassToken = '87734ad8259d67c3c11747d3e4e112d0'

const fiveMinutes = 1000 * 60 * 5

module.exports = (req, res) => {
  // Set the `__prerender_bypass` cookie
  const expires = new Date(Date.now() + fiveMinutes)
  res.setHeader(
    'set-cookie',
    `__prerender_bypass=${bypassToken}; Expires=${expires.toUTCString()}`
  )

  // Redirect back to `/`
  res.statusCode = 307
  res.setHeader('location', '/')

  res.end()
}
