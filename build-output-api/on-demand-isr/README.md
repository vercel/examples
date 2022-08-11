# On-Demand Incremental Static Regeneration (ISR)

## Build Output API

This Prebuilt Deployment example demonstrates how to implement "On-Demand Incremental Static Regeneration (ISR)" when using the [Build Output API](https://vercel.com/docs/build-output-api/v3).

### Demo

https://build-output-api-isr.vercel.sh

You'll be greeted with two sections: HTML Content and API Content. Both sections are examples of the same effect (On-Demand Incremental Static Regeneration) impleneted in the same way, just applied to different response types.

Note that the "Server Time" and "API Result" values stay the same after multiple refreshes, which means the cache is working.

Click on one of the "Revalidate" links to see the associated value update. After that, multiple refreshes will show the value was only updated once, then cached.

### How it Works

When using Prerender Functions, you may want to revalidate the cache for a specific path based on an event (On-Demand).

To revalidate a path to a Prerender Function, make a `GET` or `HEAD` request to that path with a header of `x-prerender-revalidate: <bypassToken>`. The `<bypassToken>` must match the value in that Prerender Function's `<name>.prerender-config.json` file.

In this demo, you can see this happening with two paths: `/` and `/data`.

- `/`
  - [bypassToken](./.vercel/output/functions/index.prerender-config.json#L4)
  - [trigger our custom revalidation handler](./.vercel/output/functions/index.func/index.js#L19)
  - [trigger the actual revalidation](./.vercel/output/functions/revalidate.func/index.js#L23)
- `/data`
  - [bypassToken](./.vercel/output/functions/data.prerender-config.json#L4)
  - [trigger our custom revalidation handler](./.vercel/output/functions/index.func/index.js#L29)
  - [trigger the actual revalidation](./.vercel/output/functions/revalidate.func/index.js#L23)

When the revalidation is triggered, the cache will be revalidated, bypassing any caching that Vercel would normally provide.

There is also an example of a blog that only generates new paths when triggered via On-Demand ISR with two initial posts that are prerendered.

- `/blog/[slug]`
  - base post prerender that allows generating news paths via On-Demand ISR
  - [bypassToken](./.vercel/output/functions/index.prerender-config.json#L4)
- `/blog/post-1`
- `/blog/post-2`
  - initial prerendered blog posts
  - [bypassToken](./.vercel/output/functions/index.prerender-config.json#L4)

### Security

#### `bypassToken`

This example uses the same static value for `bypassToken`, but that's for demo purposes only.

The `bypassToken` should be set to a randomized string that you generate at build-time. This string should not be exposed to users / the client-side, except under authenticated circumstances.

#### `authToken`

The `authToken` usage in this example is for demo purposes only. In a production system, please use best practices for securing access to anything that can trigger revalidation to avoid malicious usage.
