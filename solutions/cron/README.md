---
name: Vercel Cron Job Example
slug: vercel-cron
description: A Next.js app that uses Vercel Cron Jobs to update data at different intervals.
framework: Next.js
useCase:
  - Cron
  - Functions
css: Tailwind
database: Vercel KV
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fcron&project-name=cron&repository-name=cron&demo-title=Vercel%20Cron%20Job%20Example&demo-description=A%20Next.js%20app%20that%20uses%20Vercel%20Cron%20Jobs%20to%20update%20data%20at%20different%20intervals.&demo-url=https%3A%2F%2Fcron-template.vercel.app%2F&demo-image=https%3A%2F%2Fcron-template.vercel.app%2Fthumbnail.png&stores=%5B%7B"type"%3A"kv"%7D%5D
demoUrl: https://cron-template.vercel.app/
relatedTemplates:
  - hacker-news-slack-bot
  - cron-og
---

# Vercel Cron Job Example

A Next.js app that uses [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) to update data at different intervals.

## Demo

https://cron-template.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=examples-repo):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fcron&project-name=cron&repository-name=cron&demo-title=Vercel%20Cron%20Job%20Example&demo-description=A%20Next.js%20app%20that%20uses%20Vercel%20Cron%20Jobs%20to%20update%20data%20at%20different%20intervals.&demo-url=https%3A%2F%2Fcron-template.vercel.app%2F&demo-image=https%3A%2F%2Fcron-template.vercel.app%2Fthumbnail.png&stores=%5B%7B"type"%3A"kv"%7D%5D)

Don't forget to set the required environment variables that you got from the previous step.

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/cron cron
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=examples-repo) ([Documentation](https://nextjs.org/docs/deployment)).

## Monitor that your cron jobs ran

To find out when a cron job stops running or starts failing, have the job ping a check-in link at the end of each run. A check-in service alerts you when a ping is late or reports a failure. Any check-in service works. [Spooky Particles](https://spookyparticles.com/docs/check-ins) is one example: its links accept a bare request as ok and `/fail` as a failure.

Add the link as a `CHECKIN_URL` environment variable and ping it after the work is done in `pages/api/cron/[cron].ts`:

```ts
const response = await update(cron)

// Optional: tell a check-in service this run finished.
if (process.env.CHECKIN_URL) {
  await fetch(process.env.CHECKIN_URL, { method: 'POST' }).catch(() => {})
}

return res.status(200).json(response)
```

If the job throws before the ping, no check-in arrives and the service alerts you. Treat the link like a password and keep it out of your code.
