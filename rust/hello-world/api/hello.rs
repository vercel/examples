use vercel_runtime::{Error, Request, Response, ResponseBody, service_fn};

async fn handler(req: Request) -> Result<Response<ResponseBody>, Error> {
    let uri = req.uri().to_string();
    Ok(Response::builder().body(format!("hello world from {uri}").into())?)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let app = service_fn(handler);
    vercel_runtime::run(app).await
}
