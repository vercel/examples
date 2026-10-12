---
name: Next.js Tarot Reading Starter
slug: nextjs-tarot-reading-starter
description: Build random card draws, three-card spreads, and a typed card lookup API with Next.js 16.
framework:
  - Next.js
type:
  - Starter
css:
  - Tailwind
githubUrl: https://github.com/vercel/examples/tree/main/starter/tarot-reading
demoUrl: https://nextjs-tarot-reading-starter.vercel.app
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/starter/tarot-reading&project-name=tarot-reading&repository-name=tarot-reading
publisher: Deckaura
relatedTemplates:
  - nextjs-boilerplate
---

# Next.js Tarot Reading Starter

This starter demonstrates dynamic tarot card draws with the Next.js 16 App
Router. It includes a single-card page, a three-card spread, and a typed lookup
API that can be extended from the sample deck to all 78 cards.

## Demo

https://nextjs-tarot-reading-starter.vercel.app

## Features

- Next.js 16 App Router and React 19
- Cache Components with request-time card draws streamed through Suspense
- Single-card and past-present-future reading examples
- Typed `GET /api/card/[name]` endpoint
- Cache headers configured for the lookup API
- No environment variables or external services required

The sample meanings are adapted from the MIT-licensed
[Deckaura tarot dataset](https://huggingface.co/datasets/Blacik/deckaura-tarot-card-meanings).
The complete reference and card guides are available from
[Deckaura](https://deckaura.com/blogs/guide/tarot-card-meanings).

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/starter/tarot-reading&project-name=tarot-reading&repository-name=tarot-reading)

## Clone and Run

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/starter/tarot-reading tarot-reading
cd tarot-reading
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Try the card API at
`/api/card/The%20Fool`.

## Extend the Deck

The starter includes five Major Arcana cards to keep the example focused. Add
the remaining card objects to `lib/cards.ts`, or transform the linked dataset
into the exported `TarotCard` shape.

## License

MIT
