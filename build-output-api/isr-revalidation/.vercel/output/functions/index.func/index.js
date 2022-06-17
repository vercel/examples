// The bypass token can be a randomly generated string of at least 32 characters.
// This is meant to be *private* - DO NOT expose this value on the client-side.
const bypassToken = '87734ad8259d67c3c11747d3e4e112d0'

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  res.end(`
<h1>On-demand Incremental Static Regeneration (ISR) Revalidation Example</h1>
<p>The "server time" below will only get updated after you click the Revalidate link.</p>
<p>Server time: ${new Date().toISOString()}</p>
<p><a href="/revalidate">Revalidate</a></p>
`)
}
