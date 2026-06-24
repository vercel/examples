use std::time::{SystemTime, UNIX_EPOCH};

use serde_json::json;
use vercel_runtime::{AppState, Error, Request, Response, ResponseBody, run, service_fn};

const KEY: &str = "requests:recent";
const MAX_RECORDS: usize = 10;

async fn handler(req: Request, state: AppState) -> Result<Response<ResponseBody>, Error> {
    state
        .log_context
        .info("Handler invoked, recording request via waitUntil");

    // Capture request details *before* moving into the background task. The
    // `Request` itself is not `'static`, so we extract owned values here.
    let method = req.method().to_string();
    let path = req.uri().path().to_string();
    let user_agent = header(&req, "user-agent");

    let timestamp_ms = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);

    let record = json!({
        "timestamp": timestamp_ms,
        "method": method,
        "path": path,
        "userAgent": user_agent,
    })
    .to_string();

    // Persist the record *after* the response is sent.
    // The client never waits for the Redis round-trip.
    // `waitUntil` keeps the future alive so it completes in the background.
    // Note: We log with `println!` / to stdout here.
    // This is because the request-scoped log context is closed once the response is returned.
    state.wait_until(async move {
        match store_request(&record).await {
            Ok(()) => println!("[waitUntil] Stored request record in Upstash"),
            Err(e) => eprintln!("[waitUntil] Failed to store request record: {e}"),
        }
    });

    let body = json!({
        "message": "Request recorded in the background via waitUntil().",
        "recorded": true,
    });

    Ok(Response::builder()
        .header("content-type", "application/json")
        .status(200)
        .body(body.to_string().into())?)
}

/// Push the record onto the head of the list and trim it to `MAX_RECORDS`,
/// Uses the Upstash REST pipeline endpoint so both commands run in one call.
async fn store_request(record: &str) -> Result<(), Error> {
    let url = std::env::var("KV_REST_API_URL").map_err(|_| "KV_REST_API_URL is not set")?;
    let token = std::env::var("KV_REST_API_TOKEN").map_err(|_| "KV_REST_API_TOKEN is not set")?;

    let body = json!([["LPUSH", KEY, record], ["LTRIM", KEY, 0, MAX_RECORDS - 1],]);

    let res = reqwest::Client::new()
        .post(format!("{url}/pipeline"))
        .bearer_auth(token)
        .json(&body)
        .send()
        .await?;

    if !res.status().is_success() {
        let status = res.status();
        let text = res.text().await.unwrap_or_default();
        return Err(format!("Upstash returned {status}: {text}").into());
    }

    Ok(())
}

fn header(req: &Request, name: &str) -> Option<String> {
    req.headers()
        .get(name)
        .and_then(|v| v.to_str().ok())
        .map(|s| s.to_owned())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let app = service_fn(handler);
    run(app).await
}
