---
name: Bones SaaS Starter
slug: bones-saas-starter
description: Full-stack Next.js SaaS starter with Auth, Payments, CMS, AI, and 100+ components. Zero-config deploy.
framework: Next.js
useCase:
  - Starter
  - SaaS
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshipkit-io%2Fbones&project-name=bones-app&repository-name=bones-app&demo-title=Bones%20%E2%80%93%20Next.js%20SaaS%20Starter&demo-description=Full-stack%20Next.js%20starter%20with%20Auth%2C%20Payments%2C%20CMS%2C%20AI%2C%20and%20100%2B%20components.&demo-url=https%3A%2F%2Fbones.sh&demo-image=https%3A%2F%2Fshipkit.io%2Fimages%2Fdemo.png
demoUrl: https://bones.sh
relatedTemplates:
  - nextjs-boilerplate
  - blog-starter-kit
---

# Bones – Next.js SaaS Starter

[Bones](https://bones.sh) is a full-stack Next.js SaaS starter kit that deploys to Vercel with zero configuration. No environment variables are required to start — a setup wizard guides you through post-deploy configuration.

## Demo

https://bones.sh

## Features

- **Authentication** — NextAuth v5 with GitHub, Google, Discord, Magic Link, and Credentials providers
- **Payments** — Stripe and Lemon Squeezy integration with subscription management
- **CMS** — Payload CMS v3 with admin panel and Builder.io visual editing
- **AI** — OpenAI and Anthropic integrations ready to use
- **Components** — 100+ components built on Shadcn/UI and Radix UI
- **Database** — Drizzle ORM with PostgreSQL, type-safe queries
- **Email** — Resend for transactional emails
- **Analytics** — Vercel Analytics and PostHog integration

## Tech Stack

- [Next.js 16](https://nextjs.org) with App Router
- [TypeScript](https://typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [NextAuth.js v5](https://authjs.dev)
- [Payload CMS](https://payloadcms.com)

## Deploy Your Own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshipkit-io%2Fbones&project-name=bones-app&repository-name=bones-app)

## How to Use

Execute the following command to create a local copy:

```bash
npx create-next-app --example https://github.com/shipkit-io/bones bones-app
```

Then install dependencies and start the development server:

```bash
cd bones-app
pnpm install
pnpm dev
```

The app will be available at [localhost:3000](http://localhost:3000). No environment variables are required — features enable automatically when their respective env vars are configured.

## Learn More

- [Bones Documentation](https://bones.sh)
- [GitHub Repository](https://github.com/shipkit-io/bones)
