import { NextResponse, NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

const RESOURCE_URL =
  'https://gist.githubusercontent.com/okbel/8ba642143f6912548df2d79f2c0ebabe/raw/4bcf9dc5750b42fa225cf6571d6aaa68c23a73aa/README.md'

export default async function handler(req: NextRequest, res: NextResponse) {
  const resourceRequest = await fetch(RESOURCE_URL)
  const stream = resourceRequest.body
  return new Response(stream.pipeThrough(transform))
}

const decoder = new TextDecoder()
const transform = new TransformStream({
  start: (ctrl) => {
    ctrl.enqueue(
      `Resource: ${RESOURCE_URL}\n\n\n\n --------------------------------- \n\n `
    )
  },
  transform: (chunk, ctrl) => {
    ctrl.enqueue(decoder.decode(chunk).toUpperCase())
  },
  flush(ctrl) {
    ctrl.enqueue(
      "\n\n\n\n\n\n\n\n\n\n --------------------------------- \n\n Note: This content has been transformed using Vercel's Edge Runtime and Edge Functions"
    )
    console.log(
      "Done transforming. Happy streaming using Vercel's Edge Runtime and Edge Functions!"
    )
  },
})
