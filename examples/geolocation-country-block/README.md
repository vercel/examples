# Geolocation Country Block

```ts
import type { EdgeRequest, EdgeResponse, EdgeNext } from 'next'

// Block Austria, prefer Germany
const BLOCKED_COUNTRY = 'AT'

export default async function (
  req: EdgeRequest,
  res: EdgeResponse,
  next: EdgeNext
) {
  const country = req.geo.country || 'US'

  if (country === BLOCKED_COUNTRY) {
    res.writeHead(451)
    res.end('Blocked for legal reasons')
  } else {
    res.end(`Greetings from ${country}, where you are not blocked.`)
  }
}
```

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel-customer-feedback/edge-functions/tree/main/examples/geolocation-country-block&project-name=geolocation-country-block&repository-name=geolocation-country-block)

### Clone and Deploy

Download this repository via git:

```bash
git clone https://github.com/vercel-customer-feedback/edge-functions.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example edge-middleware/examples/geolocation-country-block geolocation-country-block
# or
yarn create next-app --example edge-middleware/examples/geolocation-country-block geolocation-country-block
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
