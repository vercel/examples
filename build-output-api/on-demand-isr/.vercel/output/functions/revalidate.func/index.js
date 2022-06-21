const https = require('https')

// The bypass token should be a build-time randomly generated string of at least 32 characters.
// This value should only be exposed in the function config and inside of the function itself.
// DO NOT expose this value on the client-side: a malicious user could trigger boundless revalidations.
const bypassToken = '87734ad8259d67c3c11747d3e4e112d0'

// This authToken is a trivial example of authentication, but any strong authentication method will work.
// DO NOT allow unauthenticated users to trigger revalidation: a malicious user could trigger boundless revalidations.
const authToken = 'a13f94f6-a441-47ca-95fc-9f44f3450295';

module.exports = (req, res) => {
  const params = new URLSearchParams(req.query);
  if (authToken !== params.get('authToken')) {
    res.statusCode = 403
    res.end('Not Authorized')
  }

  const host = req.headers.host
  const deployedUrl = `https://${host}`

  const options = {
    hostname: host,
    port: 443,
    path: '/',
    method: 'GET', // MUST be "GET"; a "HEAD" or "POST" request will not work
    headers: {
      'x-prerender-revalidate': bypassToken
    }
  }
  const revalidateRequest = https.request(options, revalidateResponse => {
    res.setHeader('Content-Type', 'text/html charset=utf-8')

    if (revalidateResponse.headers['x-vercel-cache'] !== 'REVALIDATED') {
      res.statusCode = 500
      res.end(`
        <h1>Cache NOT Revalidated!</h1>
        <p>Failed to revalidate. The \`x-vercel-cache\` header was not set to \`REVALIDATED\`.</p>
      `)
    }

    res.end(`
      <h1>Cache Revalidated!</h1>
      <p>Redirecting you back.</p>
      <meta http-equiv="refresh" content="2 url=${deployedUrl}">
    `)
  })

  revalidateRequest.on('error', error => {
    console.error(error.stack)
    res.statusCode = 500
    res.end()
  })

  revalidateRequest.end()
}