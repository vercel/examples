import { type NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(_: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('Vercel Edge Functions + Streams + Transforms')
      controller.close()
    },
  })

  const transform = new TransformStream({
    start: (ctrl) => {
      ctrl.enqueue(
        `<html><head><title>Vercel Edge Functions + Streams + Transforms</title></head><body>`
      )
    },
    transform: (chunk, ctrl) => {
      console.log(chunk)
      ctrl.enqueue(chunk.toUpperCase())
    },
    flush(ctrl) {
      ctrl.enqueue('</body></html>')
      console.log(
        "Done transforming. Happy streaming using Vercel's Edge Runtime and Edge Functions!"
      )
    },
  })

  return new Response(stream.pipeThrough(transform), {
    headers: { 'Content-Type': 'text/html' },
  })
}
