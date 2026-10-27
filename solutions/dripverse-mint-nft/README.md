---
name: DripVerse Mint NFT
slug: dripverse-mint-nft
description: This example shows how to mint an NFT using the DripVerse SDK.
framework: Next.js
useCase: Solutions
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fdripverse-mint-nft&env=NEXT_PUBLIC_DRIPVERSE_PROJECT_KEY,NEXT_PUBLIC_NFT_STORAGE_API_KEY&envDescription=Some%20test%20project%20keys%20are%20already%20provided%20so%20that%20you%20can%20quickly%20try%20it%20out.%20Click%20on%20%22Learn%20more%22%20and%20copy%20the%20respective%20keys%20from%20the%20GitHub%20repo.&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Fblob%2Fmain%2Fsolutions%2Fdripverse-mint-nft%2F.env.example&project-name=my-dripverse-test-project&repository-name=my-dripverse-test-project
demoUrl: https://dripverse-mint-nft.vercel.app
---

# DripVerse Mint NFT Example

[DripVerse](https://dripverse.org/) is a platform for minting NFTs and adding utilities on top of them. This example shows how to mint an NFT using the [DripVerse SDK](https://www.npmjs.com/package/dripverse)

## Demo

https://dripverse-mint-nft.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fdripverse-mint-nft&env=NEXT_PUBLIC_DRIPVERSE_PROJECT_KEY,NEXT_PUBLIC_NFT_STORAGE_API_KEY&envDescription=Some%20test%20project%20keys%20are%20already%20provided%20so%20that%20you%20can%20quickly%20try%20it%20out.%20Click%20on%20%22Learn%20more%22%20and%20copy%20the%20respective%20keys%20from%20the%20GitHub%20repo.&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Fblob%2Fmain%2Fsolutions%2Fdripverse-mint-nft%2F.env.example&project-name=my-dripverse-test-project&repository-name=my-dripverse-test-project)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/dripverse-mint-nft
```

Some test keys are already provided so that you can quickly try it out. Copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
