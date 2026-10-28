---
name: CaseCite on Vercel
slug: casecite-container
description: Run CaseCite, an open-source legal research and document analysis platform (RAG over your documents plus case law), on Vercel Functions as a container image.
framework:
  - Other
type:
  - Starter
  - AI
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/casecite
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/casecite&project-name=casecite&repository-name=casecite&env=SECRET_KEY,ENCRYPTION_SALT,AUDIT_HMAC_KEY,REGISTRATION_BOOTSTRAP_TOKEN,DATABASE_URL,REDIS_URL,ALLOWED_HOSTS,CORS_ORIGINS,DISK_ENCRYPTION_ACKNOWLEDGED,OPENAI_API_KEY
publisher: Vercel
relatedTemplates:
  - container-images-demo
  - respan-gateway-container
---

# CaseCite on Vercel

Run [CaseCite](https://github.com/thomasunise/casecite), an open-source (Apache-2.0) legal research platform, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images). Upload documents and chat over them with inline citations, review and compare contracts, draft from references, and research case law through CourtListener, with the AI providers and keys you choose.

This example contains no CaseCite code. `Dockerfile.vercel` fetches CaseCite at a pinned commit, builds its React frontend, installs the FastAPI backend from its lock file, and runs the upstream single-container setup: nginx serves the frontend and proxies `/api` to uvicorn. The only change is that nginx listens on `$PORT` (default `80`, which is what Vercel expects).

> The pinned commit (`ddffb01`) is the first revision released under Apache-2.0; 1.3.0 and earlier use the Elastic License 2.0. Change `CASECITE_COMMIT` in `Dockerfile.vercel` to upgrade.

## How to use

CaseCite needs Postgres and Redis. Add both from the [Vercel Marketplace](https://vercel.com/docs/marketplace-storage) (for example Neon and Upstash), then set the variables below and deploy:

```bash
vercel install neon
vercel install upstash
vercel env add SECRET_KEY            # openssl rand -hex 32
vercel env add ENCRYPTION_SALT       # openssl rand -hex 16
vercel env add AUDIT_HMAC_KEY        # openssl rand -hex 32
vercel env add REGISTRATION_BOOTSTRAP_TOKEN
vercel env add DATABASE_URL          # postgresql+asyncpg://user:pass@host/db (no ?sslmode=...)
vercel env add REDIS_URL             # rediss://default:token@host:6379
vercel env add ALLOWED_HOSTS         # your-project.vercel.app
vercel env add CORS_ORIGINS          # https://your-project.vercel.app
vercel env add DISK_ENCRYPTION_ACKNOWLEDGED   # true
vercel env add OPENAI_API_KEY
vercel deploy --prod
```

Migrations run on every cold start before the app listens. Open the deployment and create the first account with your `REGISTRATION_BOOTSTRAP_TOKEN`; it becomes the admin.

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `SECRET_KEY`, `ENCRYPTION_SALT`, `AUDIT_HMAC_KEY` | Yes | Signing, encryption and audit-chain keys. The app refuses to start without them. |
| `REGISTRATION_BOOTSTRAP_TOKEN` | Yes | Required to create the first (admin) account. |
| `DATABASE_URL` | Yes | Postgres, as `postgresql+asyncpg://...`. Marketplace URLs that start with `postgres://` are converted, but remove query parameters such as `sslmode`. |
| `DB_SSL` | No | `require` (default) for a database reached over the network. |
| `REDIS_URL` | Yes | Redis for the job queue, token revocation and lockouts. Use a `noeviction` policy. |
| `ALLOWED_HOSTS`, `CORS_ORIGINS` | Yes | Your deployment's hostname and origin. |
| `DISK_ENCRYPTION_ACKNOWLEDGED` | Yes | Set to `true` once your database, Redis and vector store are encrypted at rest. |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` | No | Server-wide provider keys. Without one, each user saves their own key. |
| `OPENAI_BASE_URL`, `EMBEDDING_BASE_URL` | No | Any OpenAI-compatible endpoint for chat and embeddings. |
| `VECTOR_DB`, `PINECONE_API_KEY`, `PINECONE_INDEX_NAME` | Recommended | `pinecone` for a shared, durable index (see Caveats). |
| `PORT` | No | Defaults to 80 in the image, which is what Vercel expects. |

## Test locally

Requires Docker, Python 3 and OpenSSL. The smoke test starts Postgres and Redis containers and a fake OpenAI-compatible server, so no real keys are used.

```bash
docker build -f Dockerfile.vercel -t casecite-on-vercel .
./local-test/smoke-test.sh
```

Expected output:

```
PASS  health (200)
PASS  frontend shell (200)
PASS  frontend references built assets
PASS  rejects unauthenticated API call (401)
PASS  CSRF token (200)
PASS  first account needs bootstrap token (403)
PASS  register first admin (201)
PASS  login (200)
PASS  current user (200)
PASS  upload and index document (200)
PASS  research chat over documents (200)
PASS  answer comes from the model
PASS  embeddings sent to OpenAI-compatible endpoint
PASS  chat sent to OpenAI-compatible endpoint
PASS  clean shutdown on SIGTERM (exit 0, 2s)
--- mock provider calls
      3 MOCK POST /v1/chat/completions model=gpt-5.4-mini stream=None
      2 MOCK POST /v1/chat/completions model=gpt-5.5 stream=None
      4 MOCK POST /v1/embeddings model=text-embedding-3-small stream=None
All checks passed.
```

The image is about 1.3 GB uncompressed (Python dependencies, nginx and Tesseract OCR); the first build takes several minutes.

## Caveats

- **Per-instance disk.** Vercel scales to many instances and the file system is not persistent. CaseCite keeps the default Chroma vector index, original uploaded files and audit-log files under `/app/data`, so each instance would have its own copy and lose it when it stops. Set `VECTOR_DB=pinecone` for a shared index, and treat the database as the system of record.
- **Upload size.** Requests to Vercel Functions are limited to 4.5 MB, so larger documents can't be uploaded through the app.
- **Background jobs.** Long AI jobs run in-process (`asyncio`) with their state in Redis. They must finish within the function's maximum duration; very long drafts may be cut off.
- **Client IPs.** CaseCite uses `X-Forwarded-For` for rate limits and lockouts and only trusts `127.0.0.1` (nginx) by default. Check that per-user lockouts behave as expected behind Vercel before relying on them.

## Learn more

- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [Deploy Go apps on Vercel using Docker](https://vercel.com/kb/guide/deploy-go-using-docker-vercel)
- [CaseCite configuration](https://github.com/thomasunise/casecite/blob/main/.env.example)
