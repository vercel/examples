const port = Number(process.env.PORT || 3000)

Bun.serve({
  port,
  routes: {
    '/': () =>
      new Response(Bun.file('index.html'), {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      }),
    '/api/hello': (request) =>
      Response.json({
        message: 'Hello from a Bun route handler!',
        pathname: new URL(request.url).pathname,
      }),
  },
  fetch(request) {
    return Response.json(
      { error: 'Not Found', pathname: new URL(request.url).pathname },
      { status: 404 },
    )
  },
})
