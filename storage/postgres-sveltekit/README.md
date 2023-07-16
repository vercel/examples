---
name: Vercel Postgres SvelteKit Starter
slug: postgres-sveltekit
description: Simple SvelteKit template that uses Vercel Postgres as the database.
framework: Svelte
useCase: Starter
css: Tailwind
database: Vercel Postgres
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-sveltekit&project-name=postgres-sveltekit&repository-name=postgres-sveltekit&demo-title=Vercel%20Postgres%20Starter%sveltekit&demo-description=Simple%20Svelte.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database.&demo-url=https%3A%2F%2Fpostgres-sveltekit.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-starter.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"postgres"%7D%5D
demoUrl: https://postgres-sveltekit.vercel.app/
relatedTemplates:
  - postgres-starter
  - postgres-prisma
  - postgres-kysely
---

# Vercel Postgres SvelteKit Starter

Simple SvelteKit template that uses [Vercel Postgres](https://vercel.com/postgres) as the database.

## Demo

https://postgres-sveltekit.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-sveltekit&project-name=postgres-sveltekit&repository-name=postgres-sveltekit&demo-title=Vercel%20Postgres%20Next.js%Sveltekit&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database.&demo-url=https%3A%2F%2Fpostgres-sveltekit.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-starter.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"postgres"%7D%5D)
create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a SvelteKit project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
pnpm create svelte@latest

# create a new project in my-app
pnpm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev --open
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
