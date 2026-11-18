---
name: Honcho on Vercel
slug: honcho-container
description: Run Honcho, an open-source memory layer for stateful AI agents, on Vercel Functions as a container image, with its background worker as a Vercel Daemon.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/honcho
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/honcho&project-name=honcho&repository-name=honcho&env=DB_CONNECTION_URI,AUTH_JWT_SECRET,LLM_OPENAI_API_KEY
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# Honcho on Vercel

Run [Honcho](https://github.com/plastic-labs/honcho), an open-source memory library for building stateful AI agents, on Vercel. Your agents send Honcho their conversations. A background worker (the "deriver") uses an LLM to turn those conversations into conclusions about each peer, and the API answers natural-language questions about them ("What does Alice like?").

This example contains no Honcho code. The `Dockerfile` fetches Honcho at a pinned release, installs its locked Python dependencies with `uv`, and builds one image that is deployed twice:

| Part | Runs on | Configured in `vercel.json` |
| --- | --- | --- |
| FastAPI API | [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/runtimes/container) | `services.api` with a catch-all rewrite |
| Deriver (queue worker) | [Vercel Daemons](https://vercel.com/docs/daemons) (beta, production only) | `daemons.deriver` with `command: python -m src.deriver` |
| Postgres with pgvector | A Postgres database from the [Vercel Marketplace](https://vercel.com/docs/marketplace-storage), such as Neon | `DB_CONNECTION_URI` |

The image starts by applying Honcho's database migrations, which hold a database lock so instances that start at the same time wait for each other. It then serves the API on `$PORT` (80 by default, which is what Vercel expects). It also sets `AUTH_USE_AUTH=true`, so a deployment never serves the API without JWT auth.

> This example pins Honcho `v3.6.1` (commit `70c6762`). To upgrade, change `HONCHO_VERSION` and `HONCHO_COMMIT` in `Dockerfile`.

## How to use

1. Create a Postgres database, for example with `vercel install neon`, and set `DB_CONNECTION_URI` to its connection string with the scheme changed to `postgresql+psycopg://`. The migrations enable the `vector` extension themselves.
2. Set the remaining environment variables, then deploy to production. Daemons only run in production deployments.

```bash
vercel env add DB_CONNECTION_URI
vercel env add AUTH_JWT_SECRET      # openssl rand -hex 32
vercel env add LLM_OPENAI_API_KEY
vercel deploy --prod
```

Honcho's API keys are HS256 JWTs signed with `AUTH_JWT_SECRET`. An admin key has the claims `{"t": "", "ad": true}`. Mint one with any JWT library, or see `jwt()` in [`local-test/smoke-test.sh`](./local-test/smoke-test.sh) for a dependency-free version. Then:

```bash
curl https://<your-deployment>.vercel.app/health
curl -H "Authorization: Bearer $HONCHO_ADMIN_JWT" -H 'content-type: application/json' \
  -d '{"id":"my-app"}' https://<your-deployment>.vercel.app/v3/workspaces
```

Point the [Honcho SDKs](https://github.com/plastic-labs/honcho#readme) at your deployment URL with that key.

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `DB_CONNECTION_URI` | Yes | Postgres with pgvector, using the `postgresql+psycopg://` scheme. |
| `AUTH_JWT_SECRET` | Yes | Signs and verifies API keys. The image sets `AUTH_USE_AUTH=true`, so Honcho refuses to start without it. |
| `LLM_OPENAI_API_KEY` | Yes | Used for text generation (memory extraction, summaries, dialectic chat) and, by default, for embeddings. Honcho also supports `LLM_ANTHROPIC_API_KEY` and `LLM_GEMINI_API_KEY` with per-feature model settings. |
| `LLM_OPENAI_BASE_URL` | No | An OpenAI-compatible endpoint for text generation. |
| `EMBEDDING_MODEL_CONFIG__OVERRIDES__BASE_URL` | No | An OpenAI-compatible endpoint for embeddings. `LLM_OPENAI_BASE_URL` does not apply to embeddings. |
| `PORT` | No | Defaults to 80, which is what Vercel expects. |

See Honcho's [`.env.template`](https://github.com/plastic-labs/honcho/blob/v3.6.1/.env.template) for every setting.

## Test locally

Requires Docker and Python 3. The smoke test starts Postgres (`pgvector/pgvector:pg17`), a fake OpenAI server, the API, and the deriver, using the same environment variables as on Vercel, so no real keys are used.

```bash
docker build -t honcho-on-vercel .
bash local-test/smoke-test.sh
```

Expected output:

```
PASS  health (200)
PASS  rejects missing token (401)
PASS  rejects forged token (401)
PASS  create workspace (201)
PASS  create peer (201)
PASS  create session (201)
PASS  add messages (201)
PASS  list messages (200)
PASS  message stored
PASS  deriver worker extracted a conclusion
PASS  dialectic chat (200)
PASS  chat answered by the LLM
PASS  dialectic chat streaming (200)
PASS  streamed answer
PASS  serves on default port 80 (200)
PASS  API exits cleanly on SIGTERM (1231 ms)
PASS  deriver exits cleanly on SIGTERM (4490 ms)
All checks passed.
```

The fake server logs every call it receives to `local-test/.mock.log`.

## Caveats

- **Daemons are in beta.** They run only in production, don't autoscale, and accept no inbound traffic. The deriver only polls Postgres, so it needs none. Set its instance count in `vercel.json` or the dashboard.
- **No local disk.** Keep the default pgvector vector store. The optional LanceDB store writes to local disk, which is not persistent on Vercel.
- **Optional services.** Honcho's Redis cache (`CACHE_ENABLED`, off by default) can use a Redis database from the Marketplace. Leave `METRICS_ENABLED` off: it starts a Prometheus server on port 9090 that nothing would scrape.
- **License.** Honcho is AGPL-3.0. This example only builds the upstream source.

## Learn more

- [Container Runtime](https://vercel.com/docs/functions/runtimes/container)
- [Daemon configuration reference](https://vercel.com/docs/daemons/config-reference)
- [Can you run Docker Compose on Vercel?](https://vercel.com/i/can-you-run-docker-compose-on-vercel)
- [Honcho documentation](https://honcho.dev/docs)
