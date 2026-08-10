Bun.serve({
  routes: {
    "/": new Response(Bun.file(new URL("./public/index.html", import.meta.url)), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }),
    "/api/hello": (request) =>
      Response.json({
        message: "Hello from a Bun route handler!",
        pathname: new URL(request.url).pathname,
      }),
  },
  fetch(request) {
    return Response.json(
      { error: "Not Found", pathname: new URL(request.url).pathname },
      { status: 404 },
    );
  },
});
