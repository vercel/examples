---
name: Bot Detection with Botd
slug: bot-protection-botd
description: Botd is a browser library for bot detection. In this template we'll be using it alongside botd-integrations for bot detection at the edge.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/bot-protection-botd&env=NEXT_PUBLIC_BOTD_API_TOKEN&project-name=bot-protection-botd&repository-name=bot-protection-botd
demoUrl: https://edge-functions-bot-protection-botd.vercel.app
relatedTemplates:
  - bot-protection-datadome
---

# Bot Detection with Botd

[Botd](https://github.com/fingerprintjs/botd) (by [FingerprintJS](https://fingerprintjs.com/)) is a browser library for bot detection. In this demo we'll be using it alongside [botd-integrations](https://github.com/fingerprintjs/botd-integrations) for bot detection at the edge.

## Demo

https://edge-functions-bot-protection-botd.vercel.app

If you try and go to [/blocked](https://edge-functions-bot-protection-botd.vercel.app/blocked) you'll see the [/bot-detected](pages/bot-detected.tsx) page being rendered instead, done by a rewrite from the edge after it identifies you as a bot. We do that by changing the user agent of the request before making a request to Botd.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/bot-protection-botd&env=NEXT_PUBLIC_BOTD_API_TOKEN&project-name=bot-protection-botd&repository-name=bot-protection-botd)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/bot-protection-botd bot-protection-botd
```

You'll need to have a token for the beta access of [Botd](https://github.com/fingerprintjs/botd), the token is free and there are instructions in their [github repo](https://github.com/fingerprintjs/botd) on how to get one.

Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the Botd API token to match your token.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
