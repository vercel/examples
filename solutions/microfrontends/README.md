---
name: Microfrontends
slug: microfrontends
description: Microfrontends allow teams to work independently of each other by splitting the application into smaller, shareable, and modular components.
framework: Next.js
useCase: Monorepos
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/microfrontends&project-name=microfrontends&repository-name=microfrontends&root-directory=apps/main&install-command=pnpm%20install&build-command=cd%20..%2F..%20%26%26%20pnpm%20build%3Amain&ignore-command=npx%20turbo-ignore
demoUrl: https://solutions-microfrontends.vercel.app
relatedTemplates:
  - monorepo-turborepo
  - turborepo-next-basic
  - turborepo-sveltekit-starter
---

# Microfrontends

Microfrontends allow teams to work independently of each other by splitting the application into smaller, shareable, and modular components. The primary goal for a microfrontend strategy is to reduce the size of a single application to improve developer velocity while still allowing teams to collaborate with each other.

We recommend reading the ["How it works"](#how-it-works) section to understand the reasoning behind our implementation and the ["What's included"](#whats-included) section to know more about the tools we used.

## Demo

https://solutions-microfrontends.vercel.app

## How to use

You can choose from one of the following two methods to use this repository:

### One-click deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/microfrontends&project-name=microfrontends&repository-name=microfrontends&root-directory=apps/main&install-command=pnpm%20install&build-command=cd%20..%2F..%20%26%26%20pnpm%20build%3Amain&ignore-command=npx%20turbo-ignore)

### Clone and deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/microfrontends microfrontends
```

Next, run the included Next.js apps in development mode:

```bash
pnpm dev
```

Deploy on [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://nextjs.org/docs/deployment)).

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

### Multi-Zones

[Multi-Zones](https://nextjs.org/docs/app/building-your-application/deploying/multi-zones) is a way of having independent Next.js applications that all render on a common domain. This is a method for building separation of concerns in large teams. It works well if a single domain has separate groupings of pages where a user doesn't navigate between the groups very often.

In this example, [./apps/main](./apps/main) is our main app, and [./apps/docs](./apps/docs) is a separate app that handles all routes for [`/docs/**`](./apps/main/next.config.js). In the demo, you'll notice that navigating to `/docs` keeps you in the same domain. We have multiple apps in the same domain that are built independent of each other.

You'll notice that transitions between `/docs/*` and `/` have to perform a full page refresh because the separate Next.js apps can't share their JS and don't have common chunks. Next.js prefetching is not possible here, and you have to rely on your own browser prefetching to streamline the transitions (see `packages/acme-components/src/prefetch-cross-zone-links.tsx` for an example). The slower transitions between apps may or may not be a problem depending on your specific use case. For that reason, we only recommend using Multi-Zones for cases where you have pages that are logically in separate applications but need to be served on the same domain.

For example, having a home app with your landing, marketing and legal pages and then having another app that handles all the pages related to documentation is a good separation of concerns, your users will only notice a slow transition once they move from your home app to view your documentation. Pro tip: Using `target="_blank"` in this situation is a nice improvement!

### Design System with Tailwind and CSS Modules

[./packages/acme-design-system](./packages/acme-design-system) features multiple components with CSS Modules and [Tailwind](https://tailwindcss.com/). The components are installed in the app as a dependency and the compilation step is handled by [SWC](https://swc.rs/).

All the CSS used by the app and components is unified by Tailwind, so having components outside the app doens't increase the CSS bundle size.

HMR and React Fast Refresh work as expected even though the components live outside the app and have a different build process.

### Monorepo Support

This example uses a monorepo to make it easier to share code across separate microfrontends. When a change is made to a component used by multiple applications, the developer only has to change one repository and Vercel will automatically deploy all affected applications. This example uses [Turborepo](https://turborepo.org/) to improve the monorepo experience.

### Polyrepos

While a monorepo is very useful, the tooling and approaches described above should also work with polyrepos. The most important difference is that, when packages are outside of your application's repository, you won't be able to have hot module reloading for your packages out-of-the-box. In this case, you will install the package in your applications and control updates with versioning. To earn HMR, you would need to [link node modules with a package manager](https://pnpm.io/cli/link). Any time the common code is changed, the package version would need to be bumped and consumers would have to update their dependency and release the application.

### Module Federation

Module federation is a strategy for building applications in a large organization with many teams that want to prioritize shipping velocity. We encourage you to research module federation as an option for helping teams build as a part of a large organization where teams may not have the opportunity to communicate and work together.

## Versioning & Publishing Packages

If sharing code across repositories, [Changesets](https://github.com/changesets/changesets) is a great tool to manage versions, create changelogs, and publish to npm. It's preconfigured in this example so you can start publishing packages immediately.

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
