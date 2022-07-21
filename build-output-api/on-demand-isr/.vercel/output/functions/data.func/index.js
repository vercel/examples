module.exports = (req, res) => {
  const data = {
    label: 'a response from the server',
    timestamp: (new Date()).toISOString()
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}
