---
name: SlashObserve on Vercel
slug: slashobserve-container
description: Run SlashObserve, an open-source, prompt-to-dashboard observability workspace for Prometheus, ClickHouse, Loki and more, on Vercel Functions as a container image.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/slashobserve
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/slashobserve&project-name=slashobserve&repository-name=slashobserve&env=SLASHOBSERVE_DATABASE_URL,SLASHOBSERVE_PUBLIC_URL,SLASHOBSERVE_OIDC_ISSUER_URL,SLASHOBSERVE_OIDC_CLIENT_ID,SLASHOBSERVE_OIDC_CLIENT_SECRET,SLASHOBSERVE_AUTH_ALLOWED_EMAIL_DOMAINS
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# SlashObserve on Vercel

Run [SlashObserve](https://github.com/slashobserve/slashobserve) on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/runtimes/container). SlashObserve is an open-source observability workspace: type `/observe checkout health by pod, last 6h` and its agent builds a verified, Grafana-style dashboard on the stores you already run (Prometheus, ClickHouse, Loki, Tempo, Jaeger, Elasticsearch, OpenSearch). Coding agents such as Claude Code connect to it over MCP.

This example contains no SlashObserve code. `Dockerfile.vercel` starts from the official release image, pinned by version and digest (`0.1.5`, about 68 MB, distroless, non-root), and changes three settings for Vercel: it listens on port 80, logs JSON, and turns off the public `/metrics` route. State lives in Postgres, so a Neon Postgres database from the [Vercel Marketplace](https://vercel.com/docs/marketplace-storage) is the only service you add.

> SlashObserve is pre-1.0 and its database schema can change between minor releases. To upgrade, change the tag and digest in `Dockerfile.vercel` after reading the upstream changelog.

## How to use

1. Create the project and add Postgres. Neon supplies a pooled `DATABASE_URL` and a direct `DATABASE_URL_UNPOOLED`:

   ```bash
   vercel link
   vercel install neon
   ```

2. Create an OIDC client in your identity provider (Okta, Google, Auth0, Keycloak, ...) with the redirect URI `https://<your-project>.vercel.app/api/v1/auth/callback`.

3. Add the settings. Copy Neon's pooled URL into `SLASHOBSERVE_DATABASE_URL` and the unpooled one into `SLASHOBSERVE_DATABASE_DIRECT_URL`:

   ```bash
   vercel env add SLASHOBSERVE_DATABASE_URL
   vercel env add SLASHOBSERVE_DATABASE_DIRECT_URL
   vercel env add SLASHOBSERVE_PUBLIC_URL
   vercel env add SLASHOBSERVE_OIDC_ISSUER_URL
   vercel env add SLASHOBSERVE_OIDC_CLIENT_ID
   vercel env add SLASHOBSERVE_OIDC_CLIENT_SECRET
   vercel env add SLASHOBSERVE_AUTH_ALLOWED_EMAIL_DOMAINS
   vercel env add SLASHOBSERVE_ADMIN_EMAILS
   vercel env add SLASHOBSERVE_SECRET_KEY   # openssl rand -hex 32
   ```

4. Deploy:

   ```bash
   vercel deploy --prod
   ```

The server applies its database migrations on start. Sign in, add your datasources on the Datasources page, and create an API key for the `observe` CLI or MCP clients on the API keys page. To turn on the built-in agent, also set `SLASHOBSERVE_LLM_PROVIDER` and `SLASHOBSERVE_LLM_API_KEY`.

## Environment variables

See [`.env.example`](./.env.example) and the [upstream configuration reference](https://github.com/slashobserve/slashobserve/blob/main/docs/reference/configuration.md).

| Variable | Required | Meaning |
| --- | --- | --- |
| `SLASHOBSERVE_DATABASE_URL` | Yes | Postgres connection string. With Neon, the pooled URL. |
| `SLASHOBSERVE_DATABASE_DIRECT_URL` | With a pooler | Direct connection for live updates (`LISTEN`) and migrations. With Neon, the unpooled URL. |
| `SLASHOBSERVE_PUBLIC_URL` | Yes | The address people use, such as `https://<your-project>.vercel.app`. |
| `SLASHOBSERVE_OIDC_ISSUER_URL`, `SLASHOBSERVE_OIDC_CLIENT_ID`, `SLASHOBSERVE_OIDC_CLIENT_SECRET` | Yes | Browser sign-in. Set all three or none. |
| `SLASHOBSERVE_AUTH_ALLOWED_EMAIL_DOMAINS` | Yes | Email domains that may sign in. |
| `SLASHOBSERVE_ADMIN_EMAILS` | No | Addresses that become Admin. Otherwise the first person to sign in is Admin. |
| `SLASHOBSERVE_SECRET_KEY` | No | Encrypts datasource credentials added in the app. Needed to save them. |
| `SLASHOBSERVE_LLM_PROVIDER`, `SLASHOBSERVE_LLM_API_KEY` | No | Turn on the built-in agent (`anthropic` or `openai`). |
| `SLASHOBSERVE_HTTP_ADDR` | No | `:80` in the image, Vercel's default port. |

## Test locally

Requires Docker and `openssl`. The smoke test starts Postgres 18 and a fake Prometheus (Python standard library only, run in a `python:3.13-alpine` container), then runs the image with browser sign-in off and a throwaway service-account key. No real secrets are used.

```bash
docker build -f Dockerfile.vercel -t slashobserve-on-vercel .
bash local-test/smoke-test.sh
```

Expected output:

```
PASS  liveness /healthz (200)
PASS  readiness /readyz (200)
PASS  Postgres connected, migrations applied
PASS  rejects request without a key (401)
PASS  lists datasources with a key (200)
PASS  datasource from file is listed
PASS  PromQL range query via SlashObserve (200)
PASS  query returned the mock series
PASS  web app (200)
PASS  no public Prometheus metrics at /metrics
PASS  SIGTERM: clean exit in 306 ms
All checks passed.
```

## Caveats

- **Scale to zero.** Vercel scales idle functions down and sends `SIGTERM` with a 30-second grace period; SlashObserve shuts down in well under a second. Its periodic jobs (dashboard health checks, OAuth cleanup) run only while an instance is up, and live updates and agent runs last only as long as the function's maximum duration, so clients reconnect.
- **Agent runs.** The built-in agent runs in the same process (8 workers by default, `SLASHOBSERVE_AGENT_WORKERS`). A run in flight when an instance scales down is cut short.
- **Database connections.** Each instance opens a pool of at least 16 connections. Use Neon's pooled URL for `SLASHOBSERVE_DATABASE_URL`, or add `pool_max_conns=N`.
- **Datasources must be reachable from Vercel.** Prometheus, ClickHouse and the rest must accept connections from the public internet. For private networks, check [Container Runtime](https://vercel.com/docs/functions/runtimes/container) for current Secure Compute and Static IPs support; this example has not been tested with either.
- **Port 80 as non-root.** The image runs as a non-root user. Binding port 80 worked in Docker; if it fails on your deployment, set `SLASHOBSERVE_HTTP_ADDR=:8080` and `PORT=8080` in the project's environment variables.

## Learn more

- [Container Runtime on Vercel Functions](https://vercel.com/docs/functions/runtimes/container)
- [Running Docker on Vercel](https://vercel.com/kb/guide/docker)
- [Storage on the Vercel Marketplace](https://vercel.com/docs/marketplace-storage)
- [SlashObserve: run your own deployment](https://github.com/slashobserve/slashobserve/blob/main/docs/get-started/install.md)
