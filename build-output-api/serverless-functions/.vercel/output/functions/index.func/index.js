const cowsay = require('cowsay')

module.exports = (req, res) => {
  const { name = 'friend' } = req.query

  const text =
    `Howdy ${name}, from Vercel!\n` +
    `Node.js: ${process.version}\n` +
    `Request URL: ${req.url}\n` +
    `Server time: ${new Date().toISOString()})`
  const body = cowsay.say({ text })

  res.setHeader('Content-Type', 'text/plain')
  res.end(body)
}
