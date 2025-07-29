[![npm version](https://img.shields.io/npm/v/@netlify/serverless-functions-api.svg)](https://npmjs.org/package/@netlify/serverless-functions-api)
[![Build](https://github.com/netlify/serverless-functions-api/workflows/Build/badge.svg)](https://github.com/netlify/serverless-functions-api/actions)
[![Node](https://img.shields.io/node/v/@netlify/serverless-functions-api.svg?logo=node.js)](https://www.npmjs.com/package/@netlify/serverless-functions-api)

# Serverless Functions API

A Node.js module that implements the runtime API for serverless functions. It translates between the API defined by Netlify and the API expected by the underlying provider, AWS Lambda.

## The API

The API surface is quite minimal: functions are comprised of handlers that receive a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) and return a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response), using the default export.

```js
export default async (req) => new Response(`Responding to ${req.url}`)
```

## The module

The module exports a `getLambdaHandler` function that returns a Lambda-compatible handler. This handler receives a Lambda event, converts it to a Netlify API input (i.e. an instance of the standard `Request` and a `context` object), executes the function, and converts the result back into a response compatible with the Lambda API.

The source is bundled into a single file, so that it can be injected into a Lambda without any additional imports or dependencies.

The `getPath` export returns the absolute path to the module. This lets consumers like `zip-it-and-ship-it` easily include the file in a ZIP.
