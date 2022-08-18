import { type NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(_: NextRequest) {
  // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(
        '<html><head><title>Vercel Edge Functions + Streaming</title></head><body>'
      )
      controller.enqueue('Vercel Edge Functions + Streaming')
      controller.enqueue('</body></html>')
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
