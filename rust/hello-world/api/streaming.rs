use hyper::body::{Bytes, Frame};
use tokio::time::Duration;
use vercel_runtime::{AppState, Error, Request, Response, ResponseBody, service_fn};

async fn handler(_req: Request, state: AppState) -> Result<Response<ResponseBody>, Error> {
    let AppState { log_context } = state;
    log_context.info("Starting streaming response");

    use tokio::sync::mpsc;
    let (tx, rx) = mpsc::channel(10);

    tokio::spawn(async move {
        for i in 1..=10 {
            tokio::time::sleep(Duration::from_millis(500)).await;
            log_context.debug(&format!("Sending count: {}", i));
            let data = format!("Count: {}\n", i);
            if tx.send(Ok(Frame::data(Bytes::from(data)))).await.is_err() {
                log_context.warn("Client disconnected during streaming");
                break;
            }
        }
        log_context.info("Streaming completed");
    });

    let stream = tokio_stream::wrappers::ReceiverStream::new(rx);
    let body = http_body_util::StreamBody::new(stream);

    Ok(Response::builder()
        .header("content-type", "text/event-stream")
        .header("cache-control", "no-cache")
        .header("connection", "keep-alive")
        .header("transfer-encoding", "chunked")
        .body(body.into())?)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let app = service_fn(handler);
    vercel_runtime::run(app).await
}
