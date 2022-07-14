# Edge Middleware

## Build Output API

This Prebuilt Deployment example demonstrates how to output Vercel Middleware using the [Build Output API](https://vercel.com/docs/build-output-api/v3#features/edge-middleware).

### Demo

https://build-output-api-edge-middleware.vercel.sh

### How it Works

In this case, the contents of the Edge Middleware Function are located in the
[`.vercel/output/functions/_middleware.func`](./.vercel/output/functions/_middleware.func) directory.
An accompanying "route" is placed in the [`config.json`](./.vercel/output/config.json) file which
specifies that the middleware function will be invoked for every HTTP request due to the `"src": "/(.*)"` clause.

The [`.vc-config.json`](./.vercel/output/functions/_middleware.func/.vc-config.json) file specifies `"runtime": "edge"`
which informs Vercel that the endpoint should be created as an Edge Function.

The `"entrypoint": "index.js"` field indicates that the [`index.js`](.vercel/output/functions/_middleware.func/index.js)
source code file will export an Edge Middleware Function that processes each request.

The middleware function adds an HTTP response header for every HTTP request with `x-modified-edge: true`.
