import { type NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(_: NextRequest) {
  const encoder = new TextEncoder()

  // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(
          '<html><head><title>Vercel Edge Functions + Streaming</title></head><body>'
        )
      )
      controller.enqueue(encoder.encode('Vercel Edge Functions + Streaming'))
      controller.enqueue(encoder.encode('</body></html>'))
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
