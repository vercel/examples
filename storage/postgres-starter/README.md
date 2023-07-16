---
name: Vercel Postgres Next.js Starter
slug: postgres-starter
description: Simple Next.js template that uses Vercel Postgres as the database.
framework: Next.js
useCase: Starter
css: Tailwind
database: Vercel Postgres
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-starter&project-name=postgres-starter&repository-name=postgres-starter&demo-title=Vercel%20Postgres%20Next.js%20Starter&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database.&demo-url=https%3A%2F%2Fpostgres-starter.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-starter.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"postgres"%7D%5D
demoUrl: https://postgres-starter.vercel.app/
relatedTemplates:
  - postgres-prisma
  - postgres-kysely
  - postgres-sveltekit
---

# Vercel Postgres Next.js Starter

Simple Next.js template that uses [Vercel Postgres](https://vercel.com/postgres) as the database.

## Demo

https://postgres-starter.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-starter&project-name=postgres-starter&repository-name=postgres-starter&demo-title=Vercel%20Postgres%20Next.js%20Starter&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database.&demo-url=https%3A%2F%2Fpostgres-starter.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-starter.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"postgres"%7D%5D)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/storage/postgres-starter
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
