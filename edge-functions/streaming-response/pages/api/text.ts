import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

// Streamable content
const RESOURCE_URL =
  'https://gist.githubusercontent.com/okbel/8ba642143f6912548df2d79f2c0ebabe/raw/4bcf9dc5750b42fa225cf6571d6aaa68c23a73aa/README.md'

// Issue 1:
// Problem here with those 2 clasees. They work in the browser but not in the server.
// this works in 12.2.3-canary.16

// Issue 2:
// I'm not using TransformStream
const decoder = new TextDecoder('utf-8') // no option { stream: true }
const encoder = new TextEncoder()

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
        const transformed = encoder.encode(decoder.decode(value).toUpperCase())
        controller.enqueue(transformed)
      }

      // Close the stream
      controller.close()
      reader.releaseLock()
    },
  })

  return new Response(response)
}
