![RedwoodJS Logo](https://github.com/vercel/vercel/blob/main/packages/frameworks/logos/redwoodjs.svg)

# RedwoodJS Example

This directory is a brief example of a [RedwoodJS](https://redwoodjs.com) app with [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions) that can be deployed to Vercel with zero configuration.

## Deploy Your Own

Deploy your own RedwoodJS project, along with Serverless Functions, with Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/framework-boilerplates/redwoodjs&template=redwoodjs)

_Live Example: https://redwood-template.vercel.app_

### How We Created This Example

To get started with RedwoodJS on Vercel, you can [use Yarn to initialize](https://redwoodjs.com/tutorial/installation-starting-development) the project:

```shell
$ yarn create redwood-app ./my-redwood-app
```

This repository enables the [Corepack](https://vercel.com/docs/builds/configure-a-build#corepack) using the [build.env](https://vercel.com/docs/project-configuration#build.env) property in the `vercel.json` file. However, we recommend adding `ENABLE_EXPERIMENTAL_COREPACK=1` as an Environment Variable in your project settings instead.