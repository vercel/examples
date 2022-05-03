# Edge Functions

## Build Output API

This Prebuilt Deployment example demonstrates how to output Vercel Edge Functions using the [Build Output API](https://vercel.com/docs/build-output-api/v3#vercel-primitives/edge-functions).

### Demo

https://build-output-api-edge-functions.vercel.sh

### How it Works

In this case, the contents of the Edge Function are located in the
[`.vercel/output/functions/index.func`](./.vercel/output/functions/index.func) directory,
meaning that the Edge Function will be accessible at the `/index` (or `/`) path of the Deployment.

The [`.vc-config.json`](./.vercel/output/functions/index.func/.vc-config.json) file specifies `"runtime": "edge"`
which informs Vercel that the endpoint should be created as an Edge Function.

The `"entrypoint": "index.js"` field indicates that the [`index.js`](.vercel/output/functions/index.func/index.js)
source code file will be the starting point of execution when the Edge Function is invoked.

Additional JavaScript or TypeScript source files may placed within the `index.func` directory as well.
They can export helper functions for the entrypoint to utilize, for example.
