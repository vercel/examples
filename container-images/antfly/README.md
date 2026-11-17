---
name: Antfly on Vercel
slug: antfly-container
description: Run Antfly, an open-source search-and-inference database, on Vercel Functions as a container image, with RAG answers generated through AI Gateway.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/antfly
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/antfly&project-name=antfly&repository-name=antfly&env=ANTFLY_BOOTSTRAP_ADMIN_PASSWORD
publisher: Vercel
relatedTemplates:
  - container-images-demo
  - respan-gateway-container
---

# Antfly on Vercel

Run [Antfly](https://github.com/antflydb/antfly), an open-source search-and-inference database, on [Vercel Functions](https://vercel.com/docs/functions) with the [Container runtime](https://vercel.com/docs/functions/runtimes/container). One HTTP API for full-text (BM25), vector and hybrid search, plus a retrieval agent that streams RAG answers, with the Antfarm dashboard at `/`.

This example contains no Antfly code. `Dockerfile.vercel` takes the `antfly` binary, the Wasmtime library and the dashboard from the official `v0.3.0` release image (pinned by digest) and ships them on `debian:bookworm-slim`, leaving out the CUDA libraries Vercel Functions cannot use. Antfly already accepts `--host` and `--port` flags, so the entrypoint binds it to `0.0.0.0:$PORT` with authentication turned on.

Generation goes through [AI Gateway](https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions): Antfly's `openai` generator accepts a `url`, so it can call `https://ai-gateway.vercel.sh/v1` with any `provider/model` ID.

## How to use

Deploy with the button, or from this folder:

```bash
vercel env add ANTFLY_BOOTSTRAP_ADMIN_PASSWORD   # 12 to 72 bytes
vercel env add AI_GATEWAY_API_KEY                # optional, for RAG answers
vercel deploy --prod
```

Create a table, add documents and search them:

```bash
BASE=https://<your-deployment>.vercel.app
AUTH="admin:<your-password>"

curl -u "$AUTH" -X POST "$BASE/db/v1/tables/docs" -H 'content-type: application/json' -d '{}'

curl -u "$AUTH" -X POST "$BASE/db/v1/tables/docs/batch" -H 'content-type: application/json' -d '{
  "inserts": {"functions": {"title": "Vercel Functions", "body": "Antfly runs as a container image."}},
  "sync_level": "full_text"}'

curl -u "$AUTH" -X POST "$BASE/db/v1/query" -H 'content-type: application/json' -d '{
  "table": "docs", "full_text_search": {"query": "body:container"}, "fields": ["title"]}'
```

Ask a question and stream an answer generated through AI Gateway. `${secret:ai_gateway.api_key}` is resolved by Antfly from the `AI_GATEWAY_API_KEY` environment variable, so the key never appears in requests:

```bash
curl -N -u "$AUTH" -X POST "$BASE/db/v1/agents/retrieval" \
  -H 'content-type: application/json' -H 'accept: text/event-stream' -d '{
  "query": "How does Antfly run on Vercel?",
  "queries": [{"table": "docs", "full_text_search": {"query": "body:container"}, "fields": ["title", "body"], "limit": 3}],
  "generator": {"provider": "openai", "model": "anthropic/claude-sonnet-5", "url": "https://ai-gateway.vercel.sh/v1", "api_key": "${secret:ai_gateway.api_key}"},
  "stream": true, "steps": {"generation": {"enabled": true}}}'
```

The dashboard is at `/`, and `/healthz` and `/readyz` are public health checks.

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `ANTFLY_BOOTSTRAP_ADMIN_PASSWORD` | Yes | Password for the `admin` user, 12 to 72 bytes. Antfly refuses to start without it, because authentication is always on in this image. |
| `AI_GATEWAY_API_KEY` | No | Used by generators and embedders that reference `${secret:ai_gateway.api_key}`. |
| `PORT` | No | Defaults to 80 in the image, which is what Vercel expects. |

## Test locally

Requires Docker, Python 3 and curl. The smoke test runs the image against a fake OpenAI-compatible upstream, so no real keys are used.

```bash
docker build -f Dockerfile.vercel -t antfly-on-vercel .
bash local-test/smoke-test.sh
```

Expected output (the mock also prints an `UPSTREAM ...` line for the call it receives, showing the key Antfly resolved from `AI_GATEWAY_API_KEY`):

```
PASS  health (200)
PASS  ready (200)
PASS  rejects missing credentials (401)
PASS  rejects wrong password (401)
PASS  status as admin (200)
PASS  create table (200)
PASS  insert documents (201)
PASS  full-text search (200)
PASS  search finds the right document
PASS  RAG answer, streamed (SSE) (200)
PASS  answer comes from the upstream
PASS  stream ends with event: done
PASS  Antfarm dashboard (200)
All checks passed.
```

## Caveats

- **Data lives in one instance and does not last.** Data is written to `/tmp/antfly`. Vercel Functions can run several instances, scale down when idle, and do not keep local files, so each instance has its own data and starts empty. Use this deployment to evaluate Antfly, for preview environments, or for indexes you load at startup. For durable data, run Antfly where it has persistent disks, or use [Antfly Cloud](https://antfly.io/cloud).
- **Image size.** The image is about 470 MB uncompressed, because the `antfly` binary alone is about 300 MB. That is above the standard 250 MB Function size, so it relies on [large functions](https://vercel.com/docs/functions/limitations) (beta). New projects are enrolled by default; existing projects set `VERCEL_SUPPORT_LARGE_FUNCTIONS=1`.
- **No local models.** This image leaves out Antfly's GPU libraries, and Vercel Functions have up to 4 GB of memory. Use hosted providers through AI Gateway for embeddings and generation instead of pulling local models into `/tmp`.
- **One port.** The separate health and metrics port (4200) is turned off; `/healthz` and `/readyz` are served on `$PORT`.

## Learn more

- [Container runtime on Vercel Functions](https://vercel.com/docs/functions/runtimes/container)
- [AI Gateway Chat Completions API](https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions)
- [Antfly quickstart](https://antfly.io/docs/guides/quickstart)
- [Antfly authentication](https://github.com/antflydb/antfly/blob/main/docs/reference/auth.md)
