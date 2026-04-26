---
name: Blog Starter with Next.js and MDX
slug: blog-next-log
description: A personal developer blog powered by Next.js 15, MDX, and Tailwind CSS v4. Features dark mode, dynamic OG images, RSS feed, Table of Contents, and resume page.
framework: Next.js
useCase:
  - Starter
  - Blog
css: Tailwind CSS
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstarter%2Fblog-next-log&project-name=blog-next-log&repository-name=blog-next-log
demoUrl: https://create-next-log-demo.vercel.app
relatedTemplates:
  - blog-starter-kit
  - nextjs-boilerplate
---

# Blog Starter with Next.js and MDX

A fully-featured, config-driven personal developer blog built with Next.js 15 (App Router), MDX, and Tailwind CSS v4.

## Features

- MDX blog posts with syntax highlighting and copy button
- Dark / Light mode with system preference detection
- Dynamic OG image generation per post
- Auto-generated sitemap and RSS feed
- Table of Contents (auto-generated from headings)
- Resume page generator
- SEO optimizations (JSON-LD, canonical URLs, robots.txt)
- Fully responsive (desktop, tablet, mobile)

## Demo

[create-next-log-demo.vercel.app](https://create-next-log-demo.vercel.app)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstarter%2Fblog-next-log&project-name=blog-next-log&repository-name=blog-next-log)

## How to use

You can also use the CLI scaffolder for a fully customized setup:

```bash
npx create-next-log
```

Or clone and deploy manually:

```bash
git clone https://github.com/vercel/examples/tree/main/starter/blog-next-log
cd blog-next-log
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## Configuration

All settings live in `next-log.config.ts`:

```typescript
const config = {
  title: "My Dev Blog",
  description: "Thoughts on web development",
  url: "https://myblog.com",
  language: "en",
  author: { name: "Jane Doe" },
  social: { github: "", linkedin: "" },
  theme: { primaryColor: "#2563eb" },
};
```

## Writing posts

```bash
npm run new-post "my-first-post"
```

Edit `posts/my-first-post/index.mdx` and set `published: true` when ready.

## Tech Stack

- [Next.js 15](https://nextjs.org) — App Router
- [MDX](https://mdxjs.com) — Rich content with React components
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-first config
- [Radix UI](https://www.radix-ui.com) — Accessible primitives
