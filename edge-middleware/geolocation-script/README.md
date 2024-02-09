---
marketplace: false
---

# Geolocation with `next/script`

This example shows you how you can use the `x-vercel-ip-country` header ([docs](https://vercel.com/docs/edge-network/headers#x-vercel-ip-country)) with a lazy loaded server component to conditionally load a script.

E.g. if you want to load Google Analytics only for visitors outside of the EU, you can do the following:

```ts
export default function Analytics() {
  const countryCode = headers().get('x-vercel-ip-country') || 'US'

  if (EU_COUNTRY_CODES.includes(countryCode)) {
    return null
  }

  return (
    <Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
  )
}
```

Demo: https://geolocation-script.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/geolocation-script&project-name=geolocation-script&repository-name=geolocation-script)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/geolocation-script geolocation-script
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
