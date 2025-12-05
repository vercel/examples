---
name: Rust Axum
slug: rust-axum
description: A Rust web application using the Axum framework with streaming capabilities on Vercel.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/rust/axum
demoUrl: https://rust-axum.vercel.app
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/rust/axum&project-name=rust-axum&repository-name=rust-axum
publisher: Vercel
relatedTemplates:
  - rust-hello-world
---

# Rust Axum Web Framework

This example shows how to deploy a Rust web application using the Axum framework on Vercel with streaming capabilities.

## Demo

https://rust-axum.vercel.app

## Project Structure

- `api/axum.rs` - Main Axum application
  - `/` - Entrypoint with an interactive HTML interface for streaming
  - `/stream` - Streaming endpoint
  - `/users` - Post request endpoint
- `Cargo.toml` - Rust dependencies and binary configuration
- `vercel.json` - Vercel deployment configuration

## Development

Clone the repository:

```bash
git clone https://github.com/vercel/examples.git
cd examples/rust/axum
```

Install Rust if you haven't already:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Test locally:

```bash
vc dev
```
