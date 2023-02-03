use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn xor(a: u32, b: u32) -> u32 {
    return a ^ b;
}
