---
name: Vercel Blob Next.js Starter
slug: blob-starter
description: Simple Next.js template that uses Vercel Blob for image uploads
framework: Next.js
useCase: Starter
css: Tailwind
database: Vercel Blob
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fblob-starter&project-name=blob-starter&repository-name=blob-starter&demo-title=Vercel%20Blob%20Next.js%20Starter&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Blob%20for%20image%20uploads&demo-url=https%3A%2F%2Fblob-starter.vercel.app%2F&demo-image=https%3A%2F%2Fblob-starter.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"blob"%7D%5D
demoUrl: https://blob-starter.vercel.app/
relatedTemplates:
  - kv-redis-starter
  - postgres-starter
---

# Vercel Blob Next.js Starter

Simple Next.js template that uses [Vercel Blob](https://vercel.com/blob)for image uploads

## Demo

https://blob-starter.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fblob-starter&project-name=blob-starter&repository-name=blob-starter&demo-title=Vercel%20Blob%20Next.js%20Starter&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Blob%20for%20image%20uploads&demo-url=https%3A%2F%2Fblob-starter.vercel.app%2F&demo-image=https%3A%2F%2Fblob-starter.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"blob"%7D%5D)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/storage/blob-starter
```

Once that's done, copy the .env.example file in this directory to .env.local (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones in your Vercel Storage Dashboard.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://nextjs.org/docs/deployment)).
