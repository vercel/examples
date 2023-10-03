# Image Optimization

## Build Output API

This Prebuilt Deployment example demonstrates how leverage the [Vercel Image Optimization](https://vercel.com/docs/concepts/image-optimization) platform feature using the [Build Output API](https://vercel.com/docs/build-output-api/v3#build-output-configuration/images).

### Demo

https://build-output-api-image-optimization.vercel.sh

### How it Works

- The [`.vercel/output/static`](./.vercel/output/static) directory contains some (unoptimized) static image files, and an `index.html` page.
- The [`.vercel/output/config.json`](./.vercel/output/config.json) file contains the "images" property which configures the Image Optimization feature.

The images can be served by the Image Optimization feature via the `GET /_vercel/image/**` endpoint.
