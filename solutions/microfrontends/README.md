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

We recommend reading the [How it works](#how-it-works) section to understand the reasoning behind our implementation and the [What's Included](#whats-included) section to know more about the tools we used.

## Demo

https://solutions-microfrontends.vercel.app

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

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

## What's included?

The example is a monorepo with [Turborepo](https://turborepo.org/) with the following setup:

- Everything is in [TypeScript](https://www.typescriptlang.org/)
- Next.js is used for the applications in [./apps](./apps)
- Packages used by the applications live in [./packages](./packages)
- [Tailwind CSS](https://tailwindcss.com) is used in most React components and its setup is shared in the [`acme-tailwind-config`](./packages/acme-tailwind-config) package
- Storybook is used for the components that are part of the [`acme-design-system`](./packages/acme-design-system) package and its setup is shared in the [`acme-storybook`](./packages/acme-storybook) package
- [`next-transpile-modules`](https://github.com/martpie/next-transpile-modules) is used for packages that use CSS Modules
- The Eslint config lives in [eslint-config-acme](./packages/eslint-config-acme)

## How it works

There are many ways of doing Microfrontends, what you do depends almost entirely on how do you want to structure your applications and teams. There is no one way to do it, so we'll share different approaches and how they work.

### Monorepo Support

One of the challenges of building Microfrontends is dependency management and a build system at the top, in the packages and apps in this monorepo we'll be using [Turborepo](https://turborepo.org/) and Changesets to get an amazing DX with minor configuration.

### Design System with Tailwind and CSS Modules

[./packages/acme-design-system](./packages/acme-design-system) features multiple components with CSS Modules and [Tailwind](https://tailwindcss.com/). The components are installed in the app as a npm dependency and Next.js takes care of compiling them thanks to [`next-transpile-modules`](https://github.com/martpie/next-transpile-modules).

The benefits of using `next-transpile-modules` is that the CSS optimizations Next.js does (and CSS Modules support) is available to the components, that way you don't need to include global CSS files that usually have more CSS than needed.

HMR and React Fast Refresh work as expected because the components are part of the Next.js build and tracked just like components defined in the app.

> The downside of depending in `next-transpile-modules` is that you have to ship uncompiled components to npm that will need to be compiled by the app where they're used. One way of shipping both compiled and uncompiled components is to create a wrapper package that exports the compiled version of the components.

### Pages Living Outside the Next.js App

[./packages/acme-pages](./packages/acme-pages) contains all the pages that are used in the Next.js app. They are all compiled with `next-transpile-modules` too and work in the same way as [./packages/acme-design-system](./packages/acme-design-system).

The only difference to take into account when taking this approach is that dead code elimination when there's server only code (for example when using `getStaticProps`, `getStaticPaths` or `getServerSideProps`) can't be properly distinguished by the Next.js app, so to avoid including server code in pages it's recommended to have data fetching methods in a different file and import them from the page in the Next.js app.

### Multi Zones

[Multi Zones](https://nextjs.org/docs/advanced-features/multi-zones) are a way of having independent Next.js applications that merge on a common domain, this is commonly seen as a way of separation of concerns in large teams.

[./apps/main](./apps/main) is our main app, and [./apps/docs](./apps/docs) is the docs app that handles all routes for [`/docs/**`](./apps/main/next.config.js). In the demo you'll notice that navigating to `/docs` keeps you in the same domain, that's multi zones! We have multiple apps in the same domain, but they're independent of each other.

You might have also noticed that transitions to `/docs` and back to `/` are not that smooth and it's doing a page refresh, this is because Next.js apps can't share their JS and don't have common chunks (and prefetching isn't possible either), i.e the build output of Next.js apps isn't interchangeable.

Compared with the approaches above, there's an actual UX impact when doing multi zones, which might be or not a deal breaker depending on the use case. For that reason, we only recommend using Multi Zones for cases where you want to merge applications that could work on their own, and not as a way of arbitrarily moving pages out of an app.

For example, having a home app with your landing, marketing and legal pages and then having another app that handles all the pages related to documentation is a good separation of concerns, your users will only notice a slow transition once they move from your home app to view your documentation. Pro tip: Using `target="_blank"` in this situation is a nice improvement!

### What About Polyrepos?

All the tooling and approaches explained above should work with polyrepos out of the box with the difference that when the package is outside of the Monorepo, DX is a bit more tricky because Turborepo doesn't have access to them. So in this case you can install the package in the apps and control updates with versioning, everything should work as expected but HMR will be harder in this case.

### What About Module Federation?

> **What is Module Federation (MF)?**
>
> According to [Webpack docs](https://webpack.js.org/concepts/module-federation/): "Multiple separate builds should form a single application. These separate builds should not have dependencies between each other, so they can be developed and deployed individually."

Next.js has been doing MF for a long time as pages are independent builds, optimized by having common chunks for shared libraries (react, components, etc), that way navigations only download the chunk of the new page. This is made possible thanks to Next.js owning the build system, it has full control over versioning, JS load, hashing (important for caching) and more.

So, what's the issue with MF? It's similar to the downsides of [Multi Zones](#multi-zones), where a navigation requires a full page refresh with a higher JS load because there aren't common chunks between the apps. But that's not all.

One of the popular use cases for MF we hear often is runtime injection of code, which is made with the intention of updating **the JS assets** of a site without rebuilding the site, to "improve development speed (DX) and ship faster", however, before diving into that route we highly recommend you to consider the following red flags of having independent build systems and merging them together:

- There shouldn't be a way to ship new JS to your site without first testing the site as a whole, which requires building the site, deploying it and going through checks (CI/CD), or otherwise you'll risk breaking the site with every live change. This gets worse if CI/CD runs your testing and is ignored in order to deploy to production faster, and it gets exponentially worse as teams grow. **Always build your whole app and run your entire CI/CD pipeline to keep your team in [the pit of success](https://blog.codinghorror.com/falling-into-the-pit-of-success/)**
- It's quite hard to keep the JS payload stable and in a reasonable size when builds don't have knowledge of each other, you'll need to figure a way to lock versions and define common chunks so that apps don't include different versions of the same libraries nor include them multiple times
- Upgrading versions can prove to be a painful task especially on large teams where you'll need to wait for multiple approval of changes in apps outside your scope, defeating the initial purpose of improving DX.
  - What ends up happening is teams start to diverge and ship their own libraries in their preferred versions, so now **what started as a way to improve DX will now hurt your performance and overrall UX**
- MF often involves merging builds (JS scripts) in the browser and doesn't go further away from that, this is bad for performance because it means users need to wait for the browser to execute JS before interacting with the page, however it makes sense, because if you wanted to do something similar for pregenerated content (SSG, SSR) you would also need to do live changes to lambda functions, the CDN, Proxy, and likely more
- [Multi Zones](#multi-zones) has an important constraint that stops if from falling easily in the issues mentioned above: The app has total control over the paths it's in charge of, so it's only when you navigate to paths owned by another app that you'll see an UX hit

In general, MF is not a way to improve UX or performance in any way, it's all about DX and we don't think it does a good job at it. The approaches in this example are our take about trying to accomplish the same thing while skipping its downsides.
