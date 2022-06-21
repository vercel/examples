module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  res.end(`
<h1>On-demand Incremental Static Regeneration (ISR) Example</h1>
<p>The "server time" below will only get updated after you click the Revalidate link.</p>
<p>Server time: ${new Date().toISOString()}</p>
<p><a href="/revalidate?authToken=a13f94f6-a441-47ca-95fc-9f44f3450295">Revalidate</a></p>
`)
}
