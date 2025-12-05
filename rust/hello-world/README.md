---
name: Rust Hello World
slug: rust-hello-world
description: Simple Rust serverless functions demonstrating basic HTTP handling and performance benchmarks.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/rust/hello-world
demoUrl: https://rust-hello-world.vercel.dev
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/rust/hello-world&project-name=rust-hello-world&repository-name=rust-hello-world
publisher: Vercel
relatedTemplates:
  - rust-axum
---

# Rust Hello World

This example demonstrates how to create Rust serverless functions on Vercel with multiple endpoints showcasing different capabilities.

## Demo

https://rust-hello-world.vercel.app

## Project Structure

- `api/hello` - Basic handler with json response
- `api/streaming` - Streaming response example
- `api/realistic-math-bench` - Mathematical benchmark
- `api/slower-bench` - Performance benchmark
- `Cargo.toml` - Rust dependencies and multiple binary configurations

## Development

Clone the repository:

```bash
git clone https://github.com/vercel/examples.git
cd examples/rust/hello-world
```

Install Rust if you haven't already:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Test locally (requires Rust toolchain):

```bash
vc dev
```
