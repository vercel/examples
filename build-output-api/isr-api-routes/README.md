# On-Demand ISR for API Routes

## Build Output API

This Prebuilt Deployment example demonstrates how to implement "On-Demand Incremental Static Regeneration (ISR)" for API (non-page) Routes when using the [Build Output API](https://vercel.com/docs/build-output-api/v3).

### Demo

https://build-output-api-isr-api-routes.vercel.sh

### How it Works

When using Serverless Functions that return data (not HTML), you can still take advantage of On-Demand Incremental Static Regeneration (ISR).

To implement this, the `bypassToken` of the [`<name>.prerender-config.json`](./.vercel/output/config/data.prerender-config.json) file should be set to a randomized string that you generate at build-time. This string should not be exposed to users / the client-side, except under authenticated circumstances.

To revalidate the API Route, make a `GET` request to that path with a header of `x-prerender-revalidate: <bypassToken>`. A `HEAD` request will not work. When that API Route is accessed with this header set, the cache will be revalidated, bypassing any caching that Vercel would normally provide.
