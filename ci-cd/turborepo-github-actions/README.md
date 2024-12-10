# GitHub Actions + Turborepo + Vercel CLI

This demo is based on the [Turborepo starter](https://github.com/vercel/turbo/tree/main/examples/basic).

It uses a GitHub Actions workflows to build and deploy applications.

- `web` is built using `vc deploy` to build and deploy on Vercel.
- `docs` is built using `vc build` and `vc deploy --prebuilt` to show how you can take more control of your build and deploy process. This process builds the application in the GitHub Action, and then deploys those prebuilt assets to Vercel.

Additionally, a `foo` internal package has been added to demonstrate how to use the `turbo` CLI to build internal dependencies prior to building the `docs` application with the Vercel CLI.

## Purpose and Usage

The purpose of this directory is to demonstrate how to use GitHub Actions with Turborepo and Vercel CLI to build and deploy applications. It provides examples of building and deploying applications using different approaches, such as using `vc deploy` and `vc build` with `vc deploy --prebuilt`.

## Directory Structure

- `.gitignore`: Specifies files and directories to be ignored by Git.
- `.npmrc`: Configuration file for npm.
- `package.json`: Contains metadata about the project and its dependencies.
- `pnpm-lock.yaml`: Lockfile for pnpm.
- `pnpm-workspace.yaml`: Configuration file for pnpm workspace.
- `turbo.json`: Configuration file for Turborepo.

## Dependencies and Installation

To get started with the examples in this directory, you need to have the following dependencies installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [pnpm](https://pnpm.io/) (version 6 or higher)

To install the dependencies, run the following command:

```bash
pnpm install
```
