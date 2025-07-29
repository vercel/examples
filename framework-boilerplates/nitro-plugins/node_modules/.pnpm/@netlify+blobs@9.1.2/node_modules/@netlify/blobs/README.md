[![Build](https://github.com/netlify/blobs/workflows/Build/badge.svg)](https://github.com/netlify/blobs/actions)
[![Node](https://img.shields.io/node/v/@netlify/blobs.svg?logo=node.js)](https://www.npmjs.com/package/@netlify/blobs)

# @netlify/blobs

A TypeScript client for Netlify Blobs.

## Installation

You can install `@netlify/blobs` via npm:

```shell
npm install @netlify/blobs
```

### Requirements

- Deno 1.30 and above or Node.js 16.0.0 and above

## Usage

To start reading and writing data, you must first get a reference to a store using the `getStore` method.

This method takes an options object that lets you configure the store for different access modes.

### Environment-based configuration

Rather than explicitly passing the configuration context to the `getStore` method, it can be read from the execution
environment. This is particularly useful for setups where the configuration data is held by one system and the data
needs to be accessed in another system, with no direct communication between the two.

To do this, the system that holds the configuration data should set a global variable called `netlifyBlobsContext` or an
environment variable called `NETLIFY_BLOBS_CONTEXT` with a Base64-encoded, JSON-stringified representation of an object
with the following properties:

- `apiURL` (optional) or `edgeURL`: URL of the Netlify API (for [API access](#api-access)) or the edge endpoint (for
  [Edge access](#edge-access))
- `token`: Access token for the corresponding access mode
- `siteID`: ID of the Netlify site

This data is automatically populated by Netlify in the execution environment for both serverless and edge functions.

With this in place, the `getStore` method can be called just with the store name. No configuration object is required,
since it'll be read from the environment.

```ts
import { getStore } from '@netlify/blobs'

const store = getStore('my-store')

console.log(await store.get('my-key'))
```

#### Lambda compatibility mode

The environment is not configured automatically when running functions in the
[Lambda compatibility mode](https://docs.netlify.com/functions/lambda-compatibility). To use Netlify Blobs, you must
initialize the environment manually by calling the `connectLambda` method with the Lambda event as a parameter.

You should call this method immediately before calling `getStore` or `getDeployStore`.

```ts
import { connectLambda, getStore } from '@netlify/blobs'

export const handler = async (event) => {
  connectLambda(event)

  const store = getStore('my-store')
  const value = await store.get('my-key')

  return {
    statusCode: 200,
    body: value,
  }
}
```

### API access

You can interact with the blob store through the [Netlify API](https://docs.netlify.com/api/get-started). This is the
recommended method if you're looking for a strong-consistency way of accessing data, where latency is not mission
critical (since requests will always go to a non-distributed origin).

Create a store for API access by calling `getStore` with the following parameters:

- `name` (string): Name of the store
- `siteID` (string): ID of the Netlify site
- `token` (string): [Personal access token](https://docs.netlify.com/api/get-started/#authentication) to access the
  Netlify API
- `apiURL` (string): URL of the Netlify API (optional, defaults to `https://api.netlify.com`)

```ts
import { getStore } from '@netlify/blobs'

const store = getStore({
  name: 'my-store',
  siteID: 'MY_SITE_ID',
  token: 'MY_TOKEN',
})

console.log(await store.get('some-key'))
```

### Edge access

You can also interact with the blob store using a distributed network that caches entries at the edge. This is the
recommended method if you're looking for fast reads across multiple locations, knowing that reads will be
eventually-consistent with a drift of up to 60 seconds.

Create a store for edge access by calling `getStore` with the following parameters:

- `name` (string): Name of the store
- `siteID` (string): ID of the Netlify site
- `token` (string): Access token to the edge endpoint
- `edgeURL` (string): URL of the edge endpoint

```ts
import { Buffer } from 'node:buffer'

import { getStore } from '@netlify/blobs'

// Serverless function using the Lambda compatibility mode
export const handler = async (event) => {
  const rawData = Buffer.from(event.blobs, 'base64')
  const data = JSON.parse(rawData.toString('ascii'))
  const store = getStore({
    edgeURL: data.url,
    name: 'my-store',
    token: data.token,
    siteID: 'MY_SITE_ID',
  })
  const item = await store.get('some-key')

  return {
    statusCode: 200,
    body: item,
  }
}
```

### Deploy scope

By default, stores exist at the site level, which means that data can be read and written across different deploys and
deploy contexts. Users are responsible for managing that data, since the platform doesn't have enough information to
know whether an item is still relevant or safe to delete.

But sometimes it's useful to have data pegged to a specific deploy, and shift to the platform the responsibility of
managing that data — keep it as long as the deploy is around, and wipe it if the deploy is deleted.

You can opt-in to this behavior by creating the store using the `getDeployStore` method.

```ts
import { assert } from 'node:assert'

import { getDeployStore } from '@netlify/blobs'

// Using API access
const store1 = getDeployStore({
  deployID: 'MY_DEPLOY_ID',
  token: 'MY_API_TOKEN',
})

await store1.set('my-key', 'my value')

// Using environment-based configuration
const store2 = getDeployStore()

assert.equal(await store2.get('my-key'), 'my value')
```

### Custom `fetch`

The client uses [the web platform `fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make HTTP
calls. By default, it will use any globally-defined instance of `fetch`, but you can choose to provide your own.

You can do this by supplying a `fetch` property to the `getStore` method.

```ts
import { fetch } from 'whatwg-fetch'

import { getStore } from '@netlify/blobs'

const store = getStore({
  fetch,
  name: 'my-store',
})

console.log(await store.get('my-key'))
```

## Store API reference

### `get(key: string, { type?: string }): Promise<any>`

Retrieves an object with the given key.

Depending on the most convenient format for you to access the value, you may choose to supply a `type` property as a
second parameter, with one of the following values:

- `arrayBuffer`: Returns the entry as an
  [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- `blob`: Returns the entry as a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- `json`: Parses the entry as JSON and returns the resulting object
- `stream`: Returns the entry as a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
- `text` (default): Returns the entry as a string of plain text

If an object with the given key is not found, `null` is returned.

```javascript
const entry = await store.get('some-key', { type: 'json' })

console.log(entry)
```

### `getWithMetadata(key: string, { etag?: string, type?: string }): Promise<{ data: any, etag: string, metadata: object }>`

Retrieves an object with the given key, the [ETag value](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
for the entry, and any metadata that has been stored with the entry.

Depending on the most convenient format for you to access the value, you may choose to supply a `type` property as a
second parameter, with one of the following values:

- `arrayBuffer`: Returns the entry as an
  [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- `blob`: Returns the entry as a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- `json`: Parses the entry as JSON and returns the resulting object
- `stream`: Returns the entry as a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
- `text` (default): Returns the entry as a string of plain text

If an object with the given key is not found, `null` is returned.

```javascript
const blob = await store.getWithMetadata('some-key', { type: 'json' })

console.log(blob.data, blob.etag, blob.metadata)
```

The `etag` input parameter lets you implement conditional requests, where the blob is only returned if it differs from a
version you have previously obtained.

```javascript
// Mock implementation of a system for locally persisting blobs and their etags
const cachedETag = getFromMockCache('my-key')

// Get entry from the blob store only if its ETag is different from the one you
// have locally, which means the entry has changed since you last obtained it
const { data, etag } = await store.getWithMetadata('some-key', { etag: cachedETag })

if (etag === cachedETag) {
  // `data` is `null` because the local blob is fresh
} else {
  // `data` contains the new blob, store it locally alongside the new ETag
  writeInMockCache('my-key', data, etag)
}
```

### `getMetadata(key: string, { etag?: string, type?: string }): Promise<{ etag: string, metadata: object }>`

Retrieves any metadata associated with a given key and its
[ETag value](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag).

If an object with the given key is not found, `null` is returned.

This method can be used to check whether a key exists without having to actually retrieve it and transfer a
potentially-large blob.

```javascript
const blob = await store.getMetadata('some-key')

console.log(blob.etag, blob.metadata)
```

### `set(key: string, value: ArrayBuffer | Blob | string, { metadata?: object }): Promise<void>`

Creates an object with the given key and value.

If an entry with the given key already exists, its value is overwritten.

```javascript
await store.set('some-key', 'This is a string value')
```

### `setJSON(key: string, value: any, { metadata?: object }): Promise<void>`

Convenience method for creating a JSON-serialized object with the given key.

If an entry with the given key already exists, its value is overwritten.

```javascript
await store.setJSON('some-key', {
  foo: 'bar',
})
```

### `delete(key: string): Promise<void>`

Deletes an object with the given key, if one exists. The return value is always `undefined`, regardless of whether or
not there was an object to delete.

```javascript
await store.delete('my-key')
```

### `list(options?: { directories?: boolean, paginate?: boolean. prefix?: string }): Promise<{ blobs: BlobResult[], directories: string[] }> | AsyncIterable<{ blobs: BlobResult[], directories: string[] }>`

Returns a list of blobs in a given store.

```javascript
const { blobs } = await store.list()

// [ { etag: 'etag1', key: 'some-key' }, { etag: 'etag2', key: 'another-key' } ]
console.log(blobs)
```

To filter down the entries that should be returned, an optional `prefix` parameter can be supplied. When used, only the
entries whose key starts with that prefix are returned.

```javascript
const { blobs } = await store.list({ prefix: 'some' })

// [ { etag: 'etag1', key: 'some-key' } ]
console.log(blobs)
```

Optionally, you can choose to group blobs together under a common prefix and then browse them hierarchically when
listing a store, just like grouping files in a directory. To do this, use the `/` character in your keys to group them
into directories.

Take the following list of keys as an example:

```
cats/garfield.jpg
cats/tom.jpg
mice/jerry.jpg
mice/mickey.jpg
pink-panther.jpg
```

By default, calling `store.list()` will return all five keys.

```javascript
const { blobs } = await store.list()

// [
//   { etag: "etag1", key: "cats/garfield.jpg" },
//   { etag: "etag2", key: "cats/tom.jpg" },
//   { etag: "etag3", key: "mice/jerry.jpg" },
//   { etag: "etag4", key: "mice/mickey.jpg" },
//   { etag: "etag5", key: "pink-panther.jpg" },
// ]
console.log(blobs)
```

But if you want to list entries hierarchically, use the `directories` parameter.

```javascript
const { blobs, directories } = await store.list({ directories: true })

// [ { etag: "etag1", key: "pink-panther.jpg" } ]
console.log(blobs)

// [ "cats", "mice" ]
console.log(directories)
```

To drill down into a directory and get a list of its items, you can use the directory name as the `prefix` value.

```javascript
const { blobs, directories } = await store.list({ directories: true, prefix: 'cats/' })

// [ { etag: "etag1", key: "cats/garfield.jpg" }, { etag: "etag2", key: "cats/tom.jpg" } ]
console.log(blobs)

// [ ]
console.log(directories)
```

Note that we're only interested in entries under the `cats` directory, which is why we're using a trailing slash.
Without it, other keys like `catsuit` would also match.

For performance reasons, the server groups results into pages of up to 1,000 entries. By default, the `list()` method
automatically retrieves all pages, meaning you'll always get the full list of results.

If you'd like to handle this pagination manually, you can supply the `paginate` parameter, which makes `list()` return
an [`AsyncIterator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator).

```javascript
const blobs = []

for await (const entry of store.list({ paginate: true })) {
  blobs.push(...entry.blobs)
}

// [
//   { etag: "etag1", key: "cats/garfield.jpg" },
//   { etag: "etag2", key: "cats/tom.jpg" },
//   { etag: "etag3", key: "mice/jerry.jpg" },
//   { etag: "etag4", key: "mice/mickey.jpg" },
//   { etag: "etag5", key: "pink-panther.jpg" },
// ]
console.log(blobs)
```

## Server API reference

We provide a Node.js server that implements the Netlify Blobs server interface backed by the local filesystem. This is
useful if you want to write automated tests that involve the Netlify Blobs API without interacting with a live store.

The `BlobsServer` export lets you construct and initialize a server. You can then use its address to initialize a store.

```ts
import { BlobsServer, getStore } from '@netlify/blobs'

// Choose any token for protecting your local server from
// extraneous requests
const token = 'some-token'

// Create a server by providing a local directory where all
// blobs and metadata should be persisted
const server = new BlobsServer({
  directory: '/path/to/blobs/directory',
  port: 1234,
  token,
})

await server.start()

// Get a store and provide the address of the local server
const store = getStore({
  edgeURL: 'http://localhost:1234',
  name: 'my-store',
  token,
})

await store.set('my-key', 'This is a local blob')

console.log(await store.get('my-key'))
```

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or
submit a pull request on the [GitHub repository](https://github.com/example/netlify-blobs).

## License

Netlify Blobs is open-source software licensed under the
[MIT license](https://github.com/example/netlify-blobs/blob/main/LICENSE).
