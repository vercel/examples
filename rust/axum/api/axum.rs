use axum::http::Uri;
use axum::response::IntoResponse;
use axum::{Router, routing::get};
use hyper::body::Bytes;
use tokio::time::Duration;
use tower::ServiceBuilder;
use vercel_runtime::Error;
use vercel_runtime::axum::{VercelLayer, stream_response};

async fn home() -> impl IntoResponse {
    "Hello from Axum on Vercel"
}

async fn stream_example() -> impl IntoResponse {
    stream_response(|tx| async move {
        for i in 1..=5 {
            tokio::time::sleep(Duration::from_millis(500)).await;
            let data = format!("Streaming data: {}\n", i);
            if tx.send(Ok(Bytes::from(data))).await.is_err() {
                break;
            }
        }
    })
}

async fn fallback(uri: Uri) -> impl IntoResponse {
    format!("Axum fallback for path {}", uri.path())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let router = Router::new()
        .route("/", get(home))
        .route("/stream", get(stream_example))
        .fallback(fallback);

    let app = ServiceBuilder::new()
        .layer(VercelLayer::new())
        .service(router);
    vercel_runtime::run(app).await
}
