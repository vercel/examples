# Serverside Analytics example

This example shows how to implement analytics inside [Middleware Functions](https://nextjs.org/docs/middleware).

## Demo

https://serverside-analytics.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/serverside-analytics&project-name=serverside-analytics&repository-name=serverside-analytics)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/serverside-analytics
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/serverside-analytics
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

### Setting up:

1. Create a project on [Supabase](https://supabase.com/)
1. Get the API key and database URl and add them to `.env` and in your Vercel Project
1. Create a Table in Supabase containing the following data.

```
create table analytics (
  id bigint not null primary key,
  created_at timestamp default now(),
  slug character
);
```

**Note: Supabase was used to showcase page views analytics. You should research an appropriate database based on the volume and format of your Data.**
