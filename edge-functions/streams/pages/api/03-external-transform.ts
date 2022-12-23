import { type NextRequest } from 'next/server'

const RESOURCE_URL =
  'https://gist.githubusercontent.com/okbel/8ba642143f6912548df2d79f2c0ebabe/raw/4bcf9dc5750b42fa225cf6571d6aaa68c23a73aa/README.md'

export const config = {
  runtime: 'edge',
}

export default async function handler(_: NextRequest) {
  // The decoder will be used to decode the bytes in the stream returned by fetching
  // the external resource to UTF-8 (the default).
  // https://developer.mozilla.org/en-US/docs/Web/API/TextDecode
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const res = await fetch(RESOURCE_URL)

  // Pipe the stream to a transform stream that will take its chunks and transform
  // them into uppercase text.
  // https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream
  const transformedResponse = res.body?.pipeThrough(
    new TransformStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `<html><head><title>Vercel Edge Functions + Streams + Transforms</title></head><body>`
          )
        )
        controller.enqueue(encoder.encode(`Resource: ${RESOURCE_URL}<br/>`))
        controller.enqueue(encoder.encode(`<hr/><br/><br/><br/>`))
      },
      transform(chunk, controller) {
        controller.enqueue(
          encoder.encode(
            decoder
              .decode(chunk, { stream: true })
              .toUpperCase()
              .concat(' <---')
          )
        )
      },
      flush(controller) {
        controller.enqueue(encoder.encode('</body></html>'))
      },
    })
  )

  return new Response(transformedResponse, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
