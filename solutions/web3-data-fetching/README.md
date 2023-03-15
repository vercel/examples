---
name: Web3 Data Fetching
slug: web3-data-fetching
description: Smart contracts contain relevant information to applications built on top of blockchains that can run the Ethereum Virtual Machine. Some of the information in these contracts can be exposed in the form of View functions that do not need gas or fees to be executed. Now we will explore how to get that information in Next.js.
framework: Next.js
useCase: Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/web3-data-fetching&project-name=web3-data-fetching&repository-name=web3-data-fetching
demoUrl: https://web3-data-fetching.vercel.app/
---

# web3-data-fetching example

This example shows how to fetch data from the blockchain in Next.js

## Demo

https://web3-data-fetching.vercel.app/

This demo will show how to do the following:

- Instanciate a connection to a smart contract
- Retreive smart contract information serverside
- Retreive smart contract information with SWR for revalidation

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/web3-data-fetching&project-name=web3-data-fetching&repository-name=web3-data-fetching)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/web3-data-fetching
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
