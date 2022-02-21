# Bot Detection with Botd

[Botd](https://github.com/fingerprintjs/botd) (by [FingerprintJS](https://fingerprintjs.com/)) is a browser library for bot detection. In this demo we'll be using it alongside [botd-integrations](https://github.com/fingerprintjs/botd-integrations) for bot detection at the edge.

## Demo

https://edge-functions-bot-protection-botd.vercel.app

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/bot-protection-botd&env=NEXT_PUBLIC_BOTD_API_TOKEN&project-name=bot-protection-botd&repository-name=bot-protection-botd)

## How it works

We do bot detection at the edge with the following code:

```ts
async function handler(req: NextRequest) {
  const res = await botdEdge(req)

  if (res && res.status !== 200) {
    // Bot detected!
    const url = req.nextUrl.clone()
    url.pathname = '/bot-detected'
    const rewrite = NextResponse.rewrite(url)
    res.headers.forEach((v, k) => rewrite.headers.set(k, v))

    return rewrite
  }
  return res
}
```

If you try and go to [/blocked](https://botd.vercel.sh/blocked) you'll see the [/bot-detected](pages/bot-detected.tsx) page being rendered instead, done by a rewrite from the edge after it identifies you as a bot. We do that by changing the user agent of the request before calling `botdEdge`, like so:

```ts
// From lib/demo-middleware.ts
if (pathname === '/blocked') {
  ev.request.headers.set(
    'user-agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/90.0.4430.93 Safari/537.36'
  )
}
```

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/bot-protection-botd bot-protection-botd
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/bot-protection-botd bot-protection-botd
```

You'll need to have a token for the beta access of [Botd](https://github.com/fingerprintjs/botd), the token is free and there are instructions in their [github repo](https://github.com/fingerprintjs/botd) on how to get one.

Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the Botd API token to match your token.

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```
