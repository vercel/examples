# `compatx`

<!-- automd:badges -->

[![npm version](https://img.shields.io/npm/v/compatx)](https://npmjs.com/package/compatx)
[![npm downloads](https://img.shields.io/npm/dm/compatx)](https://npm.chart.dev/compatx)

<!-- /automd -->

🌴 Compatibility toolkit.

> [!NOTE]
> This is a WIP toolkit. See [RFC](./RFC.md) for initial motivations.

## Install

<!-- automd:pm-install dev -->

```sh
# ✨ Auto-detect
npx nypm install -D compatx

# npm
npm install -D compatx

# yarn
yarn add -D compatx

# pnpm
pnpm install -D compatx

# bun
bun install -D compatx

# deno
deno install --dev compatx
```

<!-- /automd -->

## Utils

<!-- automd:jsdocs src="./src/index.ts" -->

### `formatCompatibilityDate(input)`

Format compatibility date spec to a string

### `formatDate(date)`

Format a date to a `YYYY-MM-DD` string

**Example:**

```ts
formatDateString(new Date("2021/01/01")) // "2021-01-01"
```

### `getCompatibilityChanges(allUpdates, compatibilityDate1, compatibilityDate2)`

Get compatibility changes between two dates.

### `getCompatibilityUpdates(allUpdates, compatibilityDate)`

Get compatibility updates applicable for the user given platform and date range.

### `platforms`

- **Type**: `array`
- **Default**: `["aws","azure","cloudflare","deno","firebase","netlify","vercel"]`

### `resolveCompatibilityDates(input?, defaults?)`

Normalize the compatibility dates from input config and defaults.

### `resolveCompatibilityDatesFromEnv(overridesInput?)`

Resolve compatibility dates with environment variables as defaults.

Environment variable name format is `COMPATIBILITY_DATE` for default and `COMPATIBILITY_DATE_<PLATFORM>` for specific platforms.

<!-- /automd -->

## Types

```js
import type {
  // Typed date string in `YYYY-MM-DD` format
  DateString,
  // Platform names
  PlatformName,
  // Compatibility dates
  CompatibilityDateSpec,
  CompatibilityDates,
  // Compatibility updates
  CompatibilityUpdate,
  CompatibilityUpdates
} from "./types";
```

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💛

Published under [MIT License](./LICENSE).
