---
name: CMS GraphQL Fragments with Sanity
slug: cms-sanity-graphql-fragments
description: A Next.js blog powered by Sanity CMS and GraphQL with ISR, featuring GraphQL fragment colocation and type-safe queries using gql.tada
framework: Next.js
useCase: CMS
css: Tailwind
deployUrl: https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/starter/cms-sanity-graphql-fragments&project-name=cms-sanity-graphql-fragments&repository-name=cms-sanity-graphql-fragments
demoUrl: https://cms-graphql-fragments.vercel.app/
ignoreE2E: true
---
# CMS GraphQL Fragments example

This example shows a Next.js blog powered by Sanity CMS and GraphQL with Incremental Static Regeneration (ISR), featuring GraphQL fragment colocation and type-safe queries.

## Demo

https://cms-graphql-fragments.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy
Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/starter/starter/cms-sanity-graphql-fragments&project-name=cms-sanity-graphql-fragments&repository-name=cms-sanity-graphql-fragments)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/starter/cms-sanity-graphql-fragments
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).


## Features

- **Server-side GraphQL queries** - No client-side GraphQL bundle using URQL
- **Type-safe GraphQL** - gql.tada for compile-time type safety and IntelliSense
- **Fragment colocation** - GraphQL fragments defined close to components
- **Incremental Static Regeneration** - Fast loading with automatic revalidation
- **Sanity CMS integration** - Full-featured content management with GraphQL API
- **TypeScript** - Full type safety throughout the stack
- **Tailwind CSS** - Modern styling with v4
- **Biome** - Fast linting and formatting

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Sanity Project

1. Create a new Sanity project at [sanity.io](https://sanity.io)
2. Copy your project ID and dataset name
3. Create a read token in your Sanity project settings

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with your Sanity details:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
NEXT_PUBLIC_SANITY_GRAPHQL_URL=https://your-project-id.api.sanity.io/v2025-02-19/graphql/production/default
```

### 4. Deploy Sanity GraphQL API

```bash
npm run sanity:deploy
```

### 5. Generate GraphQL Types

Generate TypeScript types from your Sanity schema:

```bash
npm run schema:generate
```

### 6. Create Content

1. Run Sanity Studio: `npm run sanity:dev`
2. Create content using the available schemas:

**Posts** (for blog content):
- Title (required)
- Slug (required)
- Excerpt (optional)
- Content (optional)
- Published At (required)

**Pages** (for static pages like About):
- Title (required)
- Slug (required)
- Excerpt (optional)
- Content (optional)
- SEO Settings (optional)
- Published status (required)

**Navigation Settings** (site navigation):
- Site Title (required)
- Navigation Items (required)

**Footer Settings** (site footer):
- Footer Title (required)
- Description (optional)
- Footer Links (optional)
- Social Links (optional)
- Copyright Text (optional)

### 7. Run Development Server

```bash
npm run dev
```

## Architecture

- **Server Components** - All pages are server-rendered with React 19
- **ISR with On-Demand Revalidation** - Statically generated pages with webhook-triggered revalidation (no time-based revalidation)
- **GraphQL with gql.tada** - Type-safe GraphQL queries with compile-time validation
- **URQL** - Lightweight GraphQL client for server-side data fetching
- **Fragment Colocation** - GraphQL fragments defined close to components for better maintainability
- **No client-side GraphQL** - Smaller bundle, better performance

### GraphQL Fragment Colocation

This project uses a fragment colocation pattern to keep GraphQL fragments close to the components that use them:

**For Server Components:**
```typescript
// In your server component file
const MyComponentFragment = graphql(`
  fragment MyComponent on Post {
    title
    slug
  }
`);
```

**For Client Components:**
```typescript
// my-component-fragment.ts
export const myComponentFragment = graphql(`
  fragment MyComponent on Post {
    title
    slug
  }
`);

// my-component.tsx
"use client";
import { type FragmentOf } from "@/lib/graphql";
import type { myComponentFragment } from "./my-component-fragment";

interface Props {
  data: FragmentOf<typeof myComponentFragment>;
}
```

This pattern prevents client/server boundary issues while maintaining type safety and fragment colocation.

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
- `npm run sanity:dev` - Start Sanity Studio development server
- `npm run sanity:deploy` - Deploy GraphQL API to Sanity
- `npm run schema:generate` - Generate GraphQL types from Sanity schema

## Project Structure

```
src/
├── app/
│   ├── [name]/             # Dynamic pages (e.g., /about)
│   │   ├── page.tsx        # Dynamic page component
│   │   └── not-found.tsx   # 404 for dynamic pages
│   ├── api/
│   │   └── revalidate/     # ISR revalidation endpoint
│   │       └── route.ts
│   ├── posts/[slug]/       # Blog post pages
│   │   ├── page.tsx        # Individual post page
│   │   └── not-found.tsx   # 404 page for posts
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (posts list)
│   ├── globals.css         # Global styles
│   └── favicon.ico         # Site favicon
├── components/
│   ├── layout/
│   │   ├── footer/         # Footer components
│   │   │   ├── index.tsx
│   │   │   ├── footer-link.tsx
│   │   │   ├── social-icon.tsx
│   │   │   └── social-links.tsx
│   │   └── navigation/     # Navigation components
│   │       ├── index.tsx
│   │       ├── nav-link.tsx
│   │       └── nav-link-fragment.ts
│   └── posts/              # Post-related components
│       ├── post-card.tsx
│       └── posts-list.tsx
└── lib/
    ├── generated/          # Auto-generated GraphQL types
    │   ├── graphql-env.d.ts
    │   └── schema.graphql
    ├── graphql.ts          # GraphQL client & gql.tada setup
    └── schema.ts           # Sanity schema definitions
```
