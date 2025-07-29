# uqr

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

<!-- [![Codecov][codecov-src]][codecov-href] -->

Generate QR Code universally, in any runtime, to ANSI, Unicode or SVG. ES module , zero dependency, tree-shakable.

## Install

```bash
# Using npm
npm install uqr

# Using yarn
yarn add uqr

# Using pnpm
pnpm add uqr
```

## Usage

```ts
import {
  encode,
  renderANSI,
  renderSVG,
  renderUnicode,
  renderUnicodeCompact,
} from 'uqr'

const svg = renderSVG('Hello, World!')

const ansi = renderANSI('https://192.168.1.100:3000', {
  // Error correction level
  ecc: 'L',
  // Border width
  border: 2,
})

// display QR Code in terminal
console.log(ansi)
```

## API

### `encode`

Encode plain text or binary data into QR Code represented by a 2D array.

```ts
import { encode } from 'uqr'

const {
  data, // 2D array of boolean, representing the QR Code
  version, // QR Code version
  size, // size of the QR Code
} = encode(text, options)
```

### `renderANSI`

Render QR Code to [ANSI colored](https://ss64.com/nt/syntax-ansi.html) string.

```ts
import { renderANSI } from 'uqr'

const string = renderANSI(text, options)

console.log(string)
```

### `renderUnicode`

Render QR Code to Unicode string for each pixel. By default it uses `█` and `░` to represent black and white pixels, and it can be customizable.

```ts
import { renderUnicode } from 'uqr'

const string = renderUnicode(text, {
  blackChar: '█',
  whiteChar: '░',
  // ...other options
})
```

### `renderUnicodeCompact`

Render QR Code with two rows into one line with unicode `▀`, `▄`, `█`, ` `. It is useful when you want to display QR Code in terminal with limited height.

```ts
import { renderUnicodeCompact } from 'uqr'

const string = renderUnicodeCompact(text, options)

console.log(string)
```

### `renderSVG`

Render QR Code to SVG string.

```ts
import { renderSVG } from 'uqr'

const string = renderSVG(text, options)
```

## Credits

QR Code generation algorithm is modified from [nayuki/QR-Code-generator](https://github.com/nayuki/QR-Code-generator/blob/master/typescript-javascript/qrcodegen.ts) by Project Nayuki.

CLI renders are inspired by [qrcode-terminal](https://github.com/gtanner/qrcode-terminal).

## License

[MIT](./LICENSE) License


<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/uqr?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/uqr
[npm-downloads-src]: https://img.shields.io/npm/dm/uqr?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/uqr
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/uqr/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/uqr
[bundle-src]: https://img.shields.io/bundlephobia/minzip/uqr?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=uqr
[license-src]: https://img.shields.io/github/license/unjs/uqr.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/unjs/uqr/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/uqr
