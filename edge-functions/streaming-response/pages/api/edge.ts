import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

// Streamable content
const RESOURCE_URL =
  'https://gist.githubusercontent.com/okbel/8ba642143f6912548df2d79f2c0ebabe/raw/4bcf9dc5750b42fa225cf6571d6aaa68c23a73aa/README.md'

export default async function handler(request: NextRequest) {
  const r = await fetch(RESOURCE_URL)
  const transformed = r.body?.pipeThrough(transform)
  const reader = transformed.getReader()

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

// Problem here with those 2 clasees. They work in the browser but not in the server.
// this works in 12.2.3-canary.16 and is broken in later versions
const decoder = new TextDecoder('utf-8')
const encoder = new TextEncoder()

const transform = new TransformStream({
  start: (controller) => {
    controller.enqueue(
      `Resource: ${RESOURCE_URL}\n\n\n\n --------------------------------- \n\n `
    )
  },
  transform: (chunk, controller) => {
    // Enqueue the next data chunk into our target stream
    const transformed = encoder.encode(decoder.decode(chunk).toUpperCase())
    controller.enqueue(transformed)
  },
  flush(controller) {
    controller.enqueue(
      "\n\n\n\n\n\n\n\n\n\n --------------------------------- \n\n Note: This content has been transformed using Vercel's Edge Runtime and Edge Functions"
    )
    console.log(
      "Done transforming. Happy streaming using Vercel's Edge Runtime and Edge Functions!"
    )
    controller.terminate()
  },
})
