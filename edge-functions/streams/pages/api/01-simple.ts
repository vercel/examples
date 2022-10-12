import { type NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(_: NextRequest) {
  const { encode } = new TextEncoder()

  // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encode(
          '<html><head><title>Vercel Edge Functions + Streaming</title></head><body>'
        )
      )
      controller.enqueue(encode('Vercel Edge Functions + Streaming'))
      controller.enqueue(encode('</body></html>'))
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
