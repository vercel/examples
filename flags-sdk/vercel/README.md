---
name: Flags SDK with Vercel
slug: flags-sdk-vercel
description: Learn to use the Flags SDK with the Vercel adapter for feature flags in Next.js applications.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk%2Fvercel&env=FLAGS_SECRET&envDescription=Secret%20for%20Flags%20SDK&envLink=https%3A%2F%2Fflags-sdk.dev%2Fdocs%2Fapi-reference%2Fnext%2Fflags-discovery-endpoint&project-name=flags-sdk-vercel&repository-name=flags-sdk-vercel
demoUrl: https://flags-sdk-vercel.vercel.app
relatedTemplates:
  - feature-flag-hypertune
  - feature-flag-split
---

# Flags SDK with Vercel

This example demonstrates how to use the [Flags SDK](https://flags-sdk.dev) with the Vercel adapter (`@flags-sdk/vercel`) to implement feature flags in a Next.js application.

The Flags SDK provides a type-safe, framework-agnostic way to work with feature flags. Combined with the Vercel adapter, you get seamless integration with the Vercel Toolbar for local development and flag overrides.

## Features

- Type-safe feature flag definitions
- Server-side flag evaluation
- Vercel Toolbar integration for flag overrides
- Edge-compatible flag evaluation

## How it works

1. **Flag Definitions**: Flags are defined in `lib/flags.ts` using the `flag` function from the Flags SDK
2. **Vercel Adapter**: The `@flags-sdk/vercel` adapter enables integration with Vercel's infrastructure
3. **Toolbar Integration**: The `.well-known/vercel/flags` route exposes flag metadata for the Vercel Toolbar

## Deploy with Vercel

Deploy this example with Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk%2Fvercel&env=FLAGS_SECRET&envDescription=Secret%20for%20Flags%20SDK&envLink=https%3A%2F%2Fflags-sdk.dev%2Fdocs%2Fapi-reference%2Fnext%2Fflags-discovery-endpoint&project-name=flags-sdk-vercel&repository-name=flags-sdk-vercel)

## Environment Variables

You will need to set the following environment variable:

- `FLAGS_SECRET`: A secret used to secure the flags endpoint. Generate one with:
  ```bash
  node -e "console.log(crypto.randomBytes(32).toString('base64url'))"
  ```

## Develop locally

1. Clone this repository and `cd` into the project directory
2. Run `vercel link` to link to your Vercel project
3. Run `vercel env pull .env.development.local` to pull environment variables
4. Run `pnpm i` to install dependencies
5. Run `pnpm dev` to start the development server

## Adding new flags

To add a new flag, update the `lib/flags.ts` file:

```typescript
export const myNewFlag = flag<boolean>({
  key: 'my-new-flag',
  decide: () => false,
})
```

Then use it in your components:

```typescript
import { myNewFlag } from '@/lib/flags'

export default async function Page() {
  const showFeature = await myNewFlag()
  return showFeature ? <NewFeature /> : <OldFeature />
}
```
