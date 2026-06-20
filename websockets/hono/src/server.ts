import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { serve, upgradeWebSocket } from '@hono/node-server'
import { Hono } from 'hono'
import { WebSocketServer } from 'ws'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = new Hono()

app.get('/', async (c) => {
  const html = await readFile(join(__dirname, '..', 'public', 'index.html'), 'utf8')
  return c.html(html)
})

app.get('/health', (c) => c.json({ status: 'ok' }))

app.get(
  '/ws',
  upgradeWebSocket(() => ({
    onMessage(event, ws) {
      const message = String(event.data ?? '').trim()
      if (!message) return
      ws.send(`server: ${message}`)
    },
  })),
)

const wss = new WebSocketServer({ noServer: true })

const server = serve({
  fetch: app.fetch,
  port: Number(process.env.PORT || 3000),
  websocket: { server: wss },
}, (info) => {
  if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    console.log(`listening on http://localhost:${info.port}`)
  }
})

export default server
