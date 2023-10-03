# Routes

## Build Output API

This Prebuilt Deployment example demonstrates how to output Vercel Routes using the [Build Output API](https://vercel.com/docs/build-output-api/v3#build-output-configuration/routes).

### Demo

https://build-output-api-routes.vercel.sh

### How it Works

Routing configuration is specified in the [`.vercel/output/config.json`](./.vercel/output/config.json) file under
the `routes` property.

In this case, there is a route that implements an HTTP redirect to https://example.com.

There are many more use-cases that routing configuration can solve as well.
