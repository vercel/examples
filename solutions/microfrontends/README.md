---
name: Microfrontends
slug: microfrontends
description: Microfrontends allow teams to work independently of each other by splitting the application into smaller, shareable, and modular components.
framework: Next.js
useCase: Monorepos
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/microfrontends&project-name=microfrontends&repository-name=microfrontends&root-directory=apps/main&install-command=pnpm%20install&build-command=pnpm%20build%20--filter%3Dmain...&ignore-command=npx%20turbo-ignore
demoUrl: https://solutions-microfrontends.vercel.app
relatedTemplates:
  - monorepo-turborepo
  - turborepo-next-basic
  - turborepo-sveltekit-starter
---

# Microfrontends

Microfrontends allow teams to work independently of each other by splitting the application into smaller, shareable, and modular components. The primary goal for a microfrontend strategy is to improve collaboration across teams of developers.

We recommend reading the ["How it works"](#how-it-works) section to understand the reasoning behind our implementation and the ["What's included"](#whats-included) section to know more about the tools we used.

## Demo

https://solutions-microfrontends.vercel.app

## How to use

You can choose from one of the following two methods to use this repository:

### One-click deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/microfrontends&project-name=microfrontends&repository-name=microfrontends&root-directory=apps/main&install-command=pnpm%20install&build-command=pnpm%20build%20--filter%3Dmain...&ignore-command=npx%20turbo-ignore)

### Clone and deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/microfrontends microfrontends
```

Next, run the included Next.js apps in development mode:

```bash
pnpm dev
```

Deploy on [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

## What's Included?

The example is a monorepo built with [Turborepo](https://turborepo.org/) with the following setup:

- Everything is in [TypeScript](https://www.typescriptlang.org/)
- Next.js is used for the applications in [./apps](./apps)
- Shared packages used by the apps in [./packages](./packages)
- [Tailwind CSS](https://tailwindcss.com) for utility CSS in React components and to build the design system
- Storybook is used for the components that are part of the [`acme-design-system`](./packages/acme-design-system) package and its setup is shared in the [`acme-storybook`](./packages/acme-storybook) package
- The ESLint config lives in [eslint-config-acme](./packages/eslint-config-acme)
- [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing of packages. Learn more in the [Versioning & Publishing Packages](#versioning--publishing-packages) section.

## How it Works

There are many strategies for designing microfrontends and your approach will be dictated by how you want to structure your applications and teams. We'll share a few different approaches and how they work.

### Monorepo Support

One of the challenges of building microfrontends is dependency management and build systems. In the packages and apps in this monorepo, we'll be using [Turborepo](https://turborepo.org/) and Changesets to earn great developer experience for our teams with minimal configuration.

### Design System with Tailwind and CSS Modules

[./packages/acme-design-system](./packages/acme-design-system) features multiple components with CSS Modules and [Tailwind](https://tailwindcss.com/). The components are installed in the app as a dependency and the compilation step is handled by [SWC](https://swc.rs/).

All the CSS used by the app and components is unified by Tailwind, so having components outside the app doens't increase the CSS bundle size.

HMR and React Fast Refresh work as expected even though the components live outside the app and have a different build process.

### Pages Living Outside the Next.js App

[./packages/acme-pages](./packages/acme-pages) contains all the pages that are used in the Next.js app. They are compiled with [SWC](https://swc.rs/) and work in the same way as [./packages/acme-design-system](./packages/acme-design-system).

With this approach, we will need to be mindful of dead code elimination when there is server-only code (e.g. `getStaticProps`, `getStaticPaths` or `getServerSideProps`) which can't be properly distinguished by the Next.js app. To avoid including server code in pages, it's recommended to have data fetching methods in a different file and import them from the page in the Next.js app.

### Multi Zones

[Multi Zones](https://nextjs.org/docs/advanced-features/multi-zones) are a way of having independent Next.js applications that merge on a common domain. This is a method for building separation of concerns in large teams.

In this example, [./apps/main](./apps/main) is our main app, and [./apps/docs](./apps/docs) is a separate app that handles all routes for [`/docs/**`](./apps/main/next.config.js). In the demo, you'll notice that navigating to `/docs` keeps you in the same domain. We have multiple apps in the same domain that are built independent to each other.

You'll notice that transitions between `/docs/*` and `/` are not as smooth as you're used to with typical Next.js applications. You will get a full page refresh because Next.js apps can't share their JS and don't have common chunks, prefetching is not possible because the build outputs are different.

Compared with the internal packaging approach from above, there's a UX impact when employing a Multi Zone strategy. The slower transitions between apps may or may not be a problem depending on your specific use case. For that reason, we only recommend using Multi Zones for cases where you need to merge applications that work on their own, but not as a way of arbitrarily moving pages out of an app.

For example, having a home app with your landing, marketing and legal pages and then having another app that handles all the pages related to documentation is a good separation of concerns, your users will only notice a slow transition once they move from your home app to view your documentation. Pro tip: Using `target="_blank"` in this situation is a nice improvement!

### Polyrepos

The tooling and approaches described above should also work with polyrepos. The most important difference is that, when packages are outside of your application's repository, you won't be able to have hot module reloading for your packages out-of-the-box. In this case, you will install the package in your applications and control updates with versioning. To earn HMR, you would need to [link node modules with a package manager](https://pnpm.io/cli/link).

### Module Federation

Module federation is a strategy for building applications in a large organization with many teams that want to prioritize shipping velocity. We encourage you to research module federation as an option for helping teams build as a part of a large organization where teams may not have the opportunity to communicate and work together.

## Versioning & Publishing Packages

We enjoy using [Changesets](https://github.com/changesets/changesets) to manage versions, create changelogs, and publish to npm. It's preconfigured in this example so you can start publishing packages immediately.

> It's worth installing the [Changesets bot](https://github.com/apps/changeset-bot) on your repository to more easily manage contributions.

### Generating Changesets

To generate a changeset, run the following command in the root of the project:

```bash
pnpm changeset
```

The Changeset CLI will ask you a couple of questions:

1. **Which packages would you like to include?** – This shows which packages have changed and which have remained the same. By default, no packages are included. Press `space` to select the packages you want to include in the `changeset`.
1. **Which packages should have a major bump?** – Press `space` to select the packages you want to bump versions for.
1. If doing the first major version, confirm you want to release.
1. Write a summary for the changes.
1. Confirm the changeset looks as expected.
1. A new Markdown file will be created in the `changeset` folder with the summary and a list of the packages included.

### Publishing Changesets

The example ships with a [GitHub action](https://github.com/changesets/action) named [Release](.github/workflows/release.yml) to automatically publish changesets to npm after pushing to the `main` branch.

You'll need to create an `NPM_TOKEN` and `GITHUB_TOKEN` and then add them to your GitHub repository settings so that the action can publish to npm.

Publishing can also be done manually with:

```bash
pnpm release
```

The action will run the same `release` script defined in `package.json`, which looks like this:

```bash
turbo run build --filter=main... && changeset publish
```

Turborepo will run the `build` script for all publishable dependencies of the `main` app, excluding the `main` app itself, and then publishes the new versions to npm.

By default, this example uses `acme` as the npm organization. To change this, do the following:

- Rename folders in `packages/*` to replace `acme` with your desired scope
- Search and replace `acme` with your desired scope
- Re-run `pnpm install`
