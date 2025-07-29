# WHATWG Node Generic Server Adapter

`@whatwg-node/server` helps you to create a generic server implementation by using WHATWG Fetch API
for Node.js, AWS Lambda, Cloudflare Workers, Deno, Express, Fastify, Koa, Next.js and Sveltekit.

Once you create an adapter with `createServerAdapter`, you don't need to install any other platform
specific package since the generic adapter will handle it automatically.

## How to start

Let's create a basic Hello World server adapter.

```ts
// myServerAdapter.ts
import { createServerAdapter } from '@whatwg-node/server'

export default createServerAdapter((request: Request) => {
  return new Response(`Hello World!`, { status: 200 })
})
```

## Integrations

You can use your server adapter with the following integrations:

### Node.js

[Node.js](https://nodejs.org/api/http.html) is the most popular server side JavaScript runtime.

```ts
import { createServer } from 'http'
import myServerAdapter from './myServerAdapter'

// You can create your Node server instance by using our adapter
const nodeServer = createServer(myServerAdapter)
// Then start listening on some port
nodeServer.listen(4000)
```

### AWS Lambda

AWS Lambda is a serverless computing platform that makes it easy to build applications that run on
the AWS cloud. Our adapter is platform agnostic so they can fit together easily. In order to reduce
the boilerplate we prefer to use
[Serverless Express from Vendia](https://github.com/vendia/serverless-express).

```ts
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import type { Handler } from '@aws-cdk/aws-lambda'
import myServerAdapter from './myServerAdapter'

interface ServerContext {
  event: APIGatewayEvent
  lambdaContext: Context
}

export async function handler(
  event: APIGatewayEvent,
  lambdaContext: Context
): Promise<APIGatewayProxyResult> {
  const url = new URL(event.path, 'http://localhost')
  if (event.queryStringParameters != null) {
    for (const name in event.queryStringParameters) {
      const value = event.queryStringParameters[name]
      if (value != null) {
        url.searchParams.set(name, value)
      }
    }
  }

  const response = await myServerAdapter.fetch(
    url,
    {
      // For v1.0 you should use event.httpMethod
      method: event.requestContext.http.method,
      headers: event.headers as HeadersInit,
      body: event.body
        ? Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8')
        : undefined
    },
    {
      event,
      lambdaContext
    }
  )

  const responseHeaders: Record<string, string> = {}

  response.headers.forEach((value, name) => {
    responseHeaders[name] = value
  })

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body: await response.text(),
    isBase64Encoded: false
  }
}
```

### Cloudflare Workers

Cloudflare Workers provides a serverless execution environment that allows you to create entirely
new applications or augment existing ones without configuring or maintaining infrastructure. It uses
Fetch API already so we can use our adapter as an event listener like below;

```ts
import myServerAdapter from './myServerAdapter'

self.addEventListener('fetch', myServerAdapter)
```

### Deno

[Deno is a simple, modern and secure runtime for JavaScript and TypeScript that uses V8 and is built in Rust](https://deno.land/).
You can use our adapter as a Deno request handler like below;

```ts
import myServerAdapter from './myServerAdapter.ts'

Deno.serve(myServerAdapter)
```

### Express

[Express is the most popular web framework for Node.js.](https://expressjs.com/) It is a minimalist
framework that provides a robust set of features to handle HTTP on Node.js applications.

You can easily integrate your adapter into your Express application with a few lines of code.

```ts
import express from 'express'
import myServerAdapter from './myServerAdapter'

const app = express()

// Bind our adapter to `/mypath` endpoint
app.use('/mypath', myServerAdapter)

app.listen(4000, () => {
  console.log('Running the server at http://localhost:4000/mypath')
})
```

### Fastify

[Fastify is one of the popular HTTP server frameworks for Node.js.](https://www.fastify.io/). You
can use your adapter easily with Fastify.

So you can benefit from the powerful plugins of Fastify ecosystem.
[See the ecosystem](https://www.fastify.io/docs/latest/Guides/Ecosystem/)

```ts
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import myServerAdapter from './myServerAdapter'

// This is the fastify instance you have created
const app = fastify({ logger: true })

/**
 * We pass the incoming HTTP request to our adapter
 * and handle the response using Fastify's `reply` API
 * Learn more about `reply` https://www.fastify.io/docs/latest/Reply/
 **/
app.route({
  url: '/mypath',
  method: ['GET', 'POST', 'OPTIONS'],
  handler: async (req, reply) => {
    const response: Response = await myServerAdapter.handleNodeRequestAndResponse(req, reply, {
      req,
      reply
    })

    if (!response) {
      return reply.status(404).send('Not Found')
    }

    response.headers.forEach((value, key) => {
      reply.header(key, value)
    })

    reply.status(response.status)

    // Fastify doesn't accept `null` as a response body
    reply.send(response.body || undefined)

    return reply
  }
})

app.listen(4000)
```

### Koa

[Koa is another Node.js server framework designed by the team behind Express, which aims to be a smaller, more expressive.](https://koajs.com/)
You can add your adapter to your Koa application with a few lines of code then
[benefit middlewares written for Koa.](https://github.com/koajs/koa/wiki)

```ts
import Koa from 'koa'
import myServerAdapter from './myServerAdapter'

const app = new Koa()

app.use(async ctx => {
  const response = await myServerAdapter.handleNodeRequestAndResponse(ctx.request, ctx.res, ctx)

  // Set status code
  ctx.status = response.status

  // Set headers
  response.headers.forEach((value, key) => {
    ctx.append(key, value)
  })

  ctx.body = response.body
})

app.listen(4000, () => {
  console.log('Running the server at http://localhost:4000')
})
```

### Next.js

[Next.js](https://nextjs.org/) is a web framework that allows you to build websites very quickly and
our new server adapter can be integrated with Next.js easily as an API Route.

```ts
// pages/api/myEndpoint.ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import myServerAdapter from './myServerAdapter'

export const config = {
  api: {
    // Disable body parsing if you expect a request other than JSON
    bodyParser: false
  }
}

export default myServerAdapter
```

### SvelteKit

[SvelteKit](https://kit.svelte.dev/) is the fastest way to build svelte apps. It is very simple, and
let you build frontend & backend in a single place

```ts
import myServerAdapter from './myServerAdapter'

export { myServerAdapter as get, myServerAdapter as post }
```

### Bun

[Bun](https://bun.sh/) is a modern JavaScript runtime like Node or Deno, and it supports Fetch API
as a first class citizen. So the configuration is really simple like any other JS runtime;

```ts
import myServerAdapter from './myServerAdapter'

const server = Bun.serve(myServerAdapter)

console.info(`Server is running on ${server.hostname}`)
```

## File Uploads / Multipart Requests

Multipart requests are a type of HTTP request that allows you to send blobs together with regular
text data which has a mime-type `multipart/form-data`.

For example, if you send a multipart request from a browser with `FormData`, you can get the same
`FormData` object in your request handler.

```ts
import { createServerAdapter } from '@whatwg-node/server'

const myServerAdapter = createServerAdapter(async request => {
  // Parse the request as `FormData`
  const formData = await request.formData()
  // Select the file
  const file = formData.get('file')
  // Process it as a string
  const fileTextContent = await file.text()
  // Select the other text parameter
  const regularTextData = formData.get('additionalStuff')
  // ...
  return Response.json({ message: 'ok' })
})
```

You can learn more about [File API](https://developer.mozilla.org/en-US/docs/Web/API/File) on MDN
documentation.

## Routing and Middlewares

We'd recommend to use `fets` to handle routing and middleware approach. It uses
`@whatwg-node/server` under the hood.

> Learn more about `fets` [here](https://github.com/ardatan/fets)

## Plugin System

You can create your own plugins to extend the functionality of your server adapter.

### `onRequest`

This hook is invoked for ANY incoming HTTP request. Here you can manipulate the request or create a
short circuit before the server adapter handles the request.

For example, you can shortcut the manually handle an HTTP request, short-circuiting the HTTP
handler:

```ts
import { createServerAdapter, type ServerAdapterPlugin } from '@whatwg-node/server'

const myPlugin: ServerAdapterPlugin = {
  onRequest({ request, endResponse, fetchAPI }) {
    if (!request.headers.get('authorization')) {
      endResponse(
        new fetchAPI.Response(null, {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
    }
  }
}

const myServerAdapter = createServerAdapter(
  async request => {
    return new Response(`Hello World!`, { status: 200 })
  },
  {
    plugins: [myPlugin]
  }
)
```

Possible usage examples of this hook are:

- Manipulate the request
- Short circuit before the adapter handles the request

| Payload field   | Description                                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `request`       | The incoming HTTP request as WHATWG `Request` object. [Learn more about the request](https://developer.mozilla.org/en-US/docs/Web/API/Request). |
| `serverContext` | The early context object that is shared between all hooks and the entire execution. [Learn more about the context](/docs/features/context).     |
| `fetchAPI`      | WHATWG Fetch API implementation. [Learn more about the fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).                  |
| `url`           | WHATWG URL object of the incoming request. [Learn more about the URL object](https://developer.mozilla.org/en-US/docs/Web/API/URL).             |
| `endResponse`   | A function that allows you to end the request early and send a response to the client.                                                          |

### `onResponse`

This hook is invoked after a HTTP request has been processed and after the response has been
forwarded to the client. Here you can perform any cleanup or logging operations, or you can
manipulate the outgoing response object.

```ts
import { createServerAdapter, type ServerAdapterPlugin } from '@whatwg-node/server'

const requestTimeMap = new WeakMap<Request, number>()

const myPlugin: ServerAdapterPlugin = {
  onRequest({ request }) {
    requestTimeMap.set(request, Date.now())
  },
  onResponse({ request, serverContext, response }) {
    console.log(`Request to ${request.url} has been processed with status ${response.status}`)
    // Add some headers
    response.headers.set('X-Server-Name', 'My Server')
    console.log(`Request to ${request.url} took ${Date.now() - requestTimeMap.get(request)}ms`)
  }
}
```

**Example actions in this hook:**

- Specify custom response format
- Logging/Metrics

| Field Name      | Description                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `request`       | The incoming HTTP request as WHATWG `Request` object. [Learn more about the request](https://developer.mozilla.org/en-US/docs/Web/API/Request).               |
| `serverContext` | The final context object that is shared between all hooks and the execution. [Learn more about the context](/docs/features/context).                          |
| `response`      | The outgoing HTTP response as WHATWG `Response` object. [Learn more about the response interface](https://developer.mozilla.org/en-US/docs/Web/API/Response). |

### `onDispose`

In order to clean up resources when the server is shut down, you can use `onDispose`,
`Symbol.asyncDispose` or `Symbol.syncDispose` to clean up resources.

```ts
export const useMyPlugin = () => {
  return {
    async onDispose() {
      // Clean up resources
      await stopConnection()
    }
  }
}
```

[You can learn more about Explicit Resource Management below](#explicit-resource-management)

## `Request.signal` for awareness of client disconnection

In the real world, a lot of HTTP requests are dropped or canceled. This can happen due to a flakey
internet connection, navigation to a new view or page within a web or native app or the user simply
closing the app. In this case, the server can stop processing the request and save resources.

You can utilize `request.signal` to cancel pending asynchronous operations when the client
disconnects.

```ts
import { createServerAdapter } from '@whatwg-node/server'

const myServerAdapter = createServerAdapter(async request => {
  const upstreamRes = await fetch('https://api.example.com/data', {
    // When the client disconnects, the fetch request will be canceled
    signal: request.signal
  })
  return Response.json({
    data: await upstreamRes.json()
  })
})
```

The execution cancelation API is built on top of the AbortController and AbortSignal APIs.

[Learn more about AbortController and AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

## Explicit Resource Management

While implementing your server with `@whatwg-node/server`, you need to control over the lifecycle of
your resources. This is especially important when you are dealing with resources that need to be
cleaned up when they are no longer needed, or clean up the operations in a queue when the server is
shutting down.

### Dispose the Server Adapter

The server adapter supports
[Explicit Resource Management](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management)
approach that allows you to dispose of resources when they are no longer needed. This can be done in
two ways shown below;

#### `await using` syntax

We use the `await using` syntax to create a new instance of `adapter` and dispose of it when the
block is exited. Notice that we are using a block to limit the scope of `adapter` within `{ }`. So
resources will be disposed of when the block is exited.

```ts
console.log('Adapter is starting')
{
  await using adapter = createServerAdapter(/* ... */)
}
console.log('Adapter is disposed')
```

#### `dispose` method

We create a new instance of `adapter` and dispose of it using the `dispose` method.

```ts
console.log('Adapter is starting')
const adapter = createServerAdapter(/* ... */)
await adapter.dispose()
console.log('Adapter is disposed')
```

In the first example, we use the `await using` syntax to create a new instance of `adapter` and
dispose of it when the block is exited. In the second example,

#### Dispose on Node.js

When running your adapter on Node.js, you can use process event listeners or server's `close` event
to trigger the adapter's disposal. Or you can configure the adapter to handle this automatically by
listening `process` exit signals.

##### Explicit disposal

We can dispose of the adapter instance when the server is closed like below.

```ts
import { createServer } from 'http'
import { createServerAdapter } from '@whatwg-node/server'

const adapter = createServerAdapter(/* ... */)

const server = createServer(adapter)
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000')
})
server.once('close', async () => {
  await adapter.dispose()
  console.info('Server is disposed so is adapter')
})
```

##### Automatic disposal

`disposeOnProcessTerminate` option will register an event listener for `process` termination in
Node.js

```ts
import { createServer } from 'http'
import { createServerAdapter } from '@whatwg-node/server'

createServer(
  createServerAdapter(/* ... */, {
    disposeOnProcessTerminate: true,
    plugins: [/* ... */]
  })
).listen(4000, () => {
  console.info('Server is running on http://localhost:4000')
})
```

### Plugin Disposal

If you have plugins that need some internal resources to be disposed of, you can use the `onDispose`
hook to dispose of them. This hook will be invoked when the adapter instance is disposed like above.

```ts
let dbConnection: Connection
const plugin = {
  onPluginInit: async () => {
    dbConnection = await createConnection()
  },
  onDispose: async () => {
    // Dispose of resources
    await dbConnection.close()
  }
}
```

Or you can flush a queue of operations when the server is shutting down.

```ts
const backgroundJobs: Promise<void>[] = []

const plugin = {
  onRequest() {
    backgroundJobs.push(
      sendAnalytics({
        /* ... */
      })
    )
  },
  onDispose: async () => {
    // Flush the queue of background jobs
    await Promise.all(backgroundJobs)
  }
}
```

But for this kind of purposes, `waitUntil` can be a better choice.

### Background jobs

If you have background jobs that need to be completed before the environment is shut down.
`waitUntil` is better choice than `onDispose`. In this case, those jobs will keep running in the
background but in case of disposal, they will be awaited. `waitUntil` works so similar to
[Cloudflare Workers' `waitUntil` function](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/#parameters).

But the adapter handles `waitUntil` even if it is not provided by the environment.

```ts
const adapter = createServerAdapter(async (request, context) => {
  const args = await request.json()
  if (!args.name) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }
  // This does not block the response
  context.waitUntil(
    fetch('http://my-analytics.com/analytics', {
      method: 'POST',
      body: JSON.stringify({
        name: args.name,
        userAgent: request.headers.get('User-Agent')
      })
    })
  )
  return Response.json({ greetings: `Hello, ${args.name}` })
})

const res = await adapter.fetch('http://localhost:4000', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'John' })
})

console.log(await res.json()) // { greetings: "Hello, John" }

await adapter.dispose()
// The fetch request for `analytics` will be awaited here
```
