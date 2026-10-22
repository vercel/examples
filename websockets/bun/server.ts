Bun.serve({
  routes: {
    "/": new Response(Bun.file(new URL("./public/index.html", import.meta.url)), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }),
    "/health": Response.json({ status: "ok" }),
  },
  fetch(request, server) {
    const { pathname } = new URL(request.url);
    if (pathname === "/ws" && server.upgrade(request)) {
      return;
    }
    return new Response("Not found", { status: 404 });
  },
  websocket: {
    message(socket, message) {
      socket.send(message);
    },
  },
});
