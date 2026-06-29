use serde::Deserialize;
use serde_json::{Value, json};
use vercel_runtime::{AppState, Error, Request, Response, ResponseBody, run, service_fn};

const KEY: &str = "requests:recent";
const MAX_RECORDS: usize = 10;

#[derive(Deserialize)]
struct UpstashResult {
    result: Vec<String>,
}

async fn handler(_req: Request, _state: AppState) -> Result<Response<ResponseBody>, Error> {
    let records = match fetch_recent().await {
        Ok(records) => records,
        Err(e) => {
            eprintln!("Failed to read recent requests: {e}");
            let body = json!({ "error": e.to_string() });
            return Ok(Response::builder()
                .header("content-type", "application/json")
                .status(500)
                .body(body.to_string().into())?);
        }
    };

    let body = json!({ "requests": records });

    Ok(Response::builder()
        .header("content-type", "application/json")
        .header("cache-control", "no-store")
        .status(200)
        .body(body.to_string().into())?)
}

/// Fetch the most recent records with `LRANGE`
/// Each list item is itself a JSON string, so we parse it back into a value.
async fn fetch_recent() -> Result<Vec<Value>, Error> {
    let url = std::env::var("KV_REST_API_URL").map_err(|_| "KV_REST_API_URL is not set")?;
    let token = std::env::var("KV_REST_API_READ_ONLY_TOKEN")
        .map_err(|_| "KV_REST_API_READ_ONLY_TOKEN is not set")?;

    let res = reqwest::Client::new()
        .get(format!("{url}/lrange/{KEY}/0/{}", MAX_RECORDS - 1))
        .bearer_auth(token)
        .send()
        .await?;

    if !res.status().is_success() {
        let status = res.status();
        let text = res.text().await.unwrap_or_default();
        return Err(format!("Upstash returned {status}: {text}").into());
    }

    let parsed: UpstashResult = res.json().await?;
    let records = parsed
        .result
        .into_iter()
        .map(|item| serde_json::from_str::<Value>(&item).unwrap_or(Value::String(item)))
        .collect();

    Ok(records)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let app = service_fn(handler);
    run(app).await
}
