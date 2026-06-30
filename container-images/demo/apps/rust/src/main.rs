use std::net::SocketAddr;

use axum::{response::Html, routing::get, Router};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/rust/health", get(health))
        // Serve the landing page for "/rust", "/" and anything else forwarded.
        .fallback(get(root));

    // Vercel routes traffic to port 80 by default; PORT overrides it.
    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(80);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind");

    println!("listening on http://{addr}");
    axum::serve(listener, app).await.expect("server error");
}

async fn root() -> Html<&'static str> {
    Html(include_str!("index.html"))
}

async fn health() -> &'static str {
    "ok"
}
