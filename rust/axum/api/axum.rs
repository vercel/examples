use axum::extract::Json;
use axum::http::Uri;
use axum::response::{Html, IntoResponse};
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
    let html = r#"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vercel Axum</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .container {
            width: 100%;
            max-width: 600px;
        }
        h1 {
            font-size: 2.25rem;
            font-weight: 500;
            margin-bottom: 2rem;
            text-align: left;
            letter-spacing: -0.025em;
        }
        button {
            background-color: #171717;
            color: #ffffff;
            border: 1px solid #333333;
            padding: 8px 16px;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.15s ease;
            margin-bottom: 1.5rem;
            font-family: inherit;
        }
        button:hover {
            background-color: #262626;
            border-color: #404040;
        }
        button:disabled {
            background-color: #0a0a0a;
            color: #666666;
            border-color: #262626;
            cursor: not-allowed;
        }
        #stream-container {
            background-color: #0a0a0a;
            border: 1px solid #262626;
            border-radius: 4px;
            padding: 1rem;
            margin-top: 1rem;
            min-height: 200px;
            display: block;
        }
        #stream-content {
            white-space: pre-wrap;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
            font-size: 0.8rem;
            line-height: 1.5;
            color: #e5e5e5;
        }
        .loading {
            color: #888888;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Vercel Axum <a href="https://github.com/vercel/examples/tree/main/rust/axum" style="color: #60a5fa; text-decoration: none; font-size: 0.875rem; margin-left: 1rem;">View on GitHub</a></h1>
        <button id="stream-btn">Start streaming</button>
        <div id="stream-container">
            <div id="stream-content"></div>
        </div>
    </div>
    <script>
        const streamBtn = document.getElementById('stream-btn');
        const streamContainer = document.getElementById('stream-container');
        const streamContent = document.getElementById('stream-content');
        let isStreaming = false;
        streamBtn.addEventListener('click', async () => {
            if (isStreaming) return;
            isStreaming = true;
            streamBtn.textContent = 'Streaming...';
            streamBtn.disabled = true;
            streamContent.innerHTML = '';
            streamContent.className = 'loading';
            streamContent.textContent = 'Starting stream...';
            try {
                const response = await fetch('/stream');
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
            let firstChunk = true;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                if (firstChunk) {
                    streamContent.className = '';
                    streamContent.textContent = '';
                    firstChunk = false;
                }
                streamContent.textContent += chunk;
            }
            } catch (error) {
                streamContent.textContent = 'Error: ' + error.message;
            } finally {
                isStreaming = false;
                streamBtn.textContent = 'Start streaming';
                streamBtn.disabled = false;
            }
        });
    </script>
</body>
</html>"#;

    Html(html)
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
