# Express + Socket.IO on Vercel

Minimal [Socket.IO](https://socket.io) example: an Express server and a single HTML
page that connect over a WebSocket and do a send → echo → render
round-trip.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/solutions/express-socketio&project-name=express-socketio&repository-name=express-socketio)

### Clone and Deploy

```bash
git clone https://github.com/vercel/examples/tree/main/solutions/express-socketio
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
