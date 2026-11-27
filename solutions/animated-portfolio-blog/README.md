---
name: Animated Portfolio Blog
slug: animated-portfolio-blog
publisher: Ali Farooqi
description: Animated single-page portfolio + Medium-sourced blog. Config-driven, dynamic OG, e2e CI.
framework:
  - Next.js
type:
  - Portfolio
  - Blog
  - Starter
css:
  - Tailwind
  - CSS
githubUrl: https://github.com/alifarooqi/portfolio-blog-starter
demoUrl: https://portfolio-blog-starter-two.vercel.app
relatedTemplates:
  - nextjs-boilerplate
  - blog
  - monorepo-turborepo
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fanimated-portfolio-blog&project-name=animated-portfolio-blog&repository-name=animated-portfolio-blog&env=NEXT_PUBLIC_SITE_URL,MEDIUM_USERNAME,NEXT_PUBLIC_GA_ID&envDescription=Canonical%20site%20URL%2C%20Medium%20username%20(no%20%40)%2C%20and%20GA4%20ID
---

# Animated Portfolio Blog

A Next.js App Router portfolio + blog starter. Animated single-page home, dynamic Open Graph cards, Medium-sourced blog, Tailwind v4 + SCSS, MIT-licensed.

![Portfolio preview](https://portfolio-blog-starter-two.vercel.app/og)

- **Animated sections** powered by `motion` — staggered entrance, scroll-spy, magnetic buttons.
- **Config-driven home page** — name, tagline, social, signature SVG, and metadata all live in `app/config/CommonConfig.ts`. Edit one file, the whole site updates.
- **Blog backed by a Medium RSS feed** — `lib/medium.ts` fetches and parses the feed, falls back to a committed snapshot if the network fails, sanitizes content with an allowlist via `isomorphic-dompurify`.
- **Dynamic Open Graph cards** — `app/og/route.tsx` renders a branded 1200×630 image per page and per blog post.
- **SEO built in** — sitemap, robots, JSON-LD `Person` and `BlogPosting` schemas, per-page metadata via `generateMetadata`.
- **Dark mode** — class-based, no flash on first paint.
- **Vercel Analytics + Speed Insights** wired up.
- **Two test layers** — Vitest unit tests for pure logic, Playwright e2e smoke tests against a real production build.

## Demo

https://portfolio-blog-starter-two.vercel.app

A live example implementation by the author is also deployed at <https://alifarooqi.vercel.app>.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fanimated-portfolio-blog&project-name=animated-portfolio-blog&repository-name=animated-portfolio-blog&env=NEXT_PUBLIC_SITE_URL,MEDIUM_USERNAME,NEXT_PUBLIC_GA_ID&envDescription=Canonical%20site%20URL%2C%20Medium%20username%20(no%20%40)%2C%20and%20GA4%20ID)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/animated-portfolio-blog animated-portfolio-blog
```

Then run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/templates) ([Documentation](https://nextjs.org/docs/app/building-your-application/deploying)).

## Configuration

Copy `.env.example` to `.env.local` and set the values:

| Var                    | Required?  | Purpose                                                                                                  |
| ---------------------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL used in sitemap, OG tags, JSON-LD. Vercel preview auto-resolves via `VERCEL_URL` if unset. |
| `NEXT_PUBLIC_GA_ID`    | Optional   | Google Analytics 4 measurement ID (e.g. `G-XXXXXXXXXX`). Empty disables analytics.                       |
| `MEDIUM_USERNAME`      | Optional   | Medium handle (no `@`) that powers `/blog`. Empty renders an empty list.                                 |

Everything else lives in code under `app/config/`.

## Upstream repository

This example is vendored from the upstream starter for inclusion in the `vercel/examples` gallery. For the latest features, issues, and PRs, see [alifarooqi/portfolio-blog-starter](https://github.com/alifarooqi/portfolio-blog-starter).