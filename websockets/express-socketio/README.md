# Express + Socket.IO on Vercel

Minimal [Socket.IO](https://socket.io) example: an Express server and a single HTML
page that connect over a WebSocket and do a send → echo → render
round-trip.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/websockets/express-socketio&project-name=express-socketio&repository-name=express-socketio)

### Clone and Deploy

```bash
git clone https://github.com/vercel/examples/tree/main/websockets/express-socketio
```

Install the dependencies:

```bash
pnpm install
```

Run the app locally:

```bash
pnpm dev
```

Open <http://localhost:3000>: the status pill turns green, and anything you send is
echoed back by the server and rendered in the list.

## Project structure

```
express-socketio/
├── src/
│   └── server.ts      # Express + Socket.IO server; serves public/, echoes messages
├── public/
│   └── index.html     # connection status + input; loads /socket.io/socket.io.js
├── tsconfig.json      # NodeNext ESM → dist/
└── package.json
```

## Scripts

```bash
pnpm dev      # run src/server.ts directly with tsx (no build)
pnpm build    # tsc → dist/
pnpm start    # node dist/server.js
```

## Transport configuration

The client connects with the WebSocket transport forced on:

```js
const socket = io({ transports: ['websocket'] })
```

By default Socket.IO doesn't open a WebSocket right away. It first connects over
**HTTP long-polling** — a series of plain HTTP requests that establish a session
(`sid`) — and only then upgrades to a WebSocket. That session lives in memory on the
**specific instance** that handled the first request, so every follow-up polling
request has to come back to that same instance. Routing requests for a given session
to one backend is called **sticky sessions**.

Your Vercel function can run on multiple instances, and consecutive requests aren't
guaranteed to hit the same one. So the polling handshake breaks — the session is
created on instance A, the next poll lands on instance B, which has never seen that
`sid`, and the connection errors out.

Forcing `transports: ['websocket']` skips the polling phase entirely. A WebSocket is
established with a single HTTP `Upgrade` request and then stays as **one long-lived
connection pinned to one instance** for its lifetime — there are no follow-up requests
that could be routed elsewhere, so no stickiness is needed.
