import express from 'express'

const app = express()

const runtime = typeof globalThis.Bun !== 'undefined' ? 'bun' : 'node'

app.get('/', (_req, res) => {
  res.send(`Hello from ${runtime}!`)
})

app.get('/api/users/:id', (_req, res) => {
  res.json({ id: _req.params.id })
})

app.get('/api/posts/:postId/comments/:commentId', (_req, res) => {
  res.json({ postId: _req.params.postId, commentId: _req.params.commentId })
})

export default app
