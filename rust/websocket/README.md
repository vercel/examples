---
name: Rust WebSocket
slug: rust-websocket
description: A Rust WebSocket server using the Axum framework on Vercel, demonstrating real-time bidirectional communication.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/rust/websocket
demoUrl: https://rust-websocket.vercel.dev
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/rust/websocket&project-name=rust-websocket&repository-name=rust-websocket
publisher: Vercel
relatedTemplates:
  - rust-axum
  - rust-hello-world
---

# Rust WebSocket

This example shows how to run a WebSocket server in Rust on Vercel using the
[Axum](https://github.com/tokio-rs/axum) framework. The Vercel Rust runtime
enables HTTP/1.1 upgrades, so axum's `WebSocketUpgrade` extractor works without
any extra configuration.

## How it works

`api/websocket.rs` serves an Axum router behind the `VercelLayer`:

- `GET /` — an interactive HTML page to connect and exchange messages.
- `GET /ws` — the WebSocket endpoint. The handler upgrades the connection and
  then runs two concurrent tasks over a single writer:
  - a **heartbeat** that pushes a `tick` event to the client every second
    (server-initiated messages), and
  - an **echo** loop that mirrors any message the client sends back to it
    (client-initiated messages).

A single writer task owns the WebSocket sink and is fed by an `mpsc` channel, so
both the heartbeat and echo loops can send frames without sharing the
non-clonable sink.

All server messages are JSON tagged with a `type` field (`welcome`, `echo`,
`tick`), which the front-end renders in the live log.

## Project Structure

- `api/websocket.rs` — Axum application with the WebSocket handler
- `index.html` — interactive WebSocket client (embedded via `include_str!`)
- `Cargo.toml` — Rust dependencies and binary configuration
- `vercel.json` — rewrites all routes to the function

## Development

Clone the repository:

```bash
git clone https://github.com/vercel/examples.git
cd examples/rust/websocket
```

Install Rust if you haven't already:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Test locally:

```bash
vc dev
```

Then open the printed URL, click **Connect**, and send a message. You'll see the
`welcome` event, periodic `tick` heartbeats, and your `echo` replies in the log.
