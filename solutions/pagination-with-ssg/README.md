---
name: Pagination with SSG
slug: pagination-with-ssg
description: Learn to implement page based pagination with Next.js and Vercel.
framework: Next.js
useCase: Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/pagination-with-ssg&project-name=pagination-with-ssg&repository-name=pagination-with-ssg
demoUrl: https://pagination-with-ssg.vercel.app
---

# Pagination with SSG

This example shows how to implement page based pagination with [SSG](https://nextjs.org/docs/basic-features/data-fetching/get-static-props) in Next.js.

## Demo

https://pagination-with-ssg.vercel.app

## How it works

The first 5 paginated pages are cached in the edge at build time, and the rest are incrementally cached using [ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration), that way we can avoid increasing build times no matter how many pages we have while still keeping essential pages cached from the
start.

The example showcases a PLP (Product Listing Pages) where:

- There are 100 test products and 1 category (PLP)
- There are 10 results per page for a total of 10 pages, where 5 are pre-generated with `getStaticPaths`

```ts
// pages/category/[page].tsx

export const getStaticPaths = async () => {
  return {
    // Prerender the next 5 pages after the first page, which is handled by the index page.
    // Other pages will be prerendered at runtime.
    paths: Array.from({ length: 5 }).map((_, i) => `/category/${i + 2}`),
    // Block the request for non-generated pages and cache them in the background
    fallback: 'blocking',
  }
}
```

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/pagination-with-ssg&project-name=pagination-with-ssg&repository-name=pagination-with-ssg)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/pagination-with-ssg
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
