---
name: Vercel Postgres + Prisma + pgvector Next.js Starter
slug: postgres-pgvector
description: A Next.js template that uses Vercel Postgres as the database, Prisma as the ORM with pgvector to enable vector similarity search, and OpenAI's text-embedding-ada-002 model for embeddings.
framework: Next.js
useCase: Starter
css: Tailwind
database: Vercel Postgres
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-pgvector&env=OPENAI_API_KEY&envDescription=Get%20your%20OpenAI%20API%20key%20here%3A&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys&project-name=postgres-pgvector&repository-name=postgres-pgvector&demo-title=Vercel%20Postgres%20%2B%20Prisma%20%2B%20pgvector%20Next.js%20Starter&demo-description=A%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database%2C%20Prisma%20as%20the%20ORM%20with%20pgvector%20to%20enable%20vector%20similarity%20search%2C%20and%20OpenAI%E2%80%99s%20models%20for%20text%20embeddings.&demo-url=https%3A%2F%2Fpostgres-pgvector.vercel.app&demo-image=https%3A%2F%2Fpostgres-pgvector.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"postgres"%7D%5D&
demoUrl: https://postgres-pgvector.vercel.app/
relatedTemplates:
  - postgres-starter
  - postgres-kysely
  - postgres-drizzle
---

# Vercel Postgres + Prisma + pgvector Next.js Starter

A Next.js template that uses [Vercel Postgres](https://vercel.com/postgres) as the database, [Prisma](https://prisma.io/) as the ORM with [pgvector](https://github.com/pgvector/pgvector-node#prisma) to enable vector similarity search, and OpenAI's [`text-embedding-ada-002`](https://platform.openai.com/docs/guides/embeddings) model for embeddings.

## Demo

https://postgres-pgvector.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-pgvector&env=OPENAI_API_KEY&envDescription=Get%20your%20OpenAI%20API%20key%20here%3A&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys&project-name=postgres-pgvector&repository-name=postgres-pgvector&demo-title=Vercel%20Postgres%20%2B%20Prisma%20%2B%20pgvector%20Next.js%20Starter&demo-description=A%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database%2C%20Prisma%20as%20the%20ORM%20with%20pgvector%20to%20enable%20vector%20similarity%20search%2C%20and%20OpenAI%E2%80%99s%20models%20for%20text%20embeddings.&demo-url=https%3A%2F%2Fpostgres-pgvector.vercel.app&demo-image=https%3A%2F%2Fpostgres-pgvector.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"postgres"%7D%5D&)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/storage/postgres-pgvector
```

Once that's done, copy the .env.example file in this directory to .env.local (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open .env.local and set the environment variables to match the ones in your Vercel Storage Dashboard. Your keys should be available under your database's `.env` tab.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://nextjs.org/docs/deployment)).
