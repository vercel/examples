import { createServer } from 'node:http'
import { handleApiRequest } from './api/routes.js'
import { homePage } from './pages/home.js'

const port = Number(process.env.PORT ?? 3000)

const server = createServer((request, response) => {
  const url = new URL(
    request.url ?? '/',
    `http://${request.headers.host ?? 'localhost'}`
  )

  if (request.method === 'GET' && url.pathname === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ status: 'ok' }))
    return
  }

  if (request.method === 'GET' && url.pathname === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(homePage)
    return
  }

  if (url.pathname.startsWith('/api/')) {
    handleApiRequest(request, response, url)
    return
  }

  response.writeHead(404, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ error: 'Not Found' }))
})

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
