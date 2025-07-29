// @ts-check
// This is a JavaScript file because we need to locate it at runtime using the
// `Worker` API and using a `.ts` complicates things. To make it type-safe,
// we use JSDoc annotations.
import { createServer } from 'node:net'
import process from 'node:process'
import { isMainThread, workerData, parentPort } from 'node:worker_threads'

import { isStream } from 'is-stream'
import lambdaLocal from 'lambda-local'
import sourceMapSupport from 'source-map-support'

/**
 * @typedef HandlerResponse
 * @type {import('../../../src/function/handler_response.js').HandlerResponse}
 */

/**
 * @typedef WorkerResult
 * @type {HandlerResponse & { streamPort?: number }}
 */

if (isMainThread) {
  throw new Error(`Do not import "${import.meta.url}" in the main thread.`)
}

sourceMapSupport.install()

lambdaLocal.getLogger().level = 'alert'

const { clientContext, entryFilePath, environment = {}, event, timeoutMs } = workerData

// Injecting into the environment any properties passed in by the parent.
for (const key in environment) {
  process.env[key] = environment[key]
}

const lambdaFunc = await import(entryFilePath)
const invocationResult = /** @type {HandlerResponse} */ (
  await lambdaLocal.execute({
    clientContext,
    event,
    lambdaFunc,
    region: 'dev',
    timeoutMs,
    verboseLevel: 3,
  })
)

/** @type {number | undefined} */
let streamPort

// When the result body is a StreamResponse
// we open up a http server that proxies back to the main thread.
if (invocationResult && isStream(invocationResult.body)) {
  const { body } = invocationResult

  delete invocationResult.body

  await new Promise((resolve, reject) => {
    const server = createServer((socket) => {
      body.pipe(socket).on('end', () => server.close())
    })
    server.on('error', (error) => {
      reject(error)
    })
    server.listen({ port: 0, host: 'localhost' }, () => {
      const address = server.address()

      if (address && typeof address !== 'string') {
        streamPort = address.port
      }

      resolve(undefined)
    })
  })
}

if (parentPort) {
  /** @type {WorkerResult} */
  const message = { ...invocationResult, streamPort }

  parentPort.postMessage(message)
}
