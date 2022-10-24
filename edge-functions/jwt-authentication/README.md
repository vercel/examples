---
name: JWT Authentication
slug: jwt-authentication
description: Learn how to do JWT authentication at the edge.
framework: Next.js
useCase:
  - Edge Functions
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-functions%2Fjwt-authentication&env=JWT_SECRET_KEY&envDescription=Random%20secret%20that'll%20be%20used%20to%20sign%20JWTs&project-name=jwt-authentication&repo-name=jwt-authentication
demoUrl: https://edge-functions-jwt-authentication.vercel.app
---

# JWT Authentication

The example shows how to do JWT authentication at the edge.

## Demo

https://edge-functions-jwt-authentication.vercel.app

* Visit with a browser

  1. Visit https://edge-functions-jwt-authentication.vercel.app/protected
  2. Click the "Set the user-token cookie" button
  3. Visit https://edge-functions-jwt-authentication.vercel.app/protected again

* Use curl to access the API:

  1. `curl -v https://edge-functions-jwt-authentication.vercel.app/api/protected`
     will respond with a 401 status and an error message in the JSON response since you have not provided authentication
  2. `curl -X POST -v https://edge-functions-jwt-authentication.vercel.app/api/auth`
     will respond with a 200 status, provide a JWT in a cookie named `user-token`, and respond with a successful JSON response
  3.  `curl -v --cookie "user-token=..." https://edge-functions-jwt-authentication.vercel.app/api/protected`
     (using the cookie provided in step 2) will respond with a 200 status and a successful JSON response

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

After [setting up your JWT secret](#set-up-environment-variables), deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-functions%2Fjwt-authentication&env=JWT_SECRET_KEY&envDescription=Random%20secret%20that'll%20be%20used%20to%20sign%20JWTs&project-name=jwt-authentication&repo-name=jwt-authentication)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/jwt-authentication
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/jwt-authentication
```

#### Set up environment variables

Rename [`.env.example`](.env.example) to `.env.local`:

```bash
cp .env.example .env.local
```

then, update `JWT_SECRET_KEY` with your a random secret that'll be used to sign JWTs.

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
