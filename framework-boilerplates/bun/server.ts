const MAX_DURATION = 1200;

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
    "/api/stream": async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode("Starting stream...\n"));

          let count = 0;
          const interval = setInterval(() => {
            count++;
            controller.enqueue(
              encoder.encode(`Stream chunk ${count} at ${new Date().toISOString()}\n`),
            );

            if (count >= MAX_DURATION - 5) {
              clearInterval(interval);
              controller.enqueue(encoder.encode("Stream completed!\n"));
              controller.close();
            }
          }, 1000);
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    },
  },
  fetch(request) {
    return Response.json(
      { error: "Not Found", pathname: new URL(request.url).pathname },
      { status: 404 },
    );
  },
});
