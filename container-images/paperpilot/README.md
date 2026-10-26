---
name: PaperPilot on Vercel
slug: paperpilot-container
description: Run PaperPilot, an open-source Rust PDF engine with a REST API and MCP server, on Vercel Functions as a container image.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/paperpilot
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/paperpilot&project-name=paperpilot&repository-name=paperpilot
publisher: Vercel
relatedTemplates:
  - container-images-demo
  - rust-axum
---

# PaperPilot on Vercel

Run [PaperPilot](https://github.com/KrushnaVardhanReddy/PaperPilot), an open-source PDF and document toolkit written in pure Rust, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images). Its gateway exposes 50+ document tools (merge, split, text extraction, metadata, PII scan, watermark, Excel to JSON and more) over a REST API and a minimal MCP-over-HTTP endpoint, with no Chromium or C++ runtime.

This example contains no PaperPilot code. `Dockerfile.vercel` fetches PaperPilot at a pinned commit, compiles the `paperpilot-gateway` binary, and ships it on Debian slim. The gateway already reads `PORT` and `BIND`, so the image only sets `BIND=0.0.0.0` and runs the binary under `tini` so it stops cleanly on `SIGTERM`.

> This example pins commit `c7b72c0`; change `PAPERPILOT_COMMIT` in `Dockerfile.vercel` to upgrade.

## How to use

Deploy with the button, or from this folder:

```bash
vercel deploy --prod
```

No environment variables are required. Then call it:

```bash
curl https://<your-deployment>.vercel.app/health
curl https://<your-deployment>.vercel.app/api/v1/tools
curl -F file=@document.pdf https://<your-deployment>.vercel.app/api/v1/pdf/info
curl -F file=@document.pdf https://<your-deployment>.vercel.app/api/v1/pdf/extract-text
```

MCP clients can use `POST /mcp/messages` (JSON-RPC `initialize`, `tools/list`, `tools/call`) and `GET /mcp/sse`. Swagger UI is at `/swagger-ui`.

## Environment variables

| Variable | Required | Meaning |
| --- | --- | --- |
| `PORT` | No | Port the gateway listens on. Defaults to 80 in the image, which is what Vercel expects. |
| `BIND` | No | Bind address. `0.0.0.0` in the image. |
| `RUST_LOG` | No | Log filter, `info` by default. |

## Test locally

Requires Docker and Python 3. The smoke test generates a small PDF, runs the image, and checks the REST API, the MCP endpoints, `SIGTERM` handling and the default port.

```bash
docker build -f Dockerfile.vercel -t paperpilot-on-vercel .
./local-test/smoke-test.sh
```

Expected output:

```
PASS  health (200)
PASS  lists tools (200)
PASS  PDF metadata (upload) (200)
PASS  PII scan finds email (upload) (200)
PASS  extract text (upload) (200)
PASS  extracted text matches the PDF
PASS  MCP initialize (200)
PASS  MCP tools/list (200)
PASS  MCP SSE stream announces endpoint
PASS  SIGTERM shutdown in 0s (exit 143)
PASS  default PORT 80
All checks passed.
```

The first build compiles about 690 Rust crates and takes around 15 minutes on 2 vCPUs. `exit 143` is expected: `tini` stops the gateway with `SIGTERM` right away. Without `tini`, the gateway ignores `SIGTERM` as PID 1 and is killed only after the timeout.

## Caveats

- **No authentication.** The gateway accepts any request, and its JSON mode reads server file paths and fetches arbitrary URLs. Before exposing a deployment, enable [Deployment Protection](https://vercel.com/docs/deployment-protection) or put your own auth in front of it.
- **Stateless instances.** Uploaded files and outputs are written to temporary files on the instance and are not kept. Tools that write an output file (text extraction, merge, split, compress) need an `output` path under `/tmp` and report that server-side path rather than returning the file. Tools such as metadata and PII scan return their result in the response. To hand files back to callers, store outputs in [Vercel Blob](https://vercel.com/docs/storage).
- **MCP transport.** The gateway's MCP endpoint is a minimal HTTP adapter: JSON-RPC responses come back in the `POST /mcp/messages` response, and `/mcp/sse` only announces the endpoint and sends keep-alive pings. SSE streams close at the function's [maximum duration](https://vercel.com/docs/functions/configuring-functions/duration).
- **Not covered by the smoke test.** OCR and page rendering depend on models and native libraries that this image does not include.

## Learn more

- [Deploy Rust on Vercel with Docker](https://vercel.com/kb/guide/deploy-rust-on-vercel-with-docker)
- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [PaperPilot Docker guide](https://github.com/KrushnaVardhanReddy/PaperPilot/blob/main/DOCKER.md)
