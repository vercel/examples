# Breakpoint server example

This example shows how to use the user-agent and serve from our server a best educated guess on its breakpoint. So pages gets rendered server-side in the best educated size as possible. This results in less layout shift when client-side only rendering is not an option.

The breakpoint provider takes the breakpoint the middleware detected and use it for components to render their specific UI. Then client-side MatchMedia is used to detect its real breakpoint and listen on any resize event.

Now this BreakPointProvider can be mocked for tests where you can set the exact breakpoint which, as a side-effect, makes your testings even easier (no need to mock MatchMedia anymore).

## Demo

https://edge-functions-breakpoint-server.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/breakpoint-server&project-name=breakpoint-server&repository-name=breakpoint-server)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/breakpoint-server breakpoint-server
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/breakpoint-server breakpoint-server
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
