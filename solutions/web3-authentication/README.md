# web3-authentication example

This example shows how to implement web3 authentication with Next.js

## Demo

https://solutions-web3-authentication.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/solutions/web3-authentication&project-name=web3-authentication&repository-name=web3-authentication&env=NEXTAUTH_URL,NEXTAUTH_SECRET)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/web3-authentication
```

Setup the required environment variables in your `env.local` file. `NEXTAUTH_URL` should be your full url.
`NEXTAUTH_SECRET` should be a secure random string.You can generate one [here](https://www.google.com/search?client=firefox-b-d&q=generate+random+strings)

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
