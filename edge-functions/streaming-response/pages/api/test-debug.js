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

// Streamable content
const RESOURCE_URL =
  'https://gist.githubusercontent.com/okbel/8ba642143f6912548df2d79f2c0ebabe/raw/4bcf9dc5750b42fa225cf6571d6aaa68c23a73aa/README.md'

const r = fetch(RESOURCE_URL)

// if (res.locked) {
//   console.log('LOCKED')
//   console.log(r.)
//   // r.body.cancel()
// } else {
//   return new Response(res)
// }

console.log('END', new Response(r.body?.pipeThrough(transformStream)))
