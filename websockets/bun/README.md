# Bun WebSockets on Vercel

Minimal native [Bun](https://bun.com/) WebSocket example: one `Bun.serve()`
server, one `/ws` endpoint, and one HTML page that sends a message and renders
the echoed response.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/websockets/bun&project-name=bun-websockets&repository-name=bun-websockets)

### Clone and Deploy

```bash
git clone https://github.com/vercel/examples/tree/main/websockets/bun
```

Install the dependencies:

```bash
bun install
```

Run the app locally:

```bash
bun dev
```

Open <http://localhost:3000>, send a message, and the server echoes it back.

## Project structure

```text
bun/
├── public/
│   └── index.html     # WebSocket client UI
├── bun.lock           # Bun framework preset detection and dependencies
├── server.ts          # Bun server with /ws echo endpoint
├── tsconfig.json
├── vercel.json        # Enables Bun and includes the client in the function
└── package.json
```

## Scripts

```bash
bun dev          # run server.ts with hot reload
bun start        # run server.ts
bun type-check   # check TypeScript types
```

The `bun.lock` file and root `server.ts` let Vercel detect the Bun framework
preset. The `bunVersion` setting in `vercel.json` runs the Vercel Function with
the Bun runtime.
