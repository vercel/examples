# ai-chatgpt example

This example shows how to implement a simple chat bot is implemented using Next.js, API Routes, and [OpenAI SDK](https://beta.openai.com/docs/api-reference/completions/create).

## Demo

https://ai-chatgpt.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/ai-chatgpt&project-name=ai-chatgpt&repository-name=ai-chatgpt&env=OPENAI_API_KEY)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/ai-chatgpt
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/ai-chatgpt
```

## Running Locally

After cloning the repo, go to [OpenAI](https://beta.openai.com/account/api-keys) to make an account and put your API key in a variable `OPENAI_API_KEY` in a file called `.env.local`.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
