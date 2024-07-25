# GitHub Actions + Turborepo + Vercel CLI

This demo is based on the [Turborepo starter](https://github.com/vercel/turbo/tree/main/examples/basic).

It uses a GitHub Actions workflows to build and deploy applications.

- `web` is built using `vc deploy` to build and deploy on Vercel.
- `docs` is built using `vc build` and `vc deploy --prebuilt` to show how you can take more control of your build and deploy process. This process builds the application in the GitHub Action, and then deploys those prebuilt assets to Vercel.

Additionally, a `foo` internal package has been added to demonstrate how to use the `turbo` CLI to build internal dependencies prior to building the `docs` application with the Vercel CLI.
