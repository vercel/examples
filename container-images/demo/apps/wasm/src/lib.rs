use wasm_bindgen::prelude::*;

/// Returns a greeting rendered by the WASM module.
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    let who = if name.is_empty() { "world" } else { name };
    format!("Hello, {who}! (computed inside WebAssembly)")
}

/// A small CPU-bound function to demonstrate running real logic in WASM.
#[wasm_bindgen]
pub fn fib(n: u32) -> u64 {
    let (mut a, mut b) = (0u64, 1u64);
    for _ in 0..n {
        let next = a.wrapping_add(b);
        a = b;
        b = next;
    }
    a
}
