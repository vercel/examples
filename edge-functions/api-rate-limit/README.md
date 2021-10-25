# API Rate Limiting with Upstash

This demo features API Rate limiting at the edge with Redis using [Upstash](https://upstash.com/).

The pattern for rate limiting is inspired by the [GitHub API](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

## Demo

edge-functions-api-rate-limit.vercel.sh

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-customer-feedback%2Fedge-functions%2Ftree%2Fmain%2Fexamples%2Fapi-rate-limit&env=UPSTASH_REST_API_DOMAIN,UPSTASH_REST_API_TOKEN&project-name=api-rate-limit&repo-name=api-rate-limit)

## Getting Started

You'll need to have an account with [Upstash](https://upstash.com/). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the REST API of your database. It should look like this:

```bash
UPSTASH_REST_API_DOMAIN = "us1-shiny-firefly-12345.upstash.io"
UPSTASH_REST_API_TOKEN = "your-api-token"
```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```
