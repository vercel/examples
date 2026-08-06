const server = Bun.serve({
  port: Number(process.env.PORT || 3000),
  routes: {
    '/': new Response(Bun.file('public/index.html'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }),
    '/health': Response.json({ status: 'ok' }),
  },
  fetch(request, server) {
    const { pathname } = new URL(request.url)

    if (pathname === '/ws' && server.upgrade(request)) {
      return
    }

    return new Response('Not found', { status: 404 })
  },
  websocket: {
    message(socket, message) {
      socket.send(message)
    },
  },
})

console.log(`Listening on ${server.url}`)
