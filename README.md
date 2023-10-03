<p align="center">
  <a href="https://vercel.com">
    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" height="96">
    <h3 align="center">Vercel Examples</h3>
  </a>
</p>

Enjoy our curated collection of examples and solutions. Use these patterns to build your own robust and scalable applications.
We're going to be shipping new examples weekly. Stay tuned!

- [Edge Functions](/edge-functions) – Build high-performance APIs that are deployed to every Edge Network region. [Learn more.](https://vercel.com/docs/concepts/functions/edge-functions)
- [Edge Middleware](/edge-middleware) – Provide speed and personalization to your users. [Learn more.](https://vercel.com/docs/concepts/functions/edge-middleware)
- [Solutions](/solutions) – Demos, Architectures, and Best Practices
- [Starter](/starter) – Fully functional applications that encompass an idea as a robust starting point.

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
