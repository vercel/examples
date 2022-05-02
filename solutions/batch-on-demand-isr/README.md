# batch-on-demand-isr example

This example shows how update multiple static pages with ISR on demand

## Demo

https://batch-on-demand-isr.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/batch-on-demand-isr&project-name=batch-on-demand-isr&repository-name=batch-on-demand-isr&env=MY_SECRET_TOKEN))

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/batch-on-demand-isr
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/batch-on-demand-isr
```

Add the environment variable `MY_SECRET_TOKEN` to your project's `.env.local` file. Generate a strong secret token using [a password generator like this one](https://passwordsgenerator.net/).

update the secret value in [components/explainer.tsx](/components/explainer.tsx) to match your MY_SECRET_TOKEN value.

```tsx
const handleRevalidate = async () => {
  setLoading(true)
  // This should normally be called from a server and this secret value should not be exposed.
  const secret = 'PleaseWaterThePlants'
  await fetch('/api/revalidate?secret=' + secret)
  setLoading(false)
}
```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
