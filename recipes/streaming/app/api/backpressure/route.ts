// can also be 'nodejs'
export const runtime = 'edge'
// A generator that will yield positive integers
async function* integers() {
  let i = 1
  while (true) {
    console.log(`yielding ${i}`)
    yield i++

    await sleep(100)
  }
}
// Add a custom sleep function to create
// a delay that simulates how slow some
// Function responses are.
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
// Wraps a generator into a ReadableStream
function createStream(iterator: AsyncGenerator<number, void, unknown>) {
  return new ReadableStream({
    // The pull method controls what happens
    // when data is added to a stream.
    async pull(controller) {
      const { value, done } = await iterator.next()
      // done == true when the generator will yield
      // no more new values. If that's the case,
      // close the stream.
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}
// Demonstrate handling backpressure
async function backpressureDemo() {
  // Set up a stream of integers
  const stream = createStream(integers())
  // Read values from the stream
  const reader = stream.getReader()
  const loopCount = 5
  // Read as much data as you want
  for (let i = 0; i < loopCount; i++) {
    // Get the newest value added to the stream
    const { value } = await reader.read()
    console.log(`Stream value: ${value}`)
    await sleep(1000)
  }
}

export async function GET() {
  backpressureDemo()
  return new Response('Check your developer console to see the result!')
}
