---
name: Rust Hello World
slug: rust-hello-world
description: Simple Rust serverless functions demonstrating basic HTTP handling and performance benchmarks.
framework: Other
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/rust/hello-world&project-name=rust-hello-world&repository-name=rust-hello-world
relatedTemplates:
  - rust-axum
---

# Rust Hello World

This example demonstrates how to create Rust serverless functions on Vercel with multiple endpoints showcasing different capabilities.

## Demo

https://rust-hello-world.vercel.app

## Features

- Basic HTTP request handling with Rust
- Multiple serverless function endpoints
- Streaming response example
- Performance benchmark demonstrations
- Optimized for serverless deployment on Vercel

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/rust/hello-world&project-name=rust-hello-world&repository-name=rust-hello-world)

### Clone and Deploy

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

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=rust-examples) ([Documentation](https://vercel.com/docs/functions/serverless-functions/runtimes/rust)).

## Available Endpoints

- `/api/hello` - Simple json response
- `/api/streaming` - Demonstrates streaming response
- `/api/realistic-math-bench` - Mathematical computation benchmark
- `/api/slower-bench` - Performance benchmark

## Project Structure

- `api/hello.rs` - Basic handler
- `api/streaming.rs` - Streaming response example
- `api/realistic-math-bench.rs` - Mathematical benchmark
- `api/slower-bench.rs` - Performance benchmark
- `Cargo.toml` - Rust dependencies and multiple binary configurations
