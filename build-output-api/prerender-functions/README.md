# Prerender Functions

## Build Output API

This Prebuilt Deployment example demonstrates how to output Vercel Serverless Functions that leverage the "prerender" feature using the [Build Output API](https://vercel.com/docs/build-output-api/v3#vercel-primitives/prerender-functions).

### Demo

https://build-output-api-prerender-functions.vercel.sh

### How it Works

In this example, the Prerender function renders blog posts from an imaginary CMS "backend service". There are a few "popular" blog posts that are prerendered at build-time and placed into the `static` directory.

A Prerender function is a Serverless Function, in this case located at
[`.vercel/output/functions/blog/page.func`](./.vercel/output/functions/blog/page.func), with an additional configuration file
located alongside the `.func` directory, in this case [`.vercel/output/functions/blog/page.prerender-config.json`](./.vercel/output/functions/blog/page.prerender-config.json).

There is also a "route" in `config.json` that will direct all HTTP requests under the `/blog/*` prefix to invoke the Prerender Function.

The optional "fallback" file is also included, which will be served for blog posts that have not yet been rendered.
