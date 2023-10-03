# WASM Edge API Route

Build your API with Rust and WebAssembly using Vercel Edge Functions.

This example uses a simple Rust "hello world" example as an API route for Vercel Edge Functions.

## Demo

https://wasm-rust-hello-world.vercel.app/api/wasm

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-api-routes/wasm-rust-hello-world&project-name=wasm-edge-api-route&repository-name=wasm-edge-api-route)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/main/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-api-routes/wasm-rust-hello-world wasm-rust-hello-world
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-api-routes/wasm-rust-hello-world wasm-rust-hello-world
```

To build and run the example locally, you'll need to install the following prerequisites:

1. [Rust](https://www.rust-lang.org/tools/install): The API Route for this example is written in Rust and requires the Rust toolchain to build.
2. [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/): is a helpful utility that builds, optimizes and packages Rust into WebAssembly. This example uses it for the build and optimization step (although it does not use it for packaging).

Then, install the Vercel CLI which you'll use to run the app:

```bash
npm i -g vercel
```

Run the app at the root of the repository:

```bash
vercel dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
