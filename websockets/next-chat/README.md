---
name: Next.js WebSockets Chat
slug: next-chat
description: Real-time chat over WebSockets, served by Next.js on Vercel.
framework: Next.js
useCase: Websockets
css: Tailwind
database: Redis (optional)
---

# Next.js + Native WebSockets on Vercel

A real-time chat room built with Next.js and WebSockets.

Out of the box it runs on a single instance in memory. Set a `REDIS_URL` and the
same code fans out across instances — shared broadcast, history, and presence.

Features: live messaging, presence ("N online"), join/leave notices, typing
indicators, and recent-history replay so newcomers don't land in a blank room.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/websockets/next-chat&project-name=next-chat&repository-name=next-chat)

### Clone and Deploy

```bash
git clone https://github.com/vercel/examples.git
cd examples/websockets/next-chat
```

Install the dependencies:

```bash
pnpm install
```

Run the app locally:

```bash
pnpm dev
```

`pnpm dev` runs the Vercel CLI (`vercel dev`) rather than the usual `next dev`,
since `experimental_upgradeWebSocket` needs the Vercel runtime to handle the
WebSocket `Upgrade` on `/api/ws` — the same path it takes in production. Open
<http://localhost:3000> in two browser tabs and chat between them.

Then deploy with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) — no configuration required.

## How it works

### Native WebSockets in a Route Handler

`app/api/ws/route.ts` is an ordinary `GET` handler that returns
`experimental_upgradeWebSocket(...)`. Vercel forwards the HTTP `Upgrade`, the
helper completes the handshake using the [`ws`](https://github.com/websockets/ws)
library, and hands back a single `WebSocket` that we register with the chat hub:

```ts
import { experimental_upgradeWebSocket } from "@vercel/functions";
import { ChatHub } from "@/lib/chat";

const hub = new ChatHub();

export function GET() {
  return experimental_upgradeWebSocket((ws) => hub.handleUpgrade(ws));
}
```

### One shared, typed protocol

Both ends import the same frame types from [`lib/protocol.ts`](./lib/protocol.ts) — a tagged union of JSON messages (`add user`, `new message`, `typing`, `presence`, …). Sharing the types is what keeps client and server in sync: a renamed field is a compile error, not a silent runtime mismatch.

On the client, [`useChatSocket`](./lib/useChatSocket.ts) connects with auto-reconnect (exponential backoff + jitter) and folds every incoming frame into UI state with a pure reducer.

### Scaling across instances (optional)

A single instance keeps sockets, history, and presence in memory, so they only reach clients on **that** instance. Under load Vercel may run several, and two users can land on different ones. Setting **`REDIS_URL`** fans everything out: broadcasts are published to a shared channel and relayed to every instance's sockets, while history and presence move to shared Redis structures.

This lives behind small `ChatStore` and `Broadcaster` interfaces ([`lib/chat/store`](./lib/chat/store), [`lib/chat/broadcast`](./lib/chat/broadcast)), so the hub never branches on whether Redis is configured. Provision Redis from the [Vercel Marketplace](https://vercel.com/marketplace) and set `REDIS_URL` in your project's environment variables.

## Environment variables

All optional — see [`.env.example`](./.env.example).

| Variable    | Description                                                            |
| ----------- | --------------------------------------------------------------------- |
| `REDIS_URL` | Enables cross-instance broadcast, shared history, and shared presence. |


## Project structure

```
next-chat/
├── app/
│   ├── api/ws/route.ts     # GET → experimental_upgradeWebSocket
│   ├── layout.tsx          # fonts + metadata
│   └── page.tsx            # renders <Chat />
├── components/             # Chat, Login, Header, MessageList, Composer, …
└── lib/
    ├── protocol.ts         # shared client/server frame types
    ├── chat/
    │   ├── index.ts        # ChatHub: connection lifecycle, dispatch, presence
    │   ├── store/          # recent history + presence (memory or Redis)
    │   └── broadcast/      # fan-out (local or Redis pub/sub)
    ├── useChatSocket.ts    # client hook: identity + socket + reducer
    ├── useReconnectingSocket.ts
    └── chatReducer.ts      # pure reducer: frames → UI state
```

## Note

`experimental_upgradeWebSocket` is **experimental**, and is only supported when deployed on Vercel or when using `vc dev`. 
