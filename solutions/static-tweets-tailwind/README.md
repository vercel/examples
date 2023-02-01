---
marketplace: false
reason: https://github.com/lfades/static-tweet is very similar to this one
---

# Static Tweets (Tailwind)

This example shows you how you can generate static tweets using Tailwind CSS & `getStaticProps` in Next.js.

## Dependencies

- Tailwind CSS (`npm install tailwindcss`)
- Tailwind Typography (`npm i @tailwindcss/typography`)
- MDX Remote (for MDX support) (`npm i next-mdx-remote`)
- Date FNS (`npm i date-fns`)
- Query String (`npm i querystring`)

## Gotchas

- Don't forget to add pbs.twimg.com to your allowed `images` in your `next.config.js` file.
- Don't forget to add Twitter Auth Bearer Token to your `.env` file.

## Demo

https://static-tweets-tailwind.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

**One-Click Deploy**

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=platforms-eap):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/static-tweets-tailwind&project-name=static-tweets-tailwind&repository-name=static-tweets-tailwind)

**Clone and Deploy**

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/static-tweets-tailwind static-tweets-tailwind
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/static-tweets-tailwind static-tweets-tailwind
```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=platforms-eap) ([Documentation](https://nextjs.org/docs/deployment)).
