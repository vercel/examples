# Flags Solution

This solution uses [Flags SDK](https://flags-sdk.dev) to declare flags in code, and uses the app directory with server components to render variations of the home page.

[Link your project to Vercel](#deploy-on-vercel) to use the [Flags Explorer](#use-vercel-flags-explorer).

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/flags-sdk&project-name=flags&repository-name=flags&env=FLAGS_SECRET)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/flags-sdk
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Use Vercel Flags Explorer

When deploying with Vercel, you can use the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar) to override flags for your app.

![](https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fv1726747095%2Fdocs-assets%2Fstatic%2Fdocs%2Fworkflow-collaboration%2Ffeature-flags%2Ffeature-flags-overview-dark.jpg&w=1200&q=75)

You must link your project to Vercel. You can do this for new and existing projects using the [Vercel CLI](https://vercel.com/docs/cli):

```bash
vercel link
# ? Link to existing project? no
# ? What’s your project’s name? my-flags-example
# ...
```

Now you should be able to see the Vercel Toolbar in development. Search for "Flags" in the toolbar and click "Get Started".
