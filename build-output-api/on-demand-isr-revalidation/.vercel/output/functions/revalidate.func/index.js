const https = require('https');

// The bypass token should be a build-time randomly generated string of at least 32 characters.
// This value should only be exposed in the function config and inside of the function itself.
// DO NOT expose this value on the client-side or a malicious user could trigger boundless revalidations
const bypassToken = '87734ad8259d67c3c11747d3e4e112d0'

module.exports = (req, res) => {
  const host = req.headers.host;
  const deployedUrl = `${proto}://${host}`;

  const options = {
    hostname: host,
    port: 443,
    path: '/',
    method: 'GET', // MUST be "GET"; a "HEAD" request will not work
    headers: {
      'x-prerender-revalidate': bypassToken
    }
  };
  const revalidateRequest = https.request(options, revalidateResponse => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(`
<h1>Cache Revalidated!</h1>
<p>Redirecting you back.</p>
<meta http-equiv="refresh" content="2; url=${deployedUrl}">
`)
  });
  
  revalidateRequest.on('error', error => {
    console.error(error.stack);
    res.statusCode = 500
    res.end()
  });

  revalidateRequest.end();
}