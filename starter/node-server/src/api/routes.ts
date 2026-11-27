import type { IncomingMessage, ServerResponse } from 'node:http'

function sendJson(response: ServerResponse, status: number, data: unknown) {
  response.writeHead(status, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(data))
}

export function handleApiRequest(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL
) {
  if (request.method === 'GET' && url.pathname === '/api/data') {
    sendJson(response, 200, {
      data: [
        { id: 1, name: 'Sample Item 1', value: 100 },
        { id: 2, name: 'Sample Item 2', value: 200 },
        { id: 3, name: 'Sample Item 3', value: 300 },
      ],
      total: 3,
      timestamp: '2024-01-01T00:00:00Z',
    })
    return
  }

  const itemMatch = url.pathname.match(/^\/api\/items\/(\d+)$/)
  if (request.method === 'GET' && itemMatch) {
    const itemId = Number(itemMatch[1])
    sendJson(response, 200, {
      item: {
        id: itemId,
        name: `Sample Item ${itemId}`,
        value: itemId * 100,
      },
      timestamp: '2024-01-01T00:00:00Z',
    })
    return
  }

  sendJson(response, 404, { error: 'Not Found' })
}
