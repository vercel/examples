# 🌳 radix3

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

Lightweight and fast router for JavaScript based on [Radix Tree](https://en.wikipedia.org/wiki/Radix_tree).

## Usage

**Install package:**

```sh
# npm
npm i radix3

# yarn
yarn add radix3

# pnpm
pnpm i radix3
```

**Import:**

```js
// ESM
import { createRouter } from "radix3";

// CJS
const { createRouter } = require("radix3");
```

**Create a router instance and insert routes:**

```js
const router = createRouter(/* options */);

router.insert("/path", { payload: "this path" });
router.insert("/path/:name", { payload: "named route" });
router.insert("/path/foo/**", { payload: "wildcard route" });
router.insert("/path/foo/**:name", { payload: "named wildcard route" });
```

**Match route to access matched data:**

```js
router.lookup("/path");
// { payload: 'this path' }

router.lookup("/path/fooval");
// { payload: 'named route', params: { name: 'fooval' } }

router.lookup("/path/foo/bar/baz");
// { payload: 'wildcard route' }

router.lookup("/");
// null (no route matched for/)
```

## Methods

### `router.insert(path, data)`

`path` can be static or using `:placeholder` or `**` for wildcard paths.

The `data` object will be returned on matching params. It should be an object like `{ handler }` and not containing reserved keyword `params`.

### `router.lookup(path)`

Returns matched data for `path` with optional `params` key if mached route using placeholders.

### `router.remove(path)`

Remove route matching `path`.

## Options

You can initialize router instance with options:

```ts
const router = createRouter({
  strictTrailingSlash: true,
  routes: {
    "/foo": {},
  },
});
```

- `routes`: An object specifying initial routes to add
- `strictTrailingSlash`: By default router ignored trailing slash for matching and adding routes. When set to `true`, matching with trailing slash is different.

### Route Matcher

Creates a multi matcher from router tree that can match **all routes** matching path:

```ts
import { createRouter, toRouteMatcher } from "radix3";

const router = createRouter({
  routes: {
    "/foo": { m: "foo" }, // Matches /foo only
    "/foo/**": { m: "foo/**" }, // Matches /foo/<any>
    "/foo/bar": { m: "foo/bar" }, // Matches /foo/bar only
    "/foo/bar/baz": { m: "foo/bar/baz" }, // Matches /foo/bar/baz only
    "/foo/*/baz": { m: "foo/*/baz" }, // Matches /foo/<any>/baz
  },
});

const matcher = toRouteMatcher(router);

const matches = matcher.matchAll("/foo/bar/baz");

// [
//   {
//     "m": "foo/**",
//   },
//   {
//     "m": "foo/*/baz",
//   },
//   {
//     "m": "foo/bar/baz",
//   },
// ]
```

### Route Matcher Export

It is also possible to export and then rehydrate a matcher from pre-compiled rules.

```ts
import { exportMatcher, createMatcherFromExport } from "radix3";

// Assuming you already have a matcher
// you can export this to a JSON-type object
const json = exportMatcher(matcher);

// and then rehydrate this later
const newMatcher = createMatcherFromExport(json);

const matches = newMatcher.matchAll("/foo/bar/baz");
```

## Performance

See [benchmark](./benchmark).

## License

Based on original work of [`charlieduong94/radix-router`](https://github.com/charlieduong94/radix-router)
by [Charlie Duong](https://github.com/charlieduong94) (MIT)

[MIT](./LICENSE) - Made with ❤️

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/radix3?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/radix3
[npm-downloads-src]: https://img.shields.io/npm/dm/radix3?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/radix3
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/radix3/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/radix3
[bundle-src]: https://img.shields.io/bundlephobia/minzip/radix3?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=radix3
[license-src]: https://img.shields.io/github/license/unjs/radix3.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/unjs/radix3/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/radix3
