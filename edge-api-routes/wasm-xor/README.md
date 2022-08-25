# WASM Exclusive Or Example

Build your API with Rust and WebAssembly using Vercel Edge Functions.

This examples takes two 32-bit numbers as inputs (the `a` and `b` query parameters) and uses a WASM function written in Rust to exclusive or them.

## Demo

https://wasm-rust-xor.vercel.app/api/xor?a=0xac38b505&b=0x83ba94e4

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-api-routes/wasm-xor&project-name=wasm-xor&repository-name=wasm-xor)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/main/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/wasm-xor wasm-xor
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/wasm-xor wasm-xor
```

Install the Vercel CLI:

```bash
npm i -g vercel
```

Then run the app at the root of the repository:

```bash
vercel dev
```

## Building and running locally

To build and run this example locally, you'll need the following prerequisites:

1. [Rust](https://www.rust-lang.org/tools/install)
   The API Route for this example is written in Rust and requires the Rust toolchain to build.
2. [`wasm-pack`](https://github.com/rustwasm/wasm-pack)
   `wasm-pack` is a helpful utility that builds, optimizes and packages Rust into WebAssembly. This example uses it for the build and optimization step (although does not use it for packaging).
3. [Vercel CLI](https://vercel.com/docs/cli)
   The Vercel CLI lets you run this example locally.

To build the example:

```bash
(cd wasm && wasm-pack)
```

To run the example locally, start the development environment with the Vercel CLI:

```bash
vercel dev
```

