# 🧶 knitwork

<!-- automd:badges color=yellow codecov -->

[![npm version](https://img.shields.io/npm/v/knitwork?color=yellow)](https://npmjs.com/package/knitwork)
[![npm downloads](https://img.shields.io/npm/dm/knitwork?color=yellow)](https://npm.chart.dev/knitwork)
[![codecov](https://img.shields.io/codecov/c/gh/unjs/knitwork?color=yellow)](https://codecov.io/gh/unjs/knitwork)

<!-- /automd -->

Utilities to generate JavaScript code.

## Install

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install knitwork

# npm
npm install knitwork

# yarn
yarn add knitwork

# pnpm
pnpm install knitwork

# bun
bun install knitwork

# deno
deno install knitwork
```

<!-- /automd -->

<!-- automd:jsimport cjs cdn -->

**ESM** (Node.js, Bun, Deno)

```js
import {} from "knitwork";
```

**CommonJS** (Legacy Node.js)

```js
const {} = require("knitwork");
```

**CDN** (Deno, Bun and Browsers)

```js
import {} from "https://esm.sh/knitwork";
```

<!-- /automd -->

<!-- automd:jsdocs src=./src/index.ts -->

## ESM

### `genDynamicImport(specifier, options)`

Generate an ESM dynamic `import()` statement.

### `genExport(specifier, exports?, options)`

Generate an ESM `export` statement.

### `genImport(specifier, imports?, options)`

Generate an ESM `import` statement.

**Example:**

```js
genImport("pkg", "foo");
// ~> `import foo from "pkg";`

genImport("pkg", ["foo"]);
// ~> `import { foo } from "pkg";`

genImport("pkg", ["a", "b"]);
// ~> `import { a, b } from "pkg`;

genImport("pkg", [{ name: "default", as: "bar" }]);
// ~> `import { default as bar } from "pkg`;

genImport("pkg", [{ name: "foo", as: "bar" }]);
// ~> `import { foo as bar } from "pkg`;

genImport("pkg", "foo", { attributes: { type: "json" } });
// ~> `import foo from "pkg" with { type: "json" };

genExport("pkg", "foo");
// ~> `export foo from "pkg";`

genExport("pkg", ["a", "b"]);
// ~> `export { a, b } from "pkg";`

// export * as bar from "pkg"
genExport("pkg", { name: "*", as: "bar" });
// ~> `export * as bar from "pkg";`
```

### `genTypeImport(specifier, imports, options)`

Generate an ESM `import type` statement.

## Serialization

### `genArrayFromRaw(array, indent, options)`

Serialize an array to a string.

Values are not escaped or quoted.

**Example:**

```js
genArrayFromRaw([1, 2, 3])
// ~> `[1, 2, 3]`
```

### `genObjectFromRaw(object, indent, options)`

Serialize an object to a string.

Values are not escaped or quoted.

**Example:**

```js
genObjectFromRaw({ foo: "bar", test: '() => import("pkg")' })
// ~> `{ foo: bar, test: () => import("pkg") }`
```

### `genObjectFromRawEntries(array, indent, options)`

Serialize an array of key-value pairs to a string.

Values are not escaped or quoted.

### `genObjectFromValues(obj, indent, options)`

Serialize an object to a string.

Values are escaped and quoted if necessary.

**Example:**

```js
genObjectFromValues({ foo: "bar" })
// ~> `{ foo: "bar" }`
```

## String

### `escapeString(id)`

Escape a string for use in a javascript string.

### `genSafeVariableName(name)`

Generate a safe javascript variable name.

### `genString(input, options)`

Generate a string with double or single quotes and handle escapes.

## Typescript

### `genAugmentation(specifier)`

Generate typescript `declare module` augmentation.

### `genInlineTypeImport(specifier, name, options)`

Generate an typescript `typeof import()` statement for default import.

### `genInterface(name, contents?, options, indent)`

Generate typescript interface.

### `genTypeExport(specifier, imports, options)`

Generate a typescript `export type` statement.

### `genTypeObject(object, indent)`

Generate typescript object type.

## Utils

### `genObjectKey(key)`

Generate a safe javascript variable name for an object key.

### `wrapInDelimiters(lines, indent, delimiters, withComma)`

Wrap an array of strings in delimiters.

<!-- /automd -->

## Contribution

<details>
  <summary>Local development</summary>

- Clone this repository
- Install the latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `bun install`
- Run tests using `bun dev`

</details>

## License

<!-- automd:contributors license=MIT author="pi0,danielroe" -->

Published under the [MIT](https://github.com/unjs/knitwork/blob/main/LICENSE) license.
Made by [@pi0](https://github.com/pi0), [@danielroe](https://github.com/danielroe) and [community](https://github.com/unjs/knitwork/graphs/contributors) 💛
<br><br>
<a href="https://github.com/unjs/knitwork/graphs/contributors">
<img src="https://contrib.rocks/image?repo=unjs/knitwork" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
