import { NextResponse, NextRequest } from 'next/server'
const decoder = new TextDecoder()

export const config = {
  runtime: 'experimental-edge',
}

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

export default async function handler(req: NextRequest, res: NextResponse) {
  return new Response(stream.pipeThrough(transform), {
    headers: { 'Content-Type': 'text/html' },
  })
}
