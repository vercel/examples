## Introduction

@netlify/binary-info is a WebAssembly(WASM) module to extract very specific
information from binary files.

It's used by other Netlify projects to detect Go and Rust binaries built for
Netlify Functions and its architecture and platform .

## Usage

```js
import { readFile } = require("fs");
import { detect, Runtime }from "@netlify/binary-info";

const buffer = await readFile(path);
try {
  const info = elf.detect(buffer);
  switch (info.runtime) {
    case Runtime.Go: console.log("Go binary file"); break;
    case Runtime.Rust: console.log("Rust binary file"); break;
    default: console.log("Unknown binary file");
  }
} catch (error) {
  console.log(error);
}
```

## Development

### 🛠️ Build with `wasm-pack build`

```
wasm-pack build --target nodejs --release --scope=netlify
```
