# Nitro + Vercel WebSockets Starter

[![Nitro](https://img.shields.io/badge/Nitro-black?logo=nitrojs&logoColor=FECE00)](https://nitro.build)

Minimal **realtime** starter built with **[Nitro v3](https://nitro.build)**, **React**, **[shadcn/ui](https://ui.shadcn.com)** (on [Base UI](https://base-ui.com) primitives), and the [Vercel Functions WebSockets beta](https://vercel.com/docs/functions/websockets). Move your cursor and everyone in the room sees it live — presence, cursors, and emoji reactions over a single WebSocket connection. No auth, no client SDK.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fwebsockets%2Fnitro&project-name=nitro-websockets&repository-name=nitro-websockets)

No environment variables and no external services — the realtime layer runs entirely on native WebSocket pub/sub (see [How it works](#how-it-works)).

## Run locally

```bash
npx giget@latest gh:vercel/examples/websockets/nitro my-realtime-app
cd my-realtime-app
pnpm install
pnpm dev
```

Open `http://localhost:3000` in two browser tabs (or share the URL) to see live cursors, presence, and reactions.

## How it works

A Vercel Function can accept a WebSocket upgrade and keep a bidirectional connection open. Nitro v3 ships **native WebSocket support** powered by [crossws](https://crossws.h3.dev), enabled with a single flag:

```ts
// vite.config.ts
nitro({ features: { websocket: true } })
```

The headline: **one transport, every environment.** The same [`defineWebSocketHandler`](server/api/ws.ts) at `/api/ws` powers local dev _and_ production — locally through Nitro's dev server, on Vercel through the preset's `crossws/adapters/vercel` bridge, which hands the handler the runtime's socket upgrade. There's no Vercel-specific code path and no `experimental_upgradeWebSocket` bridge to maintain.

All room logic lives in the [handler](server/api/ws.ts) itself.

### State and pub/sub

Each connection subscribes to a single `room` topic. Cursor moves, reactions, and join/leave events are broadcast with crossws's native [`peer.publish`](server/api/ws.ts) — no external store and no client SDK. The connected roster is held in memory and replayed to each client in the `welcome` frame on connect, so a reconnect rebuilds it from scratch.

## Architecture

```
app/                        # React SPA (Vite)
├── App.tsx                 # page composition
├── hooks/use-realtime.ts   # connection, reconnect, heartbeat
├── components/             # LiveCanvas, Cursor, PresenceBar, HeroBackdrop
└── components/ui/          # shadcn/ui primitives (Base UI)

shared/
└── types/realtime.ts       # ClientMessage / ServerMessage / Peer — the wire protocol

server/
├── api/ws.ts               # /api/ws — native WebSocket handler + room pub/sub
└── utils/
    └── identity.ts         # anonymous identity (name + color) per connection
```

The frontend and the Nitro server are wired together by the [`nitro/vite`](https://nitro.build) plugin: `index.html` is served as the SPA renderer for all unmatched routes, and `server/` routes (like `/api/ws`) are matched first.

## Reconnects

WebSocket connections close when a Vercel Function reaches its [maximum duration](https://vercel.com/docs/functions/limitations#max-duration). The client reconnects with exponential backoff and reloads the roster from the `welcome` frame on each new connection — see `use-realtime.ts`.

A lightweight heartbeat (`ping`/`pong`) runs over the same socket so the client can detect a half-open connection (a missed pong) and force a reconnect. On disconnect, the server's `close`/`error` handlers publish a `leave` frame so the peer drops from everyone's roster.

## Adapting this starter

- **Identity** — swap the anonymous name/color in `server/utils/identity.ts` for your authenticated user.
- **New message types** — add a variant to `ClientMessage` / `ServerMessage` in `shared/types/realtime.ts`, then handle it in the handler `server/api/ws.ts`. The types are shared, so the client and server stay in sync.
- **Rooms** — key the topic by a room id to isolate multiple rooms. Nitro also derives a pub/sub [namespace](https://nitro.build/docs/websocket#namespaces) from the connection path, so per-room routes work out of the box.
- **More components** — the UI primitives are [shadcn/ui](https://ui.shadcn.com) built on [Base UI](https://base-ui.com). Copy more from the [Base UI component docs](https://ui.shadcn.com/docs/components/base/button), or scaffold a fresh project with `pnpm dlx shadcn@latest init -b base` to generate them.

## Links

- [Vercel WebSockets docs](https://vercel.com/docs/functions/websockets)
- [Nitro WebSocket docs](https://nitro.build/docs/websocket)
- [Nitro Vite plugin](https://nitro.build/docs/quick-start)
- [shadcn/ui](https://ui.shadcn.com)
- [Base UI](https://base-ui.com)

## License

Published under the [MIT](https://github.com/vercel/examples/blob/main/license.md) license.
