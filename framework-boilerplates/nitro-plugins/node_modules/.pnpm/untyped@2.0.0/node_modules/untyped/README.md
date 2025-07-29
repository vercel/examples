# untyped

<!-- automd:badges bundlejs -->

[![npm version](https://img.shields.io/npm/v/untyped)](https://npmjs.com/package/untyped)
[![npm downloads](https://img.shields.io/npm/dm/untyped)](https://npm.chart.dev/untyped)
[![bundle size](https://img.shields.io/bundlejs/size/untyped)](https://bundlejs.com/?q=untyped)

<!-- /automd -->

**▶️ Check [online playground](https://untyped.unjs.io)**

## Install

<!-- automd:pm-i -->

```sh
# ✨ Auto-detect
npx nypm install untyped

# npm
npm install untyped

# yarn
yarn add untyped

# pnpm
pnpm install untyped

# bun
bun install untyped

# deno
deno install untyped
```

<!-- /automd -->

## Usage

First we have to define a reference object that describes types, defaults, and a `$resolve` method (normalizer).

```js
const defaultPlanet = {
  name: "earth",
  specs: {
    gravity: {
      $resolve: (val) => Number.parseFloat(val),
      $default: "9.8",
    },
    moons: {
      $resolve: (val = ["moon"]) => [val].flat(),
      $schema: {
        title: "planet moons",
      },
    },
  },
};
```

## API

### `resolveSchema`

```js
import { resolveSchema } from "untyped";

const schema = await resolveSchema(defaultPlanet);
```

Output:

```json
{
  "properties": {
    "name": {
      "type": "string",
      "default": "earth"
    },
    "specs": {
      "properties": {
        "gravity": {
          "default": 9.8,
          "type": "number"
        },
        "moons": {
          "title": "planet moons",
          "default": ["moon"],
          "type": "array",
          "items": [
            {
              "type": "string"
            }
          ]
        }
      },
      "type": "object"
    }
  },
  "type": "object"
}
```

### `generateTypes`

```js
import { resolveSchema, generateTypes } from "untyped";

const types = generateTypes(await resolveSchema(defaultPlanet));
```

Output:

```ts
interface Untyped {
  /** @default "earth" */
  name: string;

  specs: {
    /** @default 9.8 */
    gravity: number;

    /**
     * planet moons
     * @default ["moon"]
     */
    moons: string[];
  };
}
```

### `generateMarkdown`

```js
import { resolveSchema, generateMarkdown } from "untyped";

const markdown = generateMarkdown(await resolveSchema(defaultPlanet));
```

Output:

```markdown
# `name`

- **Type**: `string`
- **Default**: `"earth"`

# `specs`

## `gravity`

- **Type**: `number`
- **Default**: `9.8`

## `moons`

- **Type**: `array`
- **Default**: `["moon"]`
```

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`
- Use `pnpm web` to start playground website
- Use `pnpm test` before push to ensure all tests and lint checks passing

## License

[MIT](./LICENSE)

Thanks to [@dominikschreiber](https://github.com/dominikschreiber) for donating package name.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/untyped?style=flat-square
[npm-version-href]: https://npmjs.com/package/untyped
[npm-downloads-src]: https://img.shields.io/npm/dm/untyped?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/untyped
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/unjs/untyped/ci.yml?branch-main&style=flat-square
[github-actions-href]: https://github.com/unjs/untyped/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/untyped/main?style=flat-square
[codecov-href]: https://codecov.io/gh/unjs/untyped
[bundle-src]: https://img.shields.io/bundlephobia/minzip/untyped?style=flat-square
[bundle-href]: https://bundlephobia.com/result?p=untyped
