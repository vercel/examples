# GitHub Actions + Turborepo + Vercel CLI

This demo is based on the [Turborepo starter](https://github.com/vercel/turbo/tree/main/examples/basic).

It uses a GitHub Actions workflow to build and deploy the `docs` application.

Additionally, a `foo` internal package has been added to demonstrate how to use the `turbo` CLI to build internal dependencies prior to building the `docs` application with the Vercel CLI.
