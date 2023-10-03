# Static File Overrides

## Build Output API

This Prebuilt Deployment example demonstrates how to override configuration of static files in a Deployment using the [Build Output API](https://vercel.com/docs/build-output-api/v3#vercel-primitives/static-files).

### Demo

https://build-output-api-overrides.vercel.sh

### How it Works

The [`.vercel/output/static`](./.vercel/output/static) directory contains static files, _however_ due to the "overrides"
property in the [`.vercel/output/config.json`](./.vercel/output/config.json) file, these files are _served_ by Vercel
at different URL paths and/or with a different `Content-Type` header.

Specifically:

- `/something-else`: serves "another.html"
- `/another.html`: 404s
- `/data`: serves the "data" file with `Content-Type: application/json`

This could similarly be achieved with "routes" configuration, but when possible it is better to use "overrides" because
they are implemented at a lower level than routes and don't count towards the total routes limit.
