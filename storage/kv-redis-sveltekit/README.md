---
name: Vercel KV for Redis SvelteKit Starter
slug: kv-redis-sveltekit
description: Simple SvelteKit template that uses Vercel KV for Redis to track pageviews.
framework: Svelte
useCase: Starter
css: Tailwind
database: Vercel KV
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fkv-redis-sveltekit&project-name=kv-redis-sveltekit&repository-name=kv-redis-sveltekit&demo-title=Vercel%20KV%20for%20Redis%20SvelteKit%20Starter&demo-description=Simple%20Svelte%20template%20that%20uses%20Vercel%20KV%20for%20Redis%20to%20track%20pageviews.&demo-url=https%3A%2F%2Fkv-redis-sveltekit.vercel.app%2F&demo-image=https%3A%2F%2Fkv-redis-sveltekit.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"kv"%7D%5D
demoUrl: https://kv-redis-sveltekit.vercel.app/
relatedTemplates:
  - blob-starter
  - postgres-starter
---

# Vercel KV for Redis SvelteKit Starter

Simple SvelteKit template that uses [Vercel KV for Redis](https://vercel.com/kv) to track pageviews.

## Demo

https://kv-redis-sveltekit.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fkv-redis-sveltekit&project-name=kv-redis-sveltekit&repository-name=kv-redis-sveltekit&demo-title=Vercel%20KV%20for%20Redis%20Svelte%20Starter&demo-description=Simple%20SvelteKit%20template%20that%20uses%20Vercel%20KV%20for%20Redis%20to%20track%20pageviews.&demo-url=https%3A%2F%2Fkv-redis-sveltekit.vercel.app%2F&demo-image=https%3A%2F%2Fkv-redis-sveltekit.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"kv"%7D%5D)

# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

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
