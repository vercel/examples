---
name: Native notifications for web apps
slug: web-app-native-notifications
description: A bridge between your web app and a phone. One HTTP call from a route handler becomes a native notification — and can ask a question back.
framework: Next.js
type: SaaS
css: Tailwind
publisher: Lauther
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fweb-app-native-notifications&env=LAUTHER_TOKEN&envDescription=A%20token%20from%20the%20Lauther%20app%20(Apps%20%E2%86%92%20%EF%BC%8B%20%E2%86%92%20New%20token)&envLink=https%3A%2F%2Flauther.app%2Fdevelopers.html&project-name=web-app-native-notifications&repository-name=web-app-native-notifications
demoUrl: https://web-app-native-notifications.vercel.app
relatedTemplates:
  - vercel-cron
---

# Native notifications for web apps

A web app ends when the tab closes. This example is the bridge to the other
side: one HTTP call from a Next.js route handler becomes a **native
notification** on a phone, through [Lauther](https://lauther.app) — a free app
that gives any web app a native presence on a phone. A tap target, a priority
for the ones that should cross quiet hours, and the option to ask a question
and get the answer back. No native app to ship, no push certificate, no SDK.

- `app/api/notify/route.ts` — `POST /v1/push`. Tells the phone something
  happened: a signup, an order, a failed cron.
- `app/api/refund/route.ts` — `POST /v1/approve`. The same notification with
  Approve and Deny on it; the route blocks until the tap and only proceeds on
  **Approve**. Deny returns 403; no answer returns 202 and does nothing.

## Demo

https://web-app-native-notifications.vercel.app

Install Lauther (free, [App Store](https://lauther.app/go/ios) /
[Google Play](https://lauther.app/go/play)), mint a token in the app under
**Apps → ＋ → New token**, paste it on the demo page, press a button. The token
is used for that one request and is not stored.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fweb-app-native-notifications&env=LAUTHER_TOKEN&envDescription=A%20token%20from%20the%20Lauther%20app%20(Apps%20%E2%86%92%20%EF%BC%8B%20%E2%86%92%20New%20token)&envLink=https%3A%2F%2Flauther.app%2Fdevelopers.html&project-name=web-app-native-notifications&repository-name=web-app-native-notifications)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/web-app-native-notifications web-app-native-notifications
```

Copy `.env.example` to `.env.local` and paste your token:

```bash
cp .env.example .env.local
# LAUTHER_TOKEN=lpt_…
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://nextjs.org/docs/deployment)), and add `LAUTHER_TOKEN` to the project's environment variables.

## How it works

Tell the phone:

```ts
// app/api/notify/route.ts
await fetch('https://api.lauther.id/v1/push', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.LAUTHER_TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New signup', message: 'anna@example.com', url: 'https://yourapp.com/admin' }),
})
```

Ask the phone:

```ts
// app/api/refund/route.ts
export const maxDuration = 30 // Hobby caps functions at 10 s; the wait is 25 s

const res = await fetch('https://api.lauther.id/v1/approve', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.LAUTHER_TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Refund €49 to anna@example.com?', wait: 25, requireBiometric: true }),
})
const { response } = await res.json()

if (response === 'deny') return new Response('denied', { status: 403 })
if (response !== 'approve') return new Response('held for approval', { status: 202 })
// …only a tap on Approve gets here
```

## What else crosses the bridge

The same API does passwordless sign-in (a QR code instead of a password
field, with a per-service alias so sites cannot correlate a user) and topics
for broadcasting to many phones at once. The token also works from a cron job,
a GitHub Action, a Supabase edge function or an AI agent
(`npx -y lauther-mcp`). Docs: https://lauther.app/docs.html
