---
name: Mintlify docs rewrite (vercel.ts)
slug: mintlify-docs-rewrite
description: Rewrite /docs paths to a Mintlify-hosted documentation site using vercel.ts rewrites.
framework: Next.js
useCase: Rewrites
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/mintlify-docs-rewrite&project-name=mintlify-docs-rewrite&repository-name=mintlify-docs-rewrite&env=MINTLIFY_DOCS_URL
demoUrl: https://mintlify-docs-rewrite.vercel.app
---

# Mintlify docs rewrite (vercel.ts) example

This example shows how to use Vercel's `vercel.ts` configuration to rewrite `/docs` paths to a Mintlify-hosted documentation site. This lets you serve your Mintlify docs from your main domain (e.g., `yourdomain.com/docs`) for better SEO and a seamless user experience.

## Demo

https://mintlify-docs-rewrite.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/mintlify-docs-rewrite&project-name=mintlify-docs-rewrite&repository-name=mintlify-docs-rewrite&env=MINTLIFY_DOCS_URL)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/cdn/mintlify-docs-rewrite
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

## Environment variables

- `MINTLIFY_DOCS_URL` – Your Mintlify docs URL (e.g., `https://your-docs.mintlify.app`)

## How it works

1. `vercel.ts` exports a config with rewrite rules that map `/docs` and `/docs/*` to your Mintlify docs URL.
2. Vercel applies these rewrites at the edge, proxying requests to Mintlify while keeping the URL unchanged.
3. Users visit `yourdomain.com/docs` and see your Mintlify documentation, fully integrated with your domain.

The rewrite approach means:
- Better SEO since docs are on your main domain
- No CORS issues
- Seamless user experience with consistent branding
- Mintlify handles all the docs infrastructure

