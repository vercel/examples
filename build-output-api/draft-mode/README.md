# Draft Mode

## Build Output API

This Prebuilt Deployment example demonstrates how to implement "Draft Mode" when using the [Build Output API](https://vercel.com/docs/build-output-api/v3#features/draft-mode).

### Demo

https://build-output-api-draft-mode.vercel.sh

### How it Works

When using Prerender Functions, you may want to implement "Draft Mode" which would allow you to bypass the caching
aspect of prerender functions, i.e. while writing draft blog posts before they are ready to be published.

To implement this, the `bypassToken` of the [`<name>.prerender-config.json`](./.vercel/output/functions/index.prerender-config.json) file should be set to a randomized string that you generate at build-time. This string should not be exposed to users / the client-side, except under authenticated circumstances.

To enable "Draft Mode", a cookie with the name `__prerender_bypass` needs to be set (i.e. by a Serverless Function) with the value of the `bypassToken`. When the Prerender Function endpoint is accessed while the cookie is set, then "Draft Mode" will be activated, bypassing any caching that Vercel would normally provide when not in Draft Mode.
