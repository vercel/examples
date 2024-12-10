# Internal Directory

This directory contains internal tools and scripts used for maintaining and deploying the examples in this repository.

## Purpose and Usage

The files within the `internal` directory serve various purposes, such as managing dependencies, updating templates, and running tests. Below is a brief explanation of each file:

- `.gitignore`: Specifies files and directories that should be ignored by Git.
- `.npmrc`: Configuration file for npm, enabling auto-installation of peer dependencies.
- `fields.json`: Defines the structure and validation rules for the templates.
- `package.json`: Lists the dependencies and scripts for the internal tools.
- `pnpm-lock.yaml`: Lockfile for pnpm, ensuring consistent installations.
- `pnpm-workspace.yaml`: Configuration file for pnpm workspaces, specifying the packages and apps in the workspace.
- `publishing-templates.md`: Instructions for Vercel employees on how to publish templates to Contentful.
- `readme.md`: Provides an overview of the internal tools and their usage.
- `turbo.json`: Configuration file for Turborepo, defining the pipeline for building, testing, and deploying the examples.
