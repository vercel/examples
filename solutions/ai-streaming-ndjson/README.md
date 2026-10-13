# AI Streaming with NDJSON example

This example shows how to implement progressive token-by-token streaming from a Next.js API Route to the browser using **NDJSON** (newline-delimited JSON) — a simpler alternative to Server-Sent Events when you need to send a `POST` request with a body.

## Why NDJSON instead of SSE?

`EventSource` is the browser's native client for Server-Sent Events, but it has two notable limitations:

- ❌ Only accepts `GET` requests — you can't send a request body
- ❌ Locked to the `text/event-stream` format

For many real-world cases (chat interfaces, long-running operations, AI completions), you want to **POST a payload** and stream the response back progressively. NDJSON over `ReadableStream` gives you the same streaming UX with:

- ✅ Any HTTP method (POST, PUT, etc.)
- ✅ Custom event types (`meta`, `chunk`, `error`, `done`)
- ✅ Trivial to test with `curl --no-buffer`
- ✅ Easy to parse line-by-line on the client

## Demo

https://ai-streaming-ndjson.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/ai-streaming-ndjson&project-name=ai-streaming-ndjson&repository-name=ai-streaming-ndjson)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/ai-streaming-ndjson
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

## How it works

### The NDJSON protocol

Each message is one JSON object terminated with `\n`. This example uses 4 event types:

```
{"type":"meta","totalChunks":50}
{"type":"chunk","text":"Hello "}
{"type":"chunk","text":"world"}
{"type":"done"}
```

If something fails mid-stream:

```
{"type":"error","message":"Provider rate-limited"}
```

### Server: `ReadableStream` writing NDJSON

The handler returns a `ReadableStream` that encodes each event as JSON + newline. This works on both Node.js and Edge runtimes:

```typescript
// app/api/stream/route.ts
export async function POST(req: Request) {
  const encoder = new TextEncoder()
  const event = (data: Record<string, unknown>) =>
    encoder.encode(JSON.stringify(data) + '\n')

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(event({ type: 'meta', totalChunks: tokens.length }))

      for (const token of tokens) {
        await sleep(40) // simulate token-by-token generation
        controller.enqueue(event({ type: 'chunk', text: token }))
      }

      controller.enqueue(event({ type: 'done' }))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no', // hint to proxies not to buffer
    },
  })
}
```

### Client: reading NDJSON line-by-line

The browser reads the stream with `getReader()` and decodes incrementally with `TextDecoder`. Since chunks may arrive split across line boundaries, we keep a `buffer` and only parse complete lines (terminated by `\n`):

```typescript
const response = await fetch('/api/stream', { method: 'POST' })
if (!response.body) throw new Error('No body')

const reader = response.body.getReader()
const decoder = new TextDecoder()
let buffer = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  buffer += decoder.decode(value, { stream: true })

  let newlineIdx = buffer.indexOf('\n')
  while (newlineIdx !== -1) {
    const line = buffer.slice(0, newlineIdx).trim()
    buffer = buffer.slice(newlineIdx + 1)
    if (line) {
      const event = JSON.parse(line)
      // handle meta / chunk / done / error
    }
    newlineIdx = buffer.indexOf('\n')
  }
}
```

The key insight: `decoder.decode(value, { stream: true })` keeps the decoder stateful, so multi-byte characters split across chunks are reconstructed correctly.

## When to use this pattern

✅ Good fit:

- AI completions with a long prompt/document in the body
- Long-running operations with progress reporting
- Multi-event responses (metadata + content + completion)
- When you want to test the endpoint with `curl`

❌ Not ideal:

- Server-initiated push to idle clients (use WebSockets)
- Browser auto-reconnect needed (SSE has this built in)
- Streaming binary data (use raw `ReadableStream` without JSON)

## Notes

- The `X-Accel-Buffering: no` header is a hint to proxies (like Nginx) not to buffer the response. Vercel respects this automatically, but if you self-host behind a proxy, this is critical.
- Most browsers handle the streaming `fetch` response uniformly, but Safari historically buffered chunks. Modern Safari (17+) works as expected.
- For production use, consider adding heartbeats (`{"type":"ping"}` every 15s) so intermediate proxies don't drop the connection on long generations.
