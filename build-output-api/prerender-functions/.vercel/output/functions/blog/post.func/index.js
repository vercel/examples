const { parse } = require('querystring')

// Here is our imaginary CMS "data source". In this case it's just inlined in the
// Serverless Function code, but in a real-world scenario this function would
// probably invoke a request to a database or real CMS to retrieve this information.
const posts = [
  { slug: 'three', contents: 'Three ⚽⚽⚽️' },
  { slug: 'four', contents: 'Four ⚾⚾⚾⚾️' },
  { slug: 'five', contents: 'Five 🏀🏀🏀🏀🏀' },
]

module.exports = (req, res) => {
  const matches = parse(req.headers['x-now-route-matches'])
  const { slug } = matches
  const post = posts.find((post) => post.slug === slug)

  const body = []
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (post) {
    body.push(`<h1>${slug}</h1><p>${post.contents}</p>`)
  } else {
    res.statusCode = 404
    body.push(
      `<strong>404:</strong> Sorry! No blog post exists with this name…`
    )
  }

  body.push(`<em>This page was rendered at: ${new Date()}</em>`)

  res.end(body.join('<br /><br />'))
}
