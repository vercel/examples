---
name: Hatamoto on Vercel
slug: hatamoto-container
description: Run Hatamoto, an open-source Go CMS, on Vercel Functions as a container image with Postgres from the Vercel Marketplace.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/hatamoto
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/hatamoto&project-name=hatamoto&repository-name=hatamoto&env=HATAMOTO_SECRET,HATAMOTO_SETUP_CODE
publisher: Vercel
relatedTemplates:
  - container-images-demo
  - respan-gateway-container
---

# Hatamoto on Vercel

Run [Hatamoto](https://github.com/Zen-Labs-Corp/hatamoto), an open-source CMS written in Go, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images). Hatamoto is one binary that serves the site, the admin, the API and an MCP server, and keeps content, users, sessions, themes and plugins in Postgres.

This example contains no Hatamoto code. `Dockerfile.vercel` fetches Hatamoto at the `v1.0.1` release tag, compiles it, and ships the binary on Alpine (about 97 MB). The image is configured for Vercel with environment variables only:

- It runs `hatamoto serve` and listens on `$PORT` (80 by default, which is where Vercel routes traffic).
- It prefers Neon's `DATABASE_URL_UNPOOLED` over `DATABASE_URL`, because migrations take a session-level advisory lock.
- It keeps its data directory and uploads in `/tmp`, turns off the in-app updater (the version is pinned in the Dockerfile), and trusts the `X-Forwarded-*` headers from Vercel's proxy.

To upgrade, change `HATAMOTO_VERSION` in `Dockerfile.vercel`.

## How to use

Deploy with the button and then connect a Postgres database such as Neon from the [Vercel Marketplace](https://vercel.com/marketplace/neon/neon) (it injects `DATABASE_URL` and `DATABASE_URL_UNPOOLED`) and redeploy, or do it all from this folder:

```bash
vercel link
vercel integration add neon
vercel env add HATAMOTO_SECRET      # openssl rand -hex 32
vercel env add HATAMOTO_SETUP_CODE  # at least 12 characters
vercel deploy --prod
```

Then open `https://<your-deployment>.vercel.app/<admin>/setup` and enter your setup code to create the owner account. Unless you set `HATAMOTO_ADMIN_PATH`, a fresh install picks a private admin address and logs it as `Setup: open /<admin>/setup ...` in the runtime logs.

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Yes | Postgres connection strings. The Neon integration sets both; the container uses the unpooled one when present. |
| `HATAMOTO_SECRET` | Yes | At least 32 characters, the same for every instance. Keys cookies, preview links and stored credentials. Without it each instance would generate its own. |
| `HATAMOTO_SETUP_CODE` | Yes | Code the first-run wizard asks for. Without it every instance logs a different random code. |
| `PUBLIC_BASE_URL` | No | Your public origin. Turns on the HTML page cache and is used for canonical links, sitemaps and `llms.txt`. |
| `HATAMOTO_ADMIN_PATH` | No | Pins the admin address, for example `/my-studio-door`. |
| `PORT` | No | Port the container listens on. Defaults to 80, which is what Vercel expects. |

Every other Hatamoto setting from its [configuration reference](https://github.com/Zen-Labs-Corp/hatamoto/blob/main/docs/site/operate/configuration-reference.md) works as a Vercel environment variable too.

## Test locally

Requires Docker. The smoke test starts a throwaway Postgres container and runs the image against it with the same variables as on Vercel, so no real database or secrets are used.

```bash
docker build -f Dockerfile.vercel -t hatamoto-on-vercel .
./local-test/smoke-test.sh
```

Expected output:

```
PASS  health (200)
PASS  health body is ok
PASS  ready (Postgres via DATABASE_URL_UNPOOLED) (200)
PASS  home page (200)
PASS  first-run wizard at HATAMOTO_ADMIN_PATH/setup (200)
PASS  wizard asks for the setup code
PASS  create owner (hatamoto user create)
PASS  publish a page (hatamoto entity create --publish)
PASS  published page is served (200)
PASS  page shows its content
PASS  ready with API key returns JSON (200)
PASS  database connected
PASS  SIGTERM exits cleanly (code 0, 0s)
PASS  default PORT 80
All checks passed.
```

## Caveats

- **Media uploads are not durable.** Hatamoto stores uploaded files on local disk (`MEDIA_UPLOAD_DIR`). On Vercel that disk is ephemeral and per instance, so uploads disappear and are not shared between instances. Host images elsewhere and link them, or wait for object storage support upstream.
- **Background jobs run only while an instance is up.** Scheduled publishing, webhook delivery, retention and crawler-analytics upkeep run in process. Instances scale to zero when idle, so scheduled work runs late rather than on time. Set `HATAMOTO_WORKER=off` if you would rather not run it at all.
- **Per-instance caches.** The HTML page cache and rate limiters live in memory. Page edits clear other instances within seconds; settings and theme changes can take up to `HATAMOTO_PAGE_CACHE_TTL` (5 minutes by default) to show everywhere.
- **No self-updates.** The in-app updater replaces binaries on disk, which does not fit immutable deployments. Upgrade by bumping `HATAMOTO_VERSION` and redeploying.
- **Backups.** The admin's backup feature needs `pg_dump`, which this image does not include. Use your Postgres provider's backups instead.

## Learn more

- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [Deploy a Go app on Vercel with Docker](https://vercel.com/kb/guide/deploy-go-using-docker-vercel)
- [Hatamoto: multiple replicas and health checks](https://github.com/Zen-Labs-Corp/hatamoto/blob/main/docs/site/operate/multi-replica-and-health.md)
