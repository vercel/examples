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
    let user_agent = header(&req, "user-agent");
    // Vercel injects the visitor's country (ISO 3166-1 alpha-2, e.g. "US",
    // "DE") at the edge. We never store the IP itself — just the country code
    // and its flag emoji.
    let country = header(&req, "x-vercel-ip-country");
    let flag = country.as_deref().map(country_to_flag);

    let timestamp_ms = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);

    let record = json!({
        "timestamp": timestamp_ms,
        "method": method,
        "userAgent": user_agent,
        "country": country,
        "flag": flag,
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

/// Convert an ISO 3166-1 alpha-2 country code (e.g. "US") into its flag emoji
/// (e.g. "🇺🇸") by mapping each ASCII letter to its regional indicator symbol.
/// Returns `None` for anything that isn't two ASCII letters.
fn country_to_flag(code: &str) -> Option<String> {
    let code = code.trim();
    if code.len() != 2 || !code.bytes().all(|b| b.is_ascii_alphabetic()) {
        return None;
    }
    // Regional indicator symbols start at U+1F1E6 ('A').
    const BASE: u32 = 0x1F1E6;
    let flag: String = code
        .to_ascii_uppercase()
        .bytes()
        .filter_map(|b| char::from_u32(BASE + (b - b'A') as u32))
        .collect();
    Some(flag)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let app = service_fn(handler);
    run(app).await
}
