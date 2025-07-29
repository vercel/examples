# crossws

<!-- automd:badges -->

[![npm version](https://flat.badgen.net/npm/v/crossws)](https://npmjs.com/package/crossws)
[![npm downloads](https://flat.badgen.net/npm/dm/crossws)](https://npmjs.com/package/crossws)

<!-- /automd -->

Elegant, typed, and simple toolkit to implement cross-platform WebSocket servers.

👉 [📖 documentation](https://crossws.h3.dev)

## Features

🧩 Seamlessly integrates with [Bun](https://crossws.h3.dev/adapters/bun), [Cloudflare Workers](https://crossws.h3.dev/adapters/cloudflare), [Deno](https://crossws.h3.dev/adapters/deno) and [Node.js](https://crossws.h3.dev/adapters/node) and any compatible web framework.

✅ Prebundled with [ws](https://github.com/websockets/ws) for Node.js support with alternative/much faster [uWebSockets](https://crossws.h3.dev/adapters/node#uwebsockets) adapter.

📦 Extremely lightweight and tree-shakable conditional ESM exports.

🚀 High-performance and simple hooks API, without per-connection callback creation.

🌟 Typed hooks API and developer-friendly object inspection.

[^1]: crossws supports Node.js via [npm:ws](https://github.com/websockets/ws) (prebundled) or [uWebSockets.js](https://github.com/uNetworking/uWebSockets.js).

## Contribution

<details>
  <summary>Local development</summary>

- Clone this repository
- Install the latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run examples using `pnpm play:` scripts

</details>

<!-- /automd -->

## License

<!-- automd:contributors license=MIT author="pi0" -->

Published under the [MIT](https://github.com/h3js/crossws/blob/main/LICENSE) license.
Made by [@pi0](https://github.com/pi0) and [community](https://github.com/h3js/crossws/graphs/contributors) 💛
<br><br>
<a href="https://github.com/h3js/crossws/graphs/contributors">
<img src="https://contrib.rocks/image?repo=h3js/crossws" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
