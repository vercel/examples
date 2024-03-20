export const runtime = 'edge'

// This method must be named GET
export async function GET() {
  // TextEncoder objects turn text content
  // into streams of UTF-8 characters.
  // You'll add this encoder to your stream
  const encoder = new TextEncoder()
  // This is the stream object, which clients can read from
  // when you send it as a Function response
  const readableStream = new ReadableStream({
    // The start method is where you'll add the stream's content
    start(controller) {
      const text = 'Stream me!'
      // Queue the encoded content into the stream
      controller.enqueue(encoder.encode(text))
      // Prevent more content from being
      // added to the stream
      controller.close()
    },
  })

  // TextDecoders can decode streams of
  // encoded content. You'll use this to
  // transform the streamed content before
  // it's read by the client
  const decoder = new TextDecoder()
  // TransformStreams can transform a stream's chunks
  // before they're read in the client
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      // Decode the content, so it can be transformed
      const text = decoder.decode(chunk)
      // Make the text uppercase, then encode it and
      // add it back to the stream
      controller.enqueue(encoder.encode(text.toUpperCase()))
    },
  })

  // Finally, send the streamed response. Result:
  // "STREAM ME!" will be displayed in the client
  return new Response(readableStream.pipeThrough(transformStream), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
