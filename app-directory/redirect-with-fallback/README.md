# redirect-with-fallback example

This example shows how to use a [route handler](https://nextjs.org/docs/app/building-your-application/routing/router-handlers) to handle simple redirects.

The redirects can be found in [`redirects.js`](redirects.js), they are splitted in simple and complex.

- Simple are handled using a static route ([`generateStaticParams()`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)) in [`app/[...slug]/route.ts`](app/[...slug]/route.ts)
- Complex are handled via [redirects](https://nextjs.org/docs/app/api-reference/next-config-js/redirects) in [`next.config.js`](next.config.js)

## Demo

https://redirect-with-fallback.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/app-directory/redirect-with-fallback&project-name=redirect-with-fallback&repository-name=redirect-with-fallback)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/app-directory/redirect-with-fallback
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
