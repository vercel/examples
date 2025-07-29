# 💾 Unstorage

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Codecov][codecov-src]][codecov-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

<!--[![Github Actions][github-actions-src]][github-actions-href]-->

Unstorage provides an async Key-Value storage API with conventional features like multi driver mounting, watching and working with metadata, dozens of built-in drivers and a [tiny core](https://bundlephobia.com/package/unstorage).

👉 [Documentation](https://unstorage.unjs.io)

## Features

- Designed for all environments: Browser, NodeJS, and Workers
- Lots of Built-in drivers
- Asynchronous API
- Unix-style driver mounting to combine storages
- Default [in-memory](https://unstorage.unjs.io/drivers/memory) storage
- Tree-shakable utils and tiny core
- Auto JSON value serialization and deserialization
- Binary and raw value support
- State [snapshots](https://unstorage.unjs.io/getting-started/utils#snapshots) and hydration
- Storage watcher
- HTTP Storage with [built-in server](https://unstorage.unjs.io/guide/http-server)

## Usage

Install `unstorage` npm package:

```sh
# yarn
yarn add unstorage

# npm
npm install unstorage

# pnpm
pnpm add unstorage
```

```js
import { createStorage } from "unstorage";

const storage = createStorage(/* opts */);

await storage.getItem("foo:bar"); // or storage.getItem('/foo/bar')
```

👉 Check out the [the documentation](https://unstorage.unjs.io) for usage information.

## Nightly release channel

You can use the nightly release channel to try the latest changes in the `main` branch via [`unstorage-nightly`](https://www.npmjs.com/package/unstorage-nightly).

If directly using `unstorage` in your project:

```json
{
  "devDependencies": {
    "unstorage": "npm:unstorage-nightly"
  }
}
```

If using `unstorage` via another tool in your project:

```json
{
  "resolutions": {
    "unstorage": "npm:unstorage-nightly"
  }
}
```

## Contribution

- Clone repository
- Install dependencies with `pnpm install`
- Use `pnpm dev` to start jest watcher verifying changes
- Use `pnpm test` before pushing to ensure all tests and lint checks passing

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/unstorage?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/unstorage
[npm-downloads-src]: https://img.shields.io/npm/dm/unstorage?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/unstorage
[github-actions-src]: https://img.shields.io/github/workflow/status/unjs/unstorage/ci/main?style=flat&colorA=18181B&colorB=F0DB4F
[github-actions-href]: https://github.com/unjs/unstorage/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/unstorage/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/unstorage
[bundle-src]: https://img.shields.io/bundlephobia/minzip/unstorage?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=unstorage
[license-src]: https://img.shields.io/github/license/unjs/unstorage.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/unjs/unstorage/blob/main/LICENSE
