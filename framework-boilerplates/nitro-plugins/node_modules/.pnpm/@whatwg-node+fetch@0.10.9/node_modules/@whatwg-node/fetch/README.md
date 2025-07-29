# `@whatwg-node/fetch`

A ponyfill package for the [Fetch Standard](https://fetch.spec.whatwg.org/). If your JavaScript
environment doesn't implement this standard natively, this package automatically ponyfills the
missing parts, and export them as a module; otherwise it exports the native ones without touching
the environment's internals. It also exports some additional standard APIs that are required by the
Fetch Standard.

## Installation

```bash
yarn add @whatwg-node/fetch
```

## Why Fetch API and why this ponyfill in general?

If you are building a JavaScript library, and you want it to support all JavaScript environments not
only Node.js. Fetch API is the best choice for you. Because it's a standard, and it's implemented by
the most environments out there expect Node.js :). So you can use Fetch API in your library, and
your users can use it in their browsers, Deno, Bun, Cloudflare Works, and in Node.js.

> This is how we support all JavaScript environments in
> [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server/docs/integrations/z-other-environments).
> In GraphQL Yoga, we don't care which JavaScript environment you prefer, we support all of them.

## Why we should still use these for Node.js even if it already implements them natively

Even if newer Node.js already implements Fetch API and Data Text Encoding API natively, we still
recommend to use this package, because this package implements them for Node.js in more efficient
way.

- [See problems with the global fetch/undici in Node.js](https://github.com/nodejs/undici/issues/1203)
- - We offer a patched version of `node-fetch` that doesn't use `undici` and Node.js streams
    internally, so it's more efficient than the native one.
- [See problems with text encoding API in Node.js](https://github.com/nodejs/node/issues/39879)
- - We use [`Buffer`](https://nodejs.org/api/buffer.html) instead of the native one, because
    `Buffer` is faster than the native one unfortunately.
- `Body.formData()` is not implemented by Node.js, so we implement it with `busboy` internally. So
  you can consume incoming multipart(file uploads) requests with `.formData` in Node.js.
- `fetch` implementation of Node.js uses `undici` and it doesn't support HTTP 2, our implementation
  supports it natively thanks to `node-libcurl`.

### Faster HTTP Client in Node.js with HTTP/2 support

If you install `node-libcurl` seperately, `@whatwg-node/fetch` will select `libcurl` instead of
`node:http` which is faster.

[See benchmarks](https://github.com/JCMais/node-libcurl/tree/develop/benchmark#ubuntu-1910-i7-5500u-24ghz---linux-530-42---node-v12162)

### Handling file uploads with Fetch API

```ts
import { Request } from '@whatwg-node/fetch'

// See how you can handle file uploads with Fetch API
http.createServer(async (req, res) => {
  const request = new Request(req)
  const formData = await request.formData()
  const file = formData.get('file')
  // ...
})
```

> If you want to limit the size of the multipart form data, you can use `createFetch`. See the
> [API](#api) section for more details.

## API

The following are exported by this package:

### WHATWG Fetch Standard

- [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)
- [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
- [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
- [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

### Web Streams API

- [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
- [WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)
- [TransformStream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)

### URL Standard

- [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
- [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)

### Data Types

- [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [File](https://developer.mozilla.org/en-US/docs/Web/API/File)

### Data Encoding/Decoding API

- [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
- [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
- [btoa](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa)

### Web Crypto API

- [crypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

### Create variations of the implementation

- `createFetch`

`createFetch` allows you to create an API with some specific flags that are not available in the
actual API.

#### Limit the multipart form data size

This is useful if you parse the multipart request bodies with `.formData()`.

```ts
import { createFetch } from '@whatwg-node/fetch'

const fetchAPI = createFetch({
  formDataLimits: {
    // Maximum allowed file size (in bytes)
    fileSize: 1000000,
    // Maximum allowed number of files
    files: 10,
    // Maximum allowed size of content (operations, variables etc...)
    fieldSize: 1000000,
    // Maximum allowed header size for form data
    headerSize: 1000000
  }
})

// See how you can handle file uploads with Fetch API
http.createServer(async (req, res) => {
  const request = new Request(req)
  const formData = await request.formData()
  const file = formData.get('file')
  // ...
})
```
