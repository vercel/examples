---
name: Web3 Sessions
slug: web3-sessions
description: In a decentralized application, a user is often identified by a Cryptocurrency wallet such as Metamask. However, since Metamask works by injecting a script into the page, it is only available on the client, cutting off the ability to use getServerSideProps to fetch user data.
framework: Next.js
useCase: Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/web3-sessions&project-name=web3-sessions&repository-name=web3-sessions
demoUrl: https://web3-sessions.vercel.app/
---

# Web3 Sessions

This example shows how create sessions in Next.js with [Metamask](https://metamask.io/) and [NextAuth.js](https://next-auth.js.org/).

## Demo

https://web3-sessions.vercel.app

This Demo will show how to configure NextAuth.js and create a custom hook to protect routes.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/web3-sessions&project-name=web3-sessions&repository-name=web3-sessions)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/web3-sessions
```

Rename the `.env.example` file to `.env.local` and add your own secrets:

```
// generate random secrets on https://passwordsgenerator.net/ or anywhere else similar
NEXT_AUTH_SECRET="eE*szYpDH@r.647zq*Vxd9vW..X!"
JWT_SECRET="R9Hkbi2Ahoy9wNQH*7Jj4a*Y4NxF"
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
