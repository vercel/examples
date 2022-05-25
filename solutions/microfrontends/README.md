---
name: Microfrontends
slug: microfrontends
description: Microfrontends allow teams to work independently of each other by splitting the application into smaller, shareable, and modular components.
framework: Next.js
useCase: Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/microfrontends&project-name=microfrontends&repository-name=microfrontends
demoUrl: https://microfrontends.vercel.app
---

# Microfrontends

Microfrontends allow teams to work independently of each other by splitting the application into smaller, shareable, and modular components.

The main goal of microfrontends is to improve collaboration between teams and overall DX, and we should be able to do this without hurting performance (UX).

We recomming reading the [How it works](#how-it-works) section to understand the reasoning behind our implementation.

## Demo

https://microfrontends.vercel.app

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/microfrontends&project-name=microfrontends&repository-name=microfrontends)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/microfrontends microfrontends
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/microfrontends microfrontends
```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

## How it works

There are many ways of doing Microfrontends, what you do depends almost entirely on how do you want to structure your applications and teams. There is no one way to do it, so we'll share different approaches and how they work.

### Monorepo Support

One of the challenges of building Microfrontends is dependency management and a build system at the top, in the packages and apps in this monorepo we'll be using Turborepo and Changesets to get an amazing DX with minor configuration.

### Design System with Tailwind and CSS Modules

[./packages/acme-design-system](./packages/acme-design-system) features multiple components with CSS Modules and [Tailwind](https://tailwindcss.com/). The components are installed in the app as a npm dependency and Next.js takes care of compiling them thanks to [`next-transpile-modules`](https://github.com/martpie/next-transpile-modules).

The benefits of using `next-transpile-modules` is that the CSS optimizations Next.js does (and CSS Modules support) is available to the components, that way you don't need to include global CSS files that usually have more CSS than needed.

HMR and React Fast Refresh work as expected because the components are part of the Next.js build and tracked just like components defined in the app.

> The downside of depending in `next-transpile-modules` is that you have to ship uncompiled components to npm that will need to be compiled by the app where they're used. One way of shipping both compiled and uncompiled components is to create a wrapper package that exports the compiled version of the components.

### Pages Living Outside the Next.js App

[./packages/pages](./packages/pages) contains all the pages that are used in the Next.js app. They are all compiled with `next-transpile-modules` too and work in the same way as [./packages/acme-design-system](./packages/acme-design-system).

The only difference to take into account when taking this approach is that dead code elimination when there's server only code (for example when using `getStaticProps`, `getStaticPaths` or `getServerSideProps`) can't be properly distinguished by the Next.js app, so to avoid including server code in pages it's recommended to have data fetching methods in a different file and import them from the page in the Next.js app.

### Multi Zones

[Multi Zones](https://nextjs.org/docs/advanced-features/multi-zones) are a way of having independent Next.js applications that merge on a common domain, this is commonly seen as a way of separation of concerns in large teams.

[./apps/main](./apps/main) is our main app, and [./apps/docs](./apps/docs) is the docs app that handles all routes for [`/docs/**`](./apps/main/next.config.js). In the demo you'll notice that navigating to `/docs` keeps you in the same domain, that's multi zones! We have multiple apps in the same domain, but they're independent of each other.

You might have also noticed that transitions to `/docs` and back to `/` are not that smooth and it's doing a page refresh, this is because Next.js apps can't share their JS and don't have common chunks, i.e the build output of Next.js apps isn't interchangeable.

Compared with the approaches above, there's an actual UX impact when doing multi zones, which might be or not a deal breaker depending on the use case. For that reason, we only recommend using Multi Zones for cases where you want to merge applications that could work on their own, and not as a way of arbitrarily moving pages out of an app.

For example, having a home app with your landing, marketing and legal pages and then having another app that handles all the pages related to documentation is a good separation of concerns, your users will only notice a slow transition once they move from your home app to view your documentation. Pro tip: Using `target="_blank"` in this situation is a nice improvement!

### URL Imports

> Note: [URL Imports](https://nextjs.org/docs/api-reference/next.config.js/url-imports) are stll experimental in Next.js.

TODO: `packages/utils` might be the best place to use this, a design system is likely not ideal because URL Imports won't handle atomic CSS without a considerable amount of work.

Idea: Rename `@acme/utils` to `@vercel/mf-example-url-imports` and put it on npm, using CSS Modules doesn't work here but CSS-in-JS should.

Update: Use github as the CDN to fetch the file.

### What About Polyrepos?

All the tooling and approaches explained above should work with polyrepos out of the box with the difference that when the package is outside of the Monorepo, DX is a bit more tricky because Turborepo doesn't have access to them. So in this case you can install the package in the apps and control updates with versioning, everything should work as expected but HMR will be harder in this case.

- [x] Shared components with npm and next-transpile-modules (CSS Modules, tailwind)
- [x] Shared pages with npm and next-transpile-modules (CSS Modules, tailwind)
- [] URL imports, ideally with CSS Modules support too
- [x] Monorepo support
- [x] Polyrepo support
- [x] Multi zones case in an ideal scenario to avoid hurting transitions (e.g only do /docs/\*)
- [] Multi tenants: component/page living in the website of a client (e.g embedded tweets), might be better on a different example

### What is not included

- Adding components or pages at runtime (not recommended)
- Testing setup (This is important, but won't be included in the example)
