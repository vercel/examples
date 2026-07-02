use std::time::Duration;

use axum::{
    extract::ws::{Message, Utf8Bytes, WebSocket, WebSocketUpgrade},
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use futures_util::{sink::SinkExt, stream::StreamExt};
use serde::Serialize;
use tokio::sync::mpsc;
use tower::ServiceBuilder;
use vercel_runtime::axum::VercelLayer;
use vercel_runtime::Error;

/// Serves the interactive demo page.
async fn home() -> impl IntoResponse {
    Html(include_str!("../index.html"))
}

/// Upgrades the incoming HTTP request to a WebSocket connection.
///
/// Vercel's Rust runtime enables HTTP/1.1 upgrades, so axum's
/// `WebSocketUpgrade` extractor works out of the box. The `101 Switching
/// Protocols` response is passed straight through and hyper drives the
/// upgraded socket once the handshake completes.
async fn ws_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(handle_socket)
}

#[derive(Serialize)]
#[serde(tag = "type", rename_all = "lowercase")]
enum ServerEvent {
    /// Sent once right after the connection opens.
    Welcome { message: String },
    /// Echoes whatever the client sent back to it.
    Echo { message: String },
    /// A server-driven heartbeat emitted on an interval.
    Tick { count: u64 },
}

/// Drives a single WebSocket connection.
///
/// Demonstrates the two common patterns at once:
/// 1. Server-initiated messages (a periodic "tick" heartbeat).
/// 2. Client-initiated messages (echoed back to the sender).
///
/// A single writer task owns the sink and is fed by an mpsc channel, so both
/// the heartbeat loop and the echo loop can push frames without sharing the
/// non-clonable `SplitSink`.
async fn handle_socket(socket: WebSocket) {
    let (mut sink, mut stream) = socket.split();
    let (tx, mut rx) = mpsc::channel::<ServerEvent>(16);

    // Writer task: serialize every event and write it to the socket.
    let mut writer_task = tokio::spawn(async move {
        while let Some(event) = rx.recv().await {
            if sink.send(json_message(&event)).await.is_err() {
                break;
            }
        }
    });

    // Greet the client as soon as the socket is open.
    let _ = tx
        .send(ServerEvent::Welcome {
            message: "Connected to the Vercel Rust WebSocket example".to_string(),
        })
        .await;

    // Heartbeat task: push a tick to the client every second.
    let tick_tx = tx.clone();
    let mut tick_task = tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(1));
        let mut count: u64 = 0;
        loop {
            interval.tick().await;
            count += 1;
            if tick_tx.send(ServerEvent::Tick { count }).await.is_err() {
                break;
            }
        }
    });

    // Reader task: echo client text/binary messages back to the sender.
    let echo_tx = tx;
    let mut reader_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = stream.next().await {
            match msg {
                Message::Text(text) => {
                    let event = ServerEvent::Echo {
                        message: text.to_string(),
                    };
                    if echo_tx.send(event).await.is_err() {
                        break;
                    }
                }
                Message::Binary(bin) => {
                    let event = ServerEvent::Echo {
                        message: format!("<{} bytes of binary data>", bin.len()),
                    };
                    if echo_tx.send(event).await.is_err() {
                        break;
                    }
                }
                Message::Close(_) => break,
                // Ping/Pong frames are answered automatically by axum.
                _ => {}
            }
        }
    });

    // When any task ends (client disconnect or error), tear the others down.
    tokio::select! {
        _ = &mut writer_task => {
            tick_task.abort();
            reader_task.abort();
        }
        _ = &mut tick_task => {
            writer_task.abort();
            reader_task.abort();
        }
        _ = &mut reader_task => {
            writer_task.abort();
            tick_task.abort();
        }
    }
}

/// Serializes a `ServerEvent` into a WebSocket text frame.
fn json_message(event: &ServerEvent) -> Message {
    let json = serde_json::to_string(event).unwrap_or_else(|_| "{}".to_string());
    Message::Text(Utf8Bytes::from(json))
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let router = Router::new()
        .route("/", get(home))
        .route("/ws", get(ws_handler));

    let app = ServiceBuilder::new()
        .layer(VercelLayer::new())
        .service(router);

    vercel_runtime::run(app).await
}
