---
name: Rust Axum Web Framework
slug: rust-axum
description: A Rust web application using the Axum framework with streaming capabilities on Vercel.
framework: Axum
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/rust/axum&project-name=rust-axum&repository-name=rust-axum
relatedTemplates:
  - rust-hello-world
---

# Rust Axum Web Framework

This example shows how to deploy a Rust web application using the Axum framework on Vercel with streaming capabilities.

## Demo

https://rust-axum.vercel.app

## Features

- Streaming response example
- Post request example
- Streaming demo on root page

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/rust/axum&project-name=rust-axum&repository-name=rust-axum)

### Clone and Deploy

Clone the repository:

```bash
git clone https://github.com/vercel/examples.git
cd examples/rust/axum
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

## Project Structure

- `api/axum.rs` - Main Axum application with streaming endpoint
- `Cargo.toml` - Rust dependencies and binary configuration
- `vercel.json` - Vercel deployment configuration

The application includes:

- A home route (`/`) with an interactive HTML interface for streaming
- A streaming endpoint (`/stream`)
- A post request endpoint (`/users`)
- A fallback handler for unmatched routes
