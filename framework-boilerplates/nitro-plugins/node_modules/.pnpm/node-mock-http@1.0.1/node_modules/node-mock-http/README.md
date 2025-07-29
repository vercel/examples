# node-mock-http

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/node-mock-http?color=yellow)](https://npmjs.com/package/node-mock-http)
[![npm downloads](https://img.shields.io/npm/dm/node-mock-http?color=yellow)](https://npm.chart.dev/node-mock-http)

<!-- /automd -->

Node.js [`http.IncomingMessage`](https://nodejs.org/api/http.html#class-httpincomingmessage) and [`http.ServerResponse`](https://nodejs.org/api/http.html#class-httpserverresponse) mocked implementations that allows emulate calling Node.js http handlers. (based on [unjs/unenv v1](https://github.com/unjs/unenv/tree/v1)).

## Usage

> [!NOTE]
> Documentation is incomplete!

```js
import { fetchNodeRequestHandler } from "node-mock-http";

const nodeHandler = (req, res) => {
  res.end("OK!");
};

const res = await fetchNodeRequestHandler(
  nodeHandler,
  "http://example.com/test",
);
```

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Build project in stub mode using `pnpm build --stub`
- Run interactive tests using `pnpm dev`

</details>

## License

<!-- automd:contributors license=MIT -->

Published under the [MIT](https://github.com/unjs/node-mock-http/blob/main/LICENSE) license.
Made by [community](https://github.com/unjs/node-mock-http/graphs/contributors) 💛
<br><br>
<a href="https://github.com/unjs/node-mock-http/graphs/contributors">
<img src="https://contrib.rocks/image?repo=unjs/node-mock-http" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
