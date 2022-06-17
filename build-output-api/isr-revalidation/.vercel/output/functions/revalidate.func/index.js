const fetch = require('node-fetch')

// The bypass token can be a randomly generated string of at least 32 characters.
// This is meant to be *private* - DO NOT expose this value on the client-side.
const bypassToken = '87734ad8259d67c3c11747d3e4e112d0'

module.exports = (req, res) => {
  const proto = req.headers['x-forwarded-proto'];
  const host = req.headers.host;
  const deployedUrl = `${proto}://${host}`;

  fetch(deployedUrl, {
    headers: {
      'x-prerender-revalidate': bypassToken
    }
  }).then(() => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(`
<h1>Cache Revalidated!</h1>
<p>Redirecting you back.</p>
<meta http-equiv="refresh" content="2; url=${deployedUrl}">
`)
    
  }).catch((error) => {
    console.error(error.stack);
    res.statusCode = 500
    res.end()
  });
}