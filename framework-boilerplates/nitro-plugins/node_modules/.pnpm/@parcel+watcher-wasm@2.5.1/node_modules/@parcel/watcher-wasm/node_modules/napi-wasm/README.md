# napi-wasm

An implementation of the [napi](https://nodejs.org/api/n-api.html) API for WASM. Enables using some native Node modules in browsers and other environments.

## Setup

To use napi-wasm, there are a few requirements:

1. Configure your linker to export an indirect function table. With ldd, this is the `--export-table` flag. This enables JavaScript to call callback functions registered by WASM. It is exposed in the WebAssembly exports as `__indirect_function_table`.
2. Export a function from your WASM build named `napi_register_module_v1` (Node's default), or `napi_register_wasm_v1` for WASM-specific builds. This is called during initialization to setup the `exports` object for your module. It receives an environment and an exports object pointer as arguments, which you can add properties to.
3. Include a function named `napi_wasm_malloc` in your WASM build. This is called from JavaScript by napi-wasm to allocate memory in the WASM heap. It should accept a `uint32` size argument indicating the number of bytes to allocate, and return a `uint8` pointer to allocated memory.
4. Compile for the `wasm32-unknown-unknown` target.

### In Rust

The above steps should apply for any programming language, but here's an example in Rust. First, define a `napi_wasm_malloc` function so JavaScript can allocate memory in the WASM heap using the default allocator.

```rust
use std::alloc::{alloc, Layout};

#[no_mangle]
pub extern "C" fn napi_wasm_malloc(size: usize) -> *mut u8 {
  let align = std::mem::align_of::<usize>();
  if let Ok(layout) = Layout::from_size_align(size, align) {
    unsafe {
      if layout.size() > 0 {
        let ptr = alloc(layout);
        if !ptr.is_null() {
          return ptr;
        }
      } else {
        return align as *mut u8;
      }
    }
  }

  std::process::abort();
}
```

Next, implement `napi_register_wasm_v1` to register your module exports. We'll use the [napi-rs](https://github.com/napi-rs/napi-rs) bindings in this example to make it a bit nicer than calling C APIs directly. Note that the napi-rs `#[module_exports]` macro currently doesn't work in WASM because Rust doesn't support ctor setup functions in WASM targets yet, so we'll need to do this manually.

```rust
use napi::{Env, JsObject, NapiValue};

#[no_mangle]
pub unsafe extern "C" fn napi_register_wasm_v1(raw_env: napi::sys::napi_env, raw_exports: napi::sys::napi_value) {
  let env = Env::from_raw(raw_env);
  let exports = JsObject::from_raw_unchecked(raw_env, raw_exports);

  exports.create_named_method("transform", transform);
}

#[js_function(1)]
fn transform(ctx: CallContext) -> napi::Result<JsUnknown> {
  // ...
}
```

To compile, you need to export a function table and use the correct target.

```shell
 RUSTFLAGS="-C link-arg=--export-table" cargo build --target wasm32-unknown-unknown
```

This will output a file in `target/wasm32-unknown-unknown/debug/YOUR_CRATE.wasm` which you can load in a JavaScript environment.

You can also put the rust flags in a `.cargo/config.toml` file so you don't need to provide the environment variable each time you run `cargo build`.

```toml
[target.wasm32-unknown-unknown]
rustflags = ["-C", "link-arg=--export-table"]
```

### Loading

To load a WASM file and initialize a napi environment, you'll need to import the `napi-wasm` package. You instantiate a WASM module as usual, providing `napi` as the `env` import key. This provides the napi functions for your WASM module to use.

Then, pass the WASM instance to the `Environment` constructor to setup a napi environment. This will call `napi_register_wasm_v1` or `napi_register_module_v1` to setup the exports object. Then you can call functions on the exports object as you would in Node.

```js
import { Environment, napi } from 'napi-wasm';

// Construct a URL and instantiate a WebAssembly module as usual.
const url = new URL('path/to/lib.wasm', import.meta.url);
const { instance } = await WebAssembly.instantiateStreaming(fetch(url), {
  env: napi
});

// Create an environment.
let env = new Environment(instance);
let exports = env.exports;

// Use exports as usual!
exports.transform({
  // ...
});
```

When you are done with an `Environment`, call the `destroy()` function to clean up memory.
