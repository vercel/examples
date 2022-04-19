const cowsay = require('cowsay')

module.exports = (req, res) => {
  const { name = 'friend' } = req.query
  const text = `Howdy ${name}, from Vercel!\nNode.js: ${
    process.version
  }\nServer time: ${new Date().toISOString()})`
  const body = cowsay.say({ text })
  res.setHeader('Content-Type', 'text/plain')
  res.end(body)
}
