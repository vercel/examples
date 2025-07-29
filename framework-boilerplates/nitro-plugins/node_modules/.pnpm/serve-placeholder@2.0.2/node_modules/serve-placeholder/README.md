# ♡ serve-placeholder

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/serve-placeholder?color=yellow)](https://npmjs.com/package/serve-placeholder)
[![npm downloads](https://img.shields.io/npm/dm/serve-placeholder?color=yellow)](https://npmjs.com/package/serve-placeholder)

<!-- /automd -->

Smart placeholder for missing assets

## Why?

**💵 Rendering Errors is costly**

Serving each 404 page for assets adds extra load to the server and increases crashing chances. This is crucial for setups with server-side-rendering and removes additional SSR loads when assets like `robots.txt` or `favicon.ico` don't exist.

**👌 Meaningful Responses**

We can always send a better 404 response than an HTML page by knowing file extensions. For example, we send a fallback transparent 1x1 image for image extensions.

**🔍 SEO Friendly**

Instead of indexing invalid URLs with HTML pages, we properly send 404 and the right content type.

## Usage

Install package:

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install serve-placeholder

# npm
npm install serve-placeholder

# yarn
yarn add serve-placeholder

# pnpm
pnpm install serve-placeholder

# bun
bun install serve-placeholder
```

<!-- /automd -->

Import:

```js
// ESM
import { servePlaceholder } from "serve-placeholder";

// CommonJS
const { servePlaceholder } = require("serve-placeholder");
```

Create and add server middleware between serve-static and router middleware:

```diff
app.use('/assets', serveStatic(..))
++ app.use('/assets', servePlaceholder())
app.use('/', router)
```

Additionally, we can have a default placeholder for arbitrary routes which handles known extensions **assuming other routes have no extension**:

```diff
app.use('/assets', serveStatic(..))
app.use('/assets', servePlaceholder())
++ app.use('/', placeholder({ skipUnknown: true }))
app.use('/', router)
```

## Options

### `handlers`

A mapping from file extensions to the handler. Extensions should start with _dot_ like `.js`.

You can disable any of the handlers by setting the value to `null`

If the value of a handler is set to `false`, the middleware will be ignored for that extension.

### `statusCode`

- Default: `404`

Sets `statusCode` for all handled responses. Set to `false` to disable overriding statusCode.

### `skipUnknown`

- Default: `false`

Skip middleware when no handler is defined for the current request.

Please note that if this option is set to `true`, then `default` handler will be disabled!

### `placeholders`

- Type: `Object`

A mapping from handler to placeholder. Values can be `String` or `Buffer`. You can disable any of the placeholders by setting the value to `false`.

### `mimes`

- Type: `Object`

A mapping from handler to the mime type. Mime type will be set as `Content-Type` header. You can disable sending any of the mimes by setting the value to `false`.

### `cacheHeaders`

- Default: `true`

Set headers to prevent accidentally caching 404 resources.

When enabled, these headers will be sent:

```js
const headers = {
  "cache-control": "no-cache, no-store, must-revalidate",
  expires: "0",
  pragma: "no-cache",
};
```

### `placeholderHeader`

- Default: `true`

Sets an `X-Placeholder` header with value of handler name.

## Defaults

These are [default handlers](./src/defaults.ts). You can override every of them using provided options.

| Handler   | Extensions                                                       | Mime type                | Placeholder               |
| --------- | ---------------------------------------------------------------- | ------------------------ | ------------------------- |
| `default` | any unknown extension                                            | -                        | -                         |
| `css`     | `.css`                                                           | `text/css`               | `/* style not found */`   |
| `html`    | `.html`, `.htm`                                                  | `text/html`              | `<!-- page not found -->` |
| `js`      | `.js`                                                            | `application/javascript` | `/* script not found */`  |
| `json`    | `.json`                                                          | `application/json`       | `{}`                      |
| `map`     | `.map`                                                           | `application/json`       | [empty sourcemap v3 json] |
| `plain`   | `.txt`, `.text`, `.md`                                           | `text/plain`             | [empty]                   |
| `image`   | `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.bmp`, `.ico` | `image/gif`              | [transparent 1x1 image]   |

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## License

<!-- automd:contributors author=pi0 license=MIT -->

Published under the [MIT](https://github.com/unjs/serve-placeholder/blob/main/LICENSE) license.
Made by [@pi0](https://github.com/pi0) and [community](https://github.com/unjs/serve-placeholder/graphs/contributors) 💛
<br><br>
<a href="https://github.com/unjs/serve-placeholder/graphs/contributors">
<img src="https://contrib.rocks/image?repo=unjs/serve-placeholder" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
