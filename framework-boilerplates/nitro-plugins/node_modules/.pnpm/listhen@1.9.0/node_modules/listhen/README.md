# 👂 listhen

<!-- automd:badges -->

[![npm version](https://img.shields.io/npm/v/listhen)](https://npmjs.com/package/listhen)
[![npm downloads](https://img.shields.io/npm/dm/listhen)](https://npmjs.com/package/listhen)

<!-- /automd -->

Elegant HTTP listener!

[👉 Online Playground](https://stackblitz.com/github/unjs/listhen/tree/main/playground?startScript=dev)

## Features

✅ Dev server with HMR, static, WebSockets and TypeScript support with <a href="https://github.com/unjs/jiti">unjs/jiti</a><br>

✅ Works with Node.js, Express, and <a href="https://github.com/unjs/h3">unjs/h3</a> out of the box <br>

✅ Show the QR code of the public URL with <a href="https://github.com/unjs/uqr">unjs/uqr</a><br>

✅ Tunnel your local server to the world with <a href="https://github.com/unjs/untun">unjs/untun</a><br>

✅ Assign a port or fallback to a nicer alternative with <a href="https://github.com/unjs/get-port-please">unjs/get-port-please</a>

✅ Gracefully shutdown Server with <a href="https://github.com/thedillonb/http-shutdown">http-shutdown</a><br>

✅ Zero Config WebSockets with <a href="https://github.com/unjs/crossws">unjs/crossws</a>

✅ Copy the URL to the clipboard<br>

✅ HTTPS support with self-signed certificates<br>

✅ Open URL in browser<br>

✅ Detect test and production environments to auto-adjust behavior<br>

✅ Close on the exit signal<br>

<div align="center">
<img width="100%" src="./.assets/screenshot.png">
</div>

## Quick Usage (CLI)

You can run your applications in localhost with TypeScript support and watch mode using `listhen` CLI:

Create `index.ts`:

```ts
export default (req, res) => {
  res.end("Hello World!");
};
```

or using [unjs/h3](https://github.com/unjs/h3):

```ts
import { createApp, eventHandler } from "h3";

export const app = createApp();

app.use(
  "/",
  eventHandler(() => "Hello world!"),
);
```

or use npx to invoke `listhen` command:

```sh
npx listhen -w ./index.ts
```

## Usage (API)

Install package:

```bash
# pnpm
pnpm i listhen

# npm
npm i listhen

# yarn
yarn add listhen

```

Import into your Node.js project:

```js
// CommonJS
const { listen, listenAndWatch } = require("listhen");

// ESM
import { listen, listenAndWatch } from "listhen";
```

```ts
const handler = (req, res) => {
  res.end("Hi!")
}

// listener: { url, getURL, server, close, ... }
const listener = await listen(handler, options)
```

## Options

### `port`

- Default: `process.env.PORT` or 3000 or memorized random (see [get-port-please](https://github.com/unjs/get-port-please))

Port to listen.

### `hostname`

- Default: `process.env.HOST || '0.0.0.0'`

Default hostname to listen.

### `https`

- Type: Boolean | Object
- Default: `false`

Listen on HTTPS with SSL enabled.

#### Self-Signed Certificate

By setting `https: true`, listhen will use an auto-generated self-signed certificate.

You can set https to an object for custom options. Possible options:

- `domains`: (Array) Default is `['localhost', '127.0.0.1', '::1']`.
- `validityDays`: (Number) Default is `1`.

#### User-Provided Certificate

Set `https: { cert, key }` where the cert and key are paths to the SSL certificates.
With an encrypted private key, you also need to set `passphrase` on the `https` object.

To provide a certificate stored in a keystore set `https: { pfx }` with a path to the keystore.
When the keystore is password protected also set `passphrase`.

You can also provide an inline cert and key instead of reading from the filesystem. In this case, they should start with `--`.

### `showURL`

- Default: `true` (force disabled on a test environment)

Show a CLI message for the listening URL.

### `baseURL`

- Default: `/`

### `open`

- Default: `false` (force disabled on test and production environments)

Open the URL in the browser. Silently ignores errors.

### `clipboard`

- Default: `false` (force disabled on test and production environments)

Copy the URL to the clipboard. Silently ignores errors.

### `isTest`

- Default: `process.env.NODE_ENV === 'test'`

Detect if running in a test environment to disable some features.

### `autoClose`

- Default: `true`

Automatically close when an `exit` event, `SIGTERM`, `SIGINT` or `SIGHUP` signal is received in the process.

### `publicURL`

- Default: (the first public URL listening)

The public URL to show in the CLI output

### `qr`

- Default: `true`

Print QR Code for public address.

### `public`

- Default: `false` for development or when `hostname` is `localhost` and `true` for production

When enabled, listhen tries to listen to all network interfaces. You can also enable this option using `--host` CLI flag.

### `ws`

- Default: `false`

Enable experimental WebSocket support using [unjs/crossws](https://crossws.unjs.io/) or node upgrade handler.

Option can be a function for Node.js `upgrade` handler (`(req, head) => void`) or an Object to use [CrossWS Hooks](https://crossws.unjs.io/guide/api).

When using dev server CLI, you can easily use `--ws` and a named export called `websocket` to define [CrossWS Hooks](https://github.com/unjs/crossws) with HMR support!

## License

<!-- automd:contributors license=MIT author="pi0" -->

Published under the [MIT](https://github.com/unjs/listhen/blob/main/LICENSE) license.
Made by [@pi0](https://github.com/pi0) and [community](https://github.com/unjs/listhen/graphs/contributors) 💛
<br><br>
<a href="https://github.com/unjs/listhen/graphs/contributors">
<img src="https://contrib.rocks/image?repo=unjs/listhen" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
