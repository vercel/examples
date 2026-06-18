import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import express from 'express'
import { Server } from 'socket.io'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.static(join(__dirname, '..', 'public')))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

io.on('connection', (socket) => {
  socket.on('message', (text: unknown) => {
    const message = String(text ?? '').trim()
    if (!message) return
    socket.emit('message', { text: `server: ${message}`, ts: Date.now() })
  })
})

if (import.meta.main) {
  const port = process.env.PORT || 3000
  server.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
  })
}

export default server
