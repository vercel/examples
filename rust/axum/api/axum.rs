use axum::extract::Json;
use axum::http::Uri;
use axum::response::IntoResponse;
use axum::{
    Router,
    routing::{get, post},
};
use hyper::body::Bytes;
use serde::{Deserialize, Serialize};
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

#[derive(Deserialize)]
struct CreateUser {
    name: String,
    email: String,
}

#[derive(Serialize)]
struct User {
    id: u32,
    name: String,
    email: String,
}

async fn create_user(Json(payload): Json<CreateUser>) -> impl IntoResponse {
    let user = User {
        id: 123,
        name: payload.name,
        email: payload.email,
    };

    Json(user)
}

async fn fallback(uri: Uri) -> impl IntoResponse {
    format!("Axum fallback for path {}", uri.path())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let router = Router::new()
        .route("/", get(home))
        .route("/stream", get(stream_example))
        .route("/users", post(create_user))
        .fallback(fallback);

    let app = ServiceBuilder::new()
        .layer(VercelLayer::new())
        .service(router);
    vercel_runtime::run(app).await
}
