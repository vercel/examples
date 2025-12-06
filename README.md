<p align="center">
  <a href="https://vercel.com">
    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" height="96">
    <h3 align="center">Vercel Examples</h3>
  </a>
</p>

- [Solutions](/solutions) – Demos, reference architecture, and best practices
- [Starter](/starter) – Functional applications which can act as a starting point
- And more!

## Purpose and Usage

This repository contains a collection of examples and solutions to help you build robust and scalable applications using Vercel. The examples cover various use cases, including Edge Functions, Edge Middleware, and more. You can use these examples as a starting point for your own projects or as a reference to learn best practices and patterns.

## Repository Structure

The repository is organized into several directories, each containing examples and solutions for different use cases. Here is an overview of the main directories:

- `edge-functions/`: Examples of high-performance APIs deployed to every Edge Network region.
- `edge-middleware/`: Examples of providing speed and personalization to users.
- `solutions/`: Demos, architectures, and best practices for various use cases.
- `starter/`: Fully functional applications that serve as robust starting points for new projects.
- `ci-cd/`: Continuous integration and deployment configurations for various CI/CD providers.
- `internal/`: Internal tools and scripts used for maintaining and deploying the examples.

## Dependencies and Installation

To get started with the examples in this repository, you need to have the following dependencies installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [pnpm](https://pnpm.io/) (version 6 or higher)

To install the dependencies, run the following command:

```bash
pnpm install
```

## Vercel Templates

Multiple examples are being featured in [Vercel's Templates](https://vercel.com/templates), visit that page for more advanced filtering options.

### For Vercelians

Examples that have front matter metadata will create a new Draft template in [Contentful](https://app.contentful.com), for more steps on how to publish a template, read [Publishing Templates](./internal/publishing-templates.md).

## Adding a new example

To quickly start contributing with a new example, run the following commands:

```bash
pnpm i
pnpm new-example
```

If the script above isn't used, make sure the example complies with the following:

- It must have a `.gitignore` similar to [plop-templates/example/.gitignore](./plop-templates/example/.gitignore)
- It must have a `package.json` similar to [plop-templates/example/package.json](./plop-templates/example/package.json) (usage of Next.js is optional). The license should be `MIT`
- It must have a `README.md` similar to [plop-templates/example/README.md](./plop-templates/example/README.md). The example has to be able to include a demo URL (the Vercel team will deploy it!) and if it requires environment variables, it must have a `.env.example` file and instructions on how to set them up. Take [bot-protection-datadome](./edge-middleware/bot-protection-datadome/README.md) as an example.
  - To customize the Vercel Deploy Button take a look at the [docs](https://vercel.com/docs/deploy-button), useful if the deployment has required environment variables.
- If using Next.js, it must have a `.eslintrc.json` similar to [plop-templates/example/.eslintrc.json](./plop-templates/example/.eslintrc.json)
- All Next.js examples should be using the same styling and layout provided by `@vercel/examples-ui`, its usage can be seen in the [plop template](./plop-templates/example)

### Adding a template

If you would like the example to be featured in [vercel.com/templates](https://vercel.com/templates) then also add the front matter metadata to the top of the readme, like in [bot-protection-datadome](./edge-middleware/bot-protection-datadome/README.md). To know all the possible values for each metadata take a look at [`internal/fields.json`](./internal/fields.json).

If you want to add related templates to your template, copy the `slug` from the other template into the `relatedTemplates` field, for example for [vercel.com/templates/next.js/monorepo-turborepo](https://vercel.com/templates/next.js/monorepo-turborepo) the slug is `monorepo-turborepo`, as written in [solutions/monorepo/README.md](./solutions/monorepo/README.md)

### The pre-commit hook

We use [Husky](https://typicode.github.io/husky/#/) to manage the pre-commit [Git hook](https://git-scm.com/docs/githooks) in this repo. Husky configures hooks automatically during install, so you don't need to do anything special to get them working, but if it fails to install, you can run the following command to install it manually:

```bash
pnpm run prepare
```

Code changes automatically go through Prettier and ESLint when you make a commit, **please do not skip these steps** unless they're broken and in that case let us known by creating an issue.

## Read the Docs

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

If you have any questions or suggestions about the docs, feel free to [open a discussion](https://github.com/vercel/examples/discussions), or [submit a PR](https://github.com/vercel/examples/pulls) with your suggestions!

## Provide Feedback

- [Start a Discussion](https://github.com/vercel/examples/discussions) with a question, piece of feedback, or idea you want to share with the team.
- [Open an Issue](https://github.com/vercel/examples/issues) if you believe you've encountered a bug that you want to flag for the team.
