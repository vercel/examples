---
name: Buildout Schedule Starter
slug: buildoutschedule-nextjs-starter
description: A Next.js starter with a live scheduling page on the homepage. Bookings, reminders, and reschedules run on Buildout Schedule.
framework: Next.js
useCase:
  - Starter
  - SaaS
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fbuildoutschedule-nextjs-starter&project-name=buildoutschedule-starter&repository-name=buildoutschedule-nextjs-starter
demoUrl: https://buildoutschedule-nextjs-starter.vercel.app
relatedTemplates:
  - nextjs-boilerplate
---

# Buildout Schedule Starter

A Next.js 15 (App Router) starter with a live booking page on the homepage. It uses [`@buildoutstudios/schedule`](https://www.npmjs.com/package/@buildoutstudios/schedule) to embed a [Buildout Schedule](https://buildoutschedule.com) booking flow: real availability, double-book checks, confirmation emails, and reschedule/cancel links all run on the hosted page. Nothing is reimplemented client-side.

Out of the box the widget points at a live demo workspace, so booking works the moment you run it. Swap in your own workspace with two env vars (see `.env.example`), no code changes required.

When a visitor completes a booking, the widget's `onBooked` callback fires with the booking summary and the starter routes to `/thanks`, which shows the booked time in the visitor's own timezone.

## Demo

https://buildoutschedule-nextjs-starter.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=examples-repo):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fbuildoutschedule-nextjs-starter&project-name=buildoutschedule-starter&repository-name=buildoutschedule-nextjs-starter)

No env vars are required to deploy.

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/buildoutschedule-nextjs-starter buildoutschedule-nextjs-starter
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=examples-repo) ([Documentation](https://nextjs.org/docs/deployment)).

## Point it at your own booking page

1. Create a workspace at [buildoutschedule.com](https://buildoutschedule.com) (free) and add an event type.
2. Your public booking URL is `buildoutschedule.com/{workspace}/{event-type}`.
3. Set both values as env vars (locally in `.env.local`, or in your Vercel project settings):

```bash
NEXT_PUBLIC_SCHEDULE_WORKSPACE=your-workspace
NEXT_PUBLIC_SCHEDULE_EVENT_TYPE=your-event-type
```

Prefer code? The fallbacks live in `src/lib/config.ts`.
