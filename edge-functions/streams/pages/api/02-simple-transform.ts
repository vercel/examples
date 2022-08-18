import { type NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(_: NextRequest) {
  // A readable stream that we'll pipe through the transform stream below.
  // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue('Vercel Edge Functions + Streams + Transforms')
      controller.close()
    },
  })

  // This transform stream adds the HTML markup and transforms the chunks
  // of text in the readable stream to uppercase.
  // https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream
  const transform = new TransformStream({
    start(controller) {
      controller.enqueue(
        `<html><head><title>Vercel Edge Functions + Streams + Transforms</title></head><body>`
      )
    },
    transform(chunk, controller) {
      console.log(3, chunk)
      controller.enqueue(chunk.toUpperCase())
    },
    flush(controller) {
      controller.enqueue('</body></html>')
    },
  })

  // Pipe the readable stream to the transform stream and stream it to the response.
  // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeThrough
  return new Response(readable.pipeThrough(transform), {
    headers: { 'Content-Type': 'text/html' },
  })
}
