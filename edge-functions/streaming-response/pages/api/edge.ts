import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

// Streamable content
const RESOURCE_URL = "https://gist.githubusercontent.com/okbel/8ba642143f6912548df2d79f2c0ebabe/raw/4bcf9dc5750b42fa225cf6571d6aaa68c23a73aa/README.md"

export default async function handler(request: NextRequest) {
  const r = await fetch(RESOURCE_URL)
  return new Response(r.body?.pipeThrough(transform))
}

const decoder = new TextDecoder();
const transform = new TransformStream({
  start: (controller) => {
    controller.enqueue(`Resource: ${RESOURCE_URL}\n\n\n\n --------------------------------- \n\n `)
  },
  transform: (chunk, controller) => {
    controller.enqueue(decoder.decode(chunk).toUpperCase());
  },
  flush(controller) {
    controller.enqueue("\n\n\n\n\n\n\n\n\n\n --------------------------------- \n\n Note: This content has been transformed using Vercel's Edge Runtime and Edge Functions");
    console.log("Done transforming. Happy streaming using Vercel's Edge Runtime and Edge Functions!")
  }
});
