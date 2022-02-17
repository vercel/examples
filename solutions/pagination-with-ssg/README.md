# Pagination With SSG example

The following example illustrates how pagination strategies can be used to handle large amounts of pages, such as store categories (PLP - Product Listing Pages).

### Example situation:

- 1000 categories (PLPs)
- each category has 1000 products
- there are 10 results per page
- therefore each category will have 100 pages

### Problem:

Long build due to SEO requirement all pages are SSG (`getStaticPaths`)

### Solution:

On the build phase, only build the first few paginated pages and rest on the fly.

## Demo

https://pagination-with-ssg.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/solutions/pagination-with-ssg&project-name=pagination-with-ssg&repository-name=pagination-with-ssg

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/pagination-with-ssg
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/pagination-with-ssg
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
