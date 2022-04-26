# Edge Middleware

### Build Output API

This Prebuilt Deployment example demonstrates how to output Vercel Middleware using the [Build Output API](https://vercel.com/docs/build-output-api/v3#features/edge-middleware).

In this case, the contents of the Edge Middleware Function are located in the
[`.vercel/output/functions/_middleware.func`](./.vercel/output/functions/_middleware.func) directory,
and an accompanying "route" is placed in the [`config.json`](./.vercel/output/config.json) file which
specifies that the middleware function will be invoked for every HTTP request due to the `"src": "/(.\*)" clause.

The middleware function adds an HTTP response header for every HTTP request with `x-modified-edge: true`.
