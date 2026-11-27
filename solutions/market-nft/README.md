---
name: NFT Marketplace with Mintbase
slug: nft-market
description: This example shows how to use Mintbase using a Next.js app and how to create an NFT marketplace, for the NEAR ecosystem.
framework: Next.js
useCase: Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/market-nft&env=NEXT_PUBLIC_AFFILIATE_ACCOUNT,NEXT_PUBLIC_CONTRACTS
demoUrl: https://nft-market-mintbase.vercel.app/
---


# market-nft example

In this example, we demonstrate how to integrate [Mintbase](https://mintbase.xyz) into a Next.js application to create an NFT marketplace for the NEAR Protocol. Mintbase's mission is to empower developers to use non-fungible tokens (NFTs) to build diverse use-cases. 

[Mintbase Documentation](https://docs.mintbase.xyz)

## Demo

https://nft-market-mintbase.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/market-nft&env=NEXT_PUBLIC_AFFILIATE_ACCOUNT,NEXT_PUBLIC_CONTRACTS)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/market-nft
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/market-nft
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


## .env vars

Notice there are **two** environment variables:

- `NEXT_PUBLIC_AFFILIATE_ACCOUNT` is the NEAR account that will collect a market fee from the sale. Learn more [here](https://blog.mintbase.xyz/mintbase-launches-affiliatedirect-where-anyone-can-sell-anything-on-near-347c6f19c76b). 
    - Example: `mintspace2.testnet`

- `NEXT_PUBLIC_CONTRACTS` the token contracts used to fetch tokens for sale in the Mintbase marketplace protocol. 
    - Example: `vercel.mintspace2.testnet`