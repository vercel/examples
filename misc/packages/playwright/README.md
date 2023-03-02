# Playwright tests for vercel/examples

This package takes care of creating a test for every example in this repo that has a `demoUrl`, and executing them with GitHub Actions.

The demo URL has to be added with front matter in the example's README.md file. For example, look at the readme file of the [add-header example](/edge-middleware/add-header/README.md).

## Contributing

To run the tests locally, install packages from the root of the repo:

```bash
pnpm install
```

Then, generate and run the tests with:

```bash
pnpm build
pnpm test
```

Feel free to make any changes and then write a PR!
