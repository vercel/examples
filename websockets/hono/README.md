# Hono WebSockets on Vercel

Minimal [Hono](https://hono.dev/) WebSocket example: one Hono app, one `/ws`
endpoint, and one HTML page that sends a message and renders the echoed response.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/websockets/hono&project-name=hono-websockets&repository-name=hono-websockets)

### Clone and Deploy

```bash
git clone https://github.com/vercel/examples/tree/main/websockets/hono
```

Install the dependencies:

```bash
pnpm install
```

Run the app locally:

```bash
pnpm dev
```

Open <http://localhost:3000>, send a message, and the server echoes it back.

## Project structure

```text
hono/
├── src/
│   └── server.ts      # Hono app with /ws echo endpoint
├── public/
│   └── index.html     # WebSocket client UI
├── tsconfig.json      # NodeNext ESM -> dist/
└── package.json
```

## Scripts

```bash
pnpm dev      # run src/server.ts directly with tsx
pnpm build    # tsc -> dist/
pnpm start    # node dist/server.js
```
