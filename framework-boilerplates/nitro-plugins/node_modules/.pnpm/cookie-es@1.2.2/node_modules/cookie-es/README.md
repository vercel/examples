
# 🍪 cookie-es

<!-- automd:badges bundlejs -->

[![npm version](https://img.shields.io/npm/v/cookie-es)](https://npmjs.com/package/cookie-es)
[![npm downloads](https://img.shields.io/npm/dm/cookie-es)](https://npmjs.com/package/cookie-es)
[![bundle size](https://img.shields.io/bundlejs/size/cookie-es)](https://bundlejs.com/?q=cookie-es)

<!-- /automd -->

🍪 [`Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie) and [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) parser and serializer based on [cookie](https://github.com/jshttp/cookie) and [set-cookie-parser](https://github.com/nfriedly/set-cookie-parser) with dual ESM/CJS exports and bundled types. 🎁

## Usage

Install:

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install cookie-es

# npm
npm install cookie-es

# yarn
yarn add cookie-es

# pnpm
pnpm install cookie-es

# bun
bun install cookie-es
```

<!-- /automd-->

Import:


<!-- automd:jsimport cdn cjs src=./src/index.ts -->

**ESM** (Node.js, Bun)

```js
import {
  parse,
  serialize,
  parseSetCookie,
  splitSetCookieString,
} from "cookie-es";
```

**CommonJS** (Legacy Node.js)

```js
const {
  parse,
  serialize,
  parseSetCookie,
  splitSetCookieString,
} = require("cookie-es");
```

**CDN** (Deno, Bun and Browsers)

```js
import {
  parse,
  serialize,
  parseSetCookie,
  splitSetCookieString,
} from "https://esm.sh/cookie-es";
```

<!-- /automd -->


## License

[MIT](./LICENSE)
