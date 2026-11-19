// Serves the Hono app on node:http for local testing, using only the Node standard library.
// On Vercel the app's default export is the entry point; this file is not deployed as a route.
import { createServer } from 'node:http'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// APP_ENTRY can point at the compiled function from `vercel build` (.vercel/output/functions/index.func/src/index.js).
const entry = process.env.APP_ENTRY
  ? pathToFileURL(resolve(process.env.APP_ENTRY)).href
  : '../src/index.ts'
const { default: app } = (await import(entry)) as {
  default: { fetch: (request: Request) => Promise<Response> }
}

const port = Number(process.env.PORT ?? 3000)

const server = createServer(async (req, res) => {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined)
      headers.set(key, Array.isArray(value) ? value.join(', ') : value)
  }
  const method = req.method ?? 'GET'
  const request = new Request(
    `http://${req.headers.host ?? 'localhost'}${req.url ?? '/'}`,
    {
      method,
      headers,
      body:
        method === 'GET' || method === 'HEAD'
          ? undefined
          : Buffer.concat(chunks),
    },
  )
  const response = await app.fetch(request)
  res.writeHead(response.status, Object.fromEntries(response.headers))
  res.end(Buffer.from(await response.arrayBuffer()))
})

server.listen(port, () =>
  console.log(`Zpup SVG API on http://localhost:${port}`),
)
process.on('SIGTERM', () => server.close(() => process.exit(0)))
