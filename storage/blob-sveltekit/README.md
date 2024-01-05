---
name: Vercel Blob SvelteKit Starter
slug: blob-sveltekit
description: Simple SvelteKit template that uses Vercel Blob to upload a file.
framework: Svelte
useCase: Starter
css: Tailwind
database: Vercel Blob
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fblob-sveltekit&project-name=blob-sveltekit&repository-name=blob-sveltekit&demo-title=Vercel%20Blob%20SvelteKit%20Starter&demo-description=Simple%20Svelte%20template%20that%20uses%20Vercel%20Blob%20to%20track%20pageviews.&demo-url=https%3A%2F%2Fblob-sveltekit.vercel.app%2F&demo-image=https%3A%2F%2Fblob-sveltekit.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"blob"%7D%5D
demoUrl: https://blob-sveltekit.vercel.app/
relatedTemplates:
  - blob-starter
  - postgres-sveltekit
---

# Vercel Blob SvelteKit Starter

Simple SvelteKit template that uses [Vercel Blob](https://vercel.com/blob) to upload a file.

## Demo

https://blob-sveltekit.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fblob-sveltekit&project-name=blob-sveltekit&repository-name=blob-sveltekit&demo-title=Vercel%20Blob%20Svelte%20Starter&demo-description=Simple%20SvelteKit%20template%20that%20uses%20Vercel%20Blob%20to%20track%20pageviews.&demo-url=https%3A%2F%2Fblob-sveltekit.vercel.app%2F&demo-image=https%3A%2F%2Fblob-sveltekit.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"blob"%7D%5D)

### Clone and Deploy

Execute the following command to download the example into the `my-project` folder:

```bash
npx degit@latest https://github.com/vercel/examples/storage/blob-sveltekit my-project
```

Once you've created the project and installed dependencies with `pnpm install`, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git). Then open `.env.local` and set the environment variables to match the ones in your Vercel Storage Dashboard.

Alternatively, if you have setup a project already and you have installed the Vercel CLI, you can also pull the environment variables using the following command:

```bash
vercel env pull .env.local
```

Next, run SvelteKit in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://vercel.com/docs/frameworks/sveltekit)).
