---
name: Geolocation in Edge Middleware
slug: edge-functions-geolocation
description: Learn how to use visitor's location at the edge.
framework: Next.js
useCase:
  - Edge Middleware
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/geolocation&project-name=geolocation&repository-name=geolocation
demoUrl: https://edge-functions-geolocation.vercel.sh
relatedTemplates:
  - edge-functions-i18n
---

# Geolocation

This example shows how to use the `event.request` object to determine a user's location.

```ts
import { geolocation } from '@vercel/functions'

const geo = geolocation(req)

console.log(geo)

{
  /** The city that the request originated from. */
  city?: string;
  /** The country that the request originated from. */
  country?: string;
  /** The flag emoji for the country the request originated from. */
  flag?: string;
  /** The Vercel Edge Network region that received the request. */
  region?: string;
  /** The region part of the ISO 3166-2 code of the client IP. */
  countryRegion?: string;
  /** The latitude of the client. */
  latitude?: string;
  /** The longitude of the client. */
  longitude?: string;
}
```

## Demo

https://edge-functions-geolocation.vercel.sh

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/geolocation&project-name=geolocation&repository-name=geolocation)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/geolocation geolocation
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
