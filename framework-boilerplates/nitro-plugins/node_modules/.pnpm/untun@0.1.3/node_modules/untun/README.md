# 🚇 untun

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]

[![License][license-src]][license-href]

Tunnel your local HTTP(s) server to the world!

Powered by 🔥 [Cloudflare Quick Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare/) and used by 👂 [unjs/listhen](https://github.com/unjs/listhen).

## Usage (CLI)

Globally run tunnel with `npx`:

```sh
npx untun@latest tunnel http://localhost:3000
```

```
◐ Starting cloudflared tunnel to http://localhost:3000
ℹ Waiting for tunnel URL...
✔ Tunnel ready at https://unjs-is-awesome.trycloudflare.com
```

Use `npx untun tunnel --help` for more usage info.

## Usage (API)

Install package:

```sh
# npm
npm install untun

# yarn
yarn add untun

# pnpm
pnpm install untun
```

Import:

```ts
// ESM
import { startTunnel } from "untun";

// CommonJS
const { startTunnel } = require("untun");
```

Start tunnel:

```ts
const tunnel = await startTunnel({ port: 3000 });
```

## Options

### `url`

- Default: `{protocol}://{hostname}:{port}`

The local server URL to tunnel.

### `port`

- Default: `3000`

The local server PORT (only effective if `url` is not provided).

### `hostname`

- Default: `localhost`

The local server hostname (only effective if `url` is not provided).

### `protocol`

- Default: `http`

The local server protocol (only effective if `url` is not provided).

### `verifyTLS`

- Default: `false`

Verify local server TLS certificate.

### `acceptCloudflareNotice`

- Default: `false`
- Environment variable: `UNTUN_ACCEPT_CLOUDFLARE_NOTICE`

Accept cloudflare TOS by default.

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💛

Published under [MIT License](./LICENSE).

cloudflared integration based on a fork of [JacobLinCool/node-cloudflared](https://github.com/JacobLinCool/node-cloudflared)

Your installation of cloudflared software constitutes a symbol of your signature indicating that you accept the terms of the Cloudflare [License](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/license/), [Terms](https://www.cloudflare.com/terms/) and [Privacy Policy](https://www.cloudflare.com/privacypolicy/).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/untun?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/untun
[npm-downloads-src]: https://img.shields.io/npm/dm/untun?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/untun
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/untun/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/untun
[bundle-src]: https://img.shields.io/bundlephobia/minzip/untun?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=untun
[license-src]: https://img.shields.io/github/license/unjs/untun.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/unjs/untun/blob/main/LICENSE
