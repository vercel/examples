# On-demand Incremental Static Regeneration (ISR)

## Build Output API

This Prebuilt Deployment example demonstrates how to implement "On-demand Incremental Static Regeneration (ISR)" when using the [Build Output API](https://vercel.com/docs/build-output-api/v3).

### Demo

https://build-output-api-isr-revalidation.vercel.sh

### How it Works

When using Prerender Functions, you may want to revalidate the cache for a specific path.

To implement this, the `bypassToken` of the [`<name>.prerender-config.json`](./.vercel/output/config/index.prerender-config.json) file should be set to a randomized string that you generate at build-time. This string should not be exposed to users / the client-side, except under authenticated circumstances.

To revalidate a path to a Prerender Function, make a `GET` request to that path with a header of `x-prerender-revalidate: <bypassToken>`. A `HEAD` request will not work. When that Prerender Function endpoint is accessed with this header set, the cache will be revalidated, bypassing any caching that Vercel would normally provide.
