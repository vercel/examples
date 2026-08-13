import type { NextRequest } from 'next/server'

export const runtime = 'edge' // works in Node.js runtime too — change here if needed
export const dynamic = 'force-dynamic'

/**
 * Streams a response in NDJSON (newline-delimited JSON) format.
 *
 * Protocol — each line is a JSON event:
 *   {"type":"meta","totalChunks":N}        sent once at the start
 *   {"type":"chunk","text":"..."}          one per token, many of these
 *   {"type":"done"}                        sent once at the end
 *   {"type":"error","message":"..."}       only if something fails mid-stream
 *
 * The handler accepts a `{ prompt }` body and echoes it back word-by-word
 * with a small artificial delay to simulate token generation. In a real app,
 * you would replace the loop with calls to your LLM SDK's stream iterator
 * (OpenAI, Anthropic, Gemini, etc.).
 */
export async function POST(req: NextRequest) {
  let prompt = ''
  try {
    const body = await req.json()
    if (typeof body?.prompt === 'string') prompt = body.prompt.trim()
  } catch {
    // No body or invalid JSON — fall back to a default
  }

  if (!prompt) {
    prompt = 'Hello from a streaming response. Each word arrives one at a time.'
  }

  // Tokenize: split on whitespace, keeping the delimiters so output reconstructs cleanly
  const tokens = prompt
    .split(/(\s+)/)
    .filter((t) => t.length > 0)

  const encoder = new TextEncoder()

  // Helper: serialize an event as NDJSON (one JSON object + newline)
  const event = (data: Record<string, unknown>) =>
    encoder.encode(JSON.stringify(data) + '\n')

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 1. Send metadata first so the client can render progress UI
        controller.enqueue(event({ type: 'meta', totalChunks: tokens.length }))

        // 2. Stream each token with a small delay
        for (const token of tokens) {
          await new Promise((resolve) => setTimeout(resolve, 40))
          controller.enqueue(event({ type: 'chunk', text: token }))
        }

        // 3. Signal completion
        controller.enqueue(event({ type: 'done' }))
        controller.close()
      } catch (err) {
        controller.enqueue(
          event({
            type: 'error',
            message: err instanceof Error ? err.message : 'Unknown error',
          }),
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache, no-transform',
      // Hint to proxies (Nginx etc.) not to buffer the response.
      // Vercel respects this automatically.
      'X-Accel-Buffering': 'no',
    },
  })
}
