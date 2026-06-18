import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createNodeWebSocket } from '@hono/node-ws'
import { Hono } from 'hono'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = new Hono()
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })

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

const server = createServer(async (req, res) => {
  const response = await app.fetch(new Request(`http://${req.headers.host}${req.url}`, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req,
    duplex: 'half',
  } as RequestInit))

  res.statusCode = response.status
  response.headers.forEach((value, key) => res.setHeader(key, value))
  if (response.body) {
    for await (const chunk of response.body) {
      res.write(chunk)
    }
  }
  res.end()
})

injectWebSocket(server)

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = process.env.PORT || 3000
  server.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
  })
}

export default server
