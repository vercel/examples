# Bot Detection with Botd

[Botd](https://github.com/fingerprintjs/botd) (by [FingerprintJS](https://fingerprintjs.com/)) is a browser library for bot detection. In this demo we'll be using it alongside [botd-integrations](https://github.com/fingerprintjs/botd-integrations) for bot detection at the edge.

## Demo

https://botd.vercel.sh

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-customer-feedback%2Fedge-functions%2Ftree%2Fmain%2Fexamples%2Fbot-protection-botd&env=NEXT_PUBLIC_BOTD_API_TOKEN&project-name=bot-protection-botd&repo-name=bot-protection-botd)

## How it works

We do bot detection at the edge with the following code:

```ts
async function handler(ev: NextFetchEvent) {
  const res = await botdEdge(ev.request)

  if (res && res.status !== 200) {
    // Bot detected!
    res.headers.set('x-middleware-rewrite', '/bot-detected')
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
