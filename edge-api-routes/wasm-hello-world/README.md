# WASM Edge API Route (Experimental)

Build your API with Rust and WebAssembly using Vercel Edge Functions.

This example uses a simple Rust "hello world" example as an API route for Vercel Edge Functions.

## Demo

https://wasm-edge-api-route.vercel.app/api/wasm

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-api-routes/wasm-hello-world&project-name=wasm-edge-api-route&repository-name=wasm-edge-api-route)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/main/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/wasm-hello-world wasm-hello-world
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/wasm-hello-world wasm-hello-world
```

Install the Vercel CLI:

```bash
npm i -g vercel
```

Then run the app at the root of the repository:

```bash
vercel dev
```

