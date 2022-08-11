const { parse } = require('querystring')

module.exports = (req, res) => {
  const matches = parse(req.headers['x-now-route-matches'])
  const { slug } = matches
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>My blog | ${slug}</title>
    </head>
    <body>
      <h1>Post: ${slug}</h1>
      
      <p>This demonstrates an SSG blog that restricts generating new paths via On-Demand revalidations instead of allowing any visited path to generate a new path.</p>
      
      <p>It works by leveraging the "routes" config to only route to the blog prerender when the proper revalidate token is provided.</p>
    </body>
    </html>
  `)
}
