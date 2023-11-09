---
name: Waiting Room with Vercel KV for Redis
slug: kv-redis-waiting-room
description: Add a virtual waiting room to your site.
framework: Next.js
useCase: Starter
css: Tailwind
database: Vercel KV
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fkv-redis-waiting-room&project-name=kv-redis-waiting-room&repository-name=kv-redis-waiting-room&demo-url=https%3A%2F%2Fkv-redis-waiting-room.vercel.app%2F&stores=%5B%7B"type"%3A"kv"%7D%5D
demoUrl: https://kv-redis-waiting-room.vercel.app/
relatedTemplates:
  - kv-starter
  - postgres-starter
---

Waiting Room with Vercel KV for Redis

Next.js template that uses [Vercel KV for Redis](https://vercel.com/kv) to add a virtual waiting room.

## Demo

https://kv-redis-waiting-room.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fkv-redis-waiting-room&project-name=kv-redis-waiting-room&repository-name=kv-redis-waiting-room&demo-url=https%3A%2F%2Fkv-redis-waiting-room.vercel.app%2F&stores=%5B%7B"type"%3A"kv"%7D%5D)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/storage/kv-redis-waiting-room
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
