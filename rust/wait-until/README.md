---
name: Rust waitUntil
slug: rust-wait-until
description: Run background work after the response is sent using waitUntil in the Vercel Rust runtime.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/rust/wait-until
demoUrl: https://rust-wait-until.vercel.app
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/rust/wait-until&project-name=rust-wait-until&repository-name=rust-wait-until
publisher: Vercel
relatedTemplates:
  - rust-hello-world
  - rust-axum
  - rust-websocket
---

# Rust waitUntil

This example demonstrates `waitUntil` support in the Vercel Rust runtime
(`vercel_runtime` 2.4.0+). `waitUntil` lets you schedule background work that
keeps running **after** the HTTP response has already been sent to the client —
the Rust analog of [`waitUntil`](https://vercel.com/docs/functions/functions-api-reference#waituntil)
in the Node.js runtime.

This is ideal for fire-and-forget side effects the client shouldn't have to wait
for, such as flushing analytics, warming a cache, sending a webhook, or writing
to a database.

Here, every request to `/api/wait-until` records itself — timestamp, method,
path, and user agent — into [Upstash Redis](https://upstash.com)
**after the response is sent**. The front-end then reads the last 10 records
from `/api/recent`.

## How it works

`api/wait-until.rs` defines a handler that receives the runtime's `AppState`.
`AppState::wait_until` registers a future that is:

1. **Spawned immediately**, so it makes progress between requests.
2. **Decoupled from the response** — the handler returns right away and the
   client gets its response without waiting for the background task.
3. **Drained at process shutdown** (bounded by a 30s timeout), matching the
   Node.js runtime's behavior. A panic in the background task is isolated and
   never affects the response or other background work.

```rust
// Capture request details before moving into the background task.
let record = json!({ "timestamp": ts, "method": method, "path": path, ... });

state.wait_until(async move {
    // Runs after the response has been sent. The client never waits for this.
    if let Err(e) = store_request(&record).await {
        eprintln!("[waitUntil] Failed to store request record: {e}");
    }
});
```

The write uses the Upstash REST `/pipeline` endpoint to run `LPUSH` followed by
`LTRIM key 0 9`, keeping only the 10 most recent records (newest first).

`api/recent.rs` reads them back with `LRANGE key 0 9` using the **read-only**
token and returns them as JSON for the front-end to render.

## Data flow

1. `GET /api/wait-until` → responds immediately, schedules the Redis write via
   `waitUntil`.
2. Background task → `LPUSH` + `LTRIM` to Upstash (write token).
3. `GET /api/recent` → `LRANGE` the last 10 records (read-only token).
4. `index.html` → "Fire a request", then renders the recent list.

## Logging from background work

The example logs from the background task with `println!`/`eprintln!`
(stdout/stderr) rather than the request-scoped `state.log_context`. This is
intentional:

- `log_context` attaches each line to the **current invocation's** id.
- The runtime sends the per-request `end` message as soon as the handler returns
  the response, which closes that invocation's log stream.
- `waitUntil` work is drained **later** (at process shutdown, bounded by a 30s
  timeout). By then the originating request context is closed, so a
  `log_context` line emitted from the background task would not be attributed to
  the request and may be dropped.

stdout/stderr is captured independently of request context, so it reliably shows
up in the function logs — making the background work observable. Use
`log_context` for synchronous, in-handler logging and `println!`/`eprintln!`
(or an external sink like a database/Blob) for `waitUntil` work.

## Project Structure

- `api/wait-until.rs` — records the request to Upstash in the background via `waitUntil`
- `api/recent.rs` — reads the last 10 records back with the read-only token
- `index.html` — fires requests and renders the recent list
- `Cargo.toml` — Rust dependencies and binary configuration
- `vercel.json` — Vercel project configuration

## Environment variables

This example uses an Upstash Redis (Vercel KV) database. Add the integration
from the Vercel dashboard, or set these variables on your project:

| Variable                      | Used by              | Purpose                          |
| ----------------------------- | -------------------- | -------------------------------- |
| `KV_REST_API_URL`             | both endpoints       | Upstash REST base URL            |
| `KV_REST_API_TOKEN`           | `/api/wait-until`    | Read/write token (writes records)|
| `KV_REST_API_READ_ONLY_TOKEN` | `/api/recent`        | Read-only token (reads records)  |

For local development, copy these into a `.env.local` file (gitignored).

## Development

Clone the repository:

```bash
git clone https://github.com/vercel/examples.git
cd examples/rust/wait-until
```

Install Rust if you haven't already:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Pull your project's environment variables (or create `.env.local` manually):

```bash
vercel env pull .env.local
```

Test locally:

```bash
vc dev
```

Open the printed URL, click **Fire a request**, and watch the recent list
update. The response returns instantly while the record is written to Upstash in
the background.
