import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

// Streamable content
const RESOURCE_URL =
  'https://mdn.github.io/dom-examples/streams/png-transform-stream/png-logo.png'

export default async function handler(request: NextRequest) {
  const r = await fetch(RESOURCE_URL)

  const reader = r.body.getReader()

  const response = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read()

        // When no more data needs to be consumed, break the reading
        if (done) {
          break
        }

        // Enqueue the next data chunk into our target stream
        controller.enqueue(value)
      }

      // Close the stream
      controller.close()
      reader.releaseLock()
    },
  })

  return new Response(response)
}
