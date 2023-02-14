use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet() -> String {
    return "Hello, World!".to_string();
}
