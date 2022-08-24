# WASM

This is a simple "Hello, World" in Rust that compiles to WebAssembly.

This examples uses the [`wasm-pack`](https://rustwasm.github.io/wasm-pack/) tooling, which is excellent at building optimized WASM. However, we omit the generated loader scripts and use our own stack manipulation. 
