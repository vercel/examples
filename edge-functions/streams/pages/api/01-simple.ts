import { NextResponse, NextRequest } from 'next/server'
const decoder = new TextDecoder()

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: NextRequest, res: NextResponse) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        '<html><head><title>Vercel Edge Functions + Streaming</title></head><body>'
      )
      controller.enqueue('Vercel Edge Functions + Streaming')
      controller.enqueue('</body></html>')
      controller.close()
    },
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/html' } })
}
