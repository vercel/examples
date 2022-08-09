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

const transformStream2 = new TransformStream({
  transform(chunk, controller) {
    console.log('[transform]', chunk)
    controller.enqueue(chunk)
  },
  flush(controller) {
    console.log('[flush]')
    controller.terminate()
  },
})

const decoder = new TextDecoder()
const encoder = new TextEncoder()

const transformStream = new TransformStream({
  start: (controller) => {
    controller.enqueue(
      `Resource: ${RESOURCE_URL}\n\n\n\n --------------------------------- \n\n `
    )
  },
  transform(chunk, controller) {
    // controller.enqueue(chunk)

    switch (typeof chunk) {
      case 'object':
        if (chunk === null) controller.terminate()
        else if (ArrayBuffer.isView(chunk)) {
          const uint8Array = new Uint8Array(
            chunk.buffer,
            chunk.byteOffset,
            chunk.byteLength
          )
          var chunkString = new TextDecoder().decode(uint8Array)

          const chunkUint8Array = new TextEncoder().encode(
            chunkString.toUpperCase()
          )

          console.log('[transform chunk]', chunk)
          console.log('[transform original]', uint8Array)
          console.log('[transform chunkString]', chunkString)
          console.log('[transform uppercase]', chunkUint8Array)
          controller.enqueue(uint8Array)
          console.log('[transform - ArrayBuffer.isView]')
        } else if (
          Array.isArray(chunk) &&
          chunk.every((value) => typeof value === 'number')
        ) {
          controller.enqueue(new Uint8Array(chunk))
          console.log('[transform - Array typeof number]')
        } else if (
          'function' === typeof chunk.valueOf &&
          chunk.valueOf() !== chunk
        ) {
          this.transform(chunk.valueOf(), controller)
          console.log('[transform - typeof function')
        }
        // hack
        else if ('toJSON' in chunk)
          this.transform(JSON.stringify(chunk), controller)
        break
      case 'symbol':
        controller.error('Cannot send a symbol as a chunk part')
        break
      case 'undefined':
        controller.error('Cannot send undefined as a chunk part')
        break
      default:
        controller.enqueue(this.textencoder.encode(String(chunk)))
        break
    }

    // controller.enqueue(encoder.encode(String(chunk)))
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

const transform = new TransformStream({
  start: (controller) => {
    controller.enqueue(
      `Resource: ${RESOURCE_URL}\n\n\n\n --------------------------------- \n\n `
    )
  },
  transform: (chunk, controller) => {
    console.log('here: ', typeof chunk)
    console.log('chunk: ', chunk)
    console.log('decoded:', decoder.decode(chunk))

    // controller.enqueue(chunk)
    controller.enqueue(decoder.decode(chunk).toUpperCase())
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

/**
 * This transformer takes binary Uint8Array chunks from a `fetch`
 * and translates them to chunks of strings.
 *
 * @implements {TransformStreamTransformer}
 */
class Uint8ArrayToStringsTransformer {
  decoder: TextDecoder
  lastString: string
  constructor() {
    this.decoder = new TextDecoder()
    this.lastString = ''
  }

  /**
   * Receives the next Uint8Array chunk from `fetch` and transforms it.
   *
   * @param {Uint8Array} chunk The next binary data chunk.
   * @param {TransformStreamDefaultController} controller The controller to enqueue the transformed chunks to.
   */
  transform(chunk, controller) {
    console.log('Received chunk %o with %d bytes.', chunk, chunk.byteLength)

    // Decode the current chunk to string and prepend the last string
    const string = `${this.lastString}${this.decoder.decode(chunk)}`

    // Extract lines from chunk
    const lines = string.split(/\r\n|[\r\n]/g)

    // Save last line, as it might be incomplete
    this.lastString = lines.pop() || ''

    // Enqueue each line in the next chunk
    for (const line of lines) {
      controller.enqueue(line)
    }
  }

  /**
   * Is called when `fetch` has finished writing to this transform stream.
   *
   * @param {TransformStreamDefaultController} controller The controller to enqueue the transformed chunks to.
   */
  flush(controller) {
    // Is there still a line left? Enqueue it
    if (this.lastString) {
      controller.enqueue(this.lastString)
    }
  }
}
