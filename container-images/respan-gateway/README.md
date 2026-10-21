---
name: Respan Gateway on Vercel
slug: respan-gateway-container
description: Run Respan Gateway, an open-source Rust AI gateway, on Vercel Functions as a container image.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/respan-gateway
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/respan-gateway&project-name=respan-gateway&repository-name=respan-gateway&env=RESPAN_CLIENT_KEYS,OPENAI_API_KEY
publisher: Vercel
relatedTemplates:
  - container-images-demo
  - rust-axum
---

# Respan Gateway on Vercel

Run [Respan Gateway](https://github.com/respanai/respan-gateway), an open-source Rust AI gateway, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images). One endpoint in front of OpenAI, Anthropic and Gemini that translates between their APIs, with a built-in web UI.

This example contains no gateway code. `Dockerfile.vercel` fetches Respan Gateway at a pinned commit, builds its web UI, compiles it, and ships the binary on a distroless image (about 72 MB). The gateway already listens on `0.0.0.0:$PORT` and configures itself from environment variables, so it needs no changes to run on Vercel.

> Respan Gateway is pre-alpha with no tagged release. This example pins commit `7cf775d`; change `RESPAN_COMMIT` in `Dockerfile.vercel` to upgrade.

## How to use

Deploy with the button, or from this folder:

```bash
vercel env add RESPAN_CLIENT_KEYS
vercel env add OPENAI_API_KEY
vercel deploy --prod
```

Then call it with any OpenAI, Anthropic or Gemini client:

```bash
curl https://<your-deployment>.vercel.app/healthz
curl -H "Authorization: Bearer <client-key>" https://<your-deployment>.vercel.app/v1/models
curl -H "Authorization: Bearer <client-key>" -H "content-type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"hello"}]}' \
  https://<your-deployment>.vercel.app/v1/chat/completions
```

The web UI is at `/ui/`.

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `RESPAN_CLIENT_KEYS` | Yes | Comma-separated keys your clients send (`Authorization: Bearer`, `x-api-key` or `x-goog-api-key`). The gateway refuses to listen on a public address without them. |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` | At least one | Each enables that provider. Upstreams only ever see these, never client keys. |
| `PORT` | No | Defaults to 80 in the image, which is what Vercel expects. |
| `RESPAN_LOG` | No | `json` by default in the image. |

## Test locally

Requires Docker and Python 3. The smoke test runs the image against a fake OpenAI server, so no real keys are used.

```bash
docker build -f Dockerfile.vercel -t respan-on-vercel .
./local-test/smoke-test.sh
```

Expected output (the mock also prints an `UPSTREAM ...` line for each call it receives, showing the provider key, never the client key):

```
PASS  health (200)
PASS  rejects missing client key (401)
PASS  lists models (200)
PASS  OpenAI chat completion (200)
PASS  OpenAI streaming (200)
PASS  stream ends with [DONE]
PASS  Anthropic Messages -> OpenAI (200)
PASS  Anthropic-shaped response
PASS  web UI (200)
All checks passed.
```

The first build takes several minutes because it compiles about 300 Rust crates.

## Caveats

- **Per-instance state.** Vercel scales to many instances and the file system is not persistent. Hot reload (`SIGHUP`, `--watch`, `gateway.toml`) and the built-in live request log only cover one process. Configure with environment variables, redeploy to change config, and send JSON logs and traces to an external backend.
- **Realtime.** Vercel Functions support [WebSockets](https://vercel.com/docs/functions/websockets), which the gateway's realtime voice relay uses. That path has not been tested with this example.

## Learn more

- [Deploy Rust on Vercel with Docker](https://vercel.com/kb/guide/deploy-rust-on-vercel-with-docker)
- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [Respan Gateway configuration](https://github.com/respanai/respan-gateway/blob/main/docs/configuration.md)
