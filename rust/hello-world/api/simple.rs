use rand::prelude::IndexedRandom;
use serde_json::{Value, json};
use vercel_runtime::{Error, Request, run, service_fn};

#[tokio::main]
async fn main() -> Result<(), Error> {
    let service = service_fn(handler);
    run(service).await
}

pub async fn handler(_req: Request) -> Result<Value, Error> {
    let starter = choose_starter();
    Ok(json!({
      "message": format!("I choose you, {}!", starter),
    }))
}

pub fn choose_starter() -> String {
    let pokemons = ["Bulbasaur", "Charmander", "Squirtle", "Pikachu"];
    let starter = pokemons.choose(&mut rand::rng()).unwrap();
    starter.to_string()
}
