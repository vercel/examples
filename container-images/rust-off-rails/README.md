---
name: Rust off Rails on Vercel
slug: rust-off-rails-container
description: Run the Rust off Rails app template, a Rails-style full-stack Rust web app (axum, sea-orm, htmx, Tailwind), on Vercel Functions as a container image with Postgres.
framework:
  - Other
type:
  - Starter
css:
  - Tailwind
githubUrl: https://github.com/vercel/examples/tree/main/container-images/rust-off-rails
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/rust-off-rails&project-name=rust-off-rails&repository-name=rust-off-rails&env=DATABASE_URL,APP_URL
publisher: Vercel
relatedTemplates:
  - container-images-demo
  - rust-axum
---

# Rust off Rails on Vercel

Run the app template of [Rust off Rails](https://github.com/rust-off-rails/rustoffrails), an opinionated full-stack Rust web stack modeled on Ruby on Rails (axum, sea-orm, Askama, htmx, Tailwind), on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images), with Postgres from the [Vercel Marketplace](https://vercel.com/marketplace).

This example contains no app code. `Dockerfile.vercel` fetches Rust off Rails at a pinned release, builds the template's CSS with its pinned standalone Tailwind, compiles the release binary, and ships it on `debian:trixie-slim`. The template already listens on `0.0.0.0:$PORT` in production, configures itself from environment variables, serves a `/up` health check, and drains on `SIGTERM`, so it needs no code changes to run on Vercel.

> This example pins Rust off Rails `v0.7.3` (commit `2913be2`). Change `OFFRAILS_COMMIT` in `Dockerfile.vercel` to upgrade. To deploy your own app built with Rust off Rails, copy `Dockerfile.vercel` and `vercel.json` into it and replace the fetch stage with `COPY . .`.

## How to use

1. Add a Postgres database to the project, for example [Neon](https://vercel.com/marketplace/neon) (`vercel install neon`). It sets `DATABASE_URL`.
2. Set `APP_URL` to the app's public URL.
3. Deploy:

```bash
vercel env add APP_URL
vercel deploy --prod
```

The container runs the database migrations on boot (`bin/docker-entrypoint`), then serves the app:

```bash
curl https://<your-deployment>.vercel.app/up
```

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection string. Set by a Marketplace database integration such as Neon. |
| `APP_URL` | Yes | The public URL, for absolute links, the sitemap, social cards and the trusted CSRF origin. The app refuses to boot in production without it. |
| `SKIP_MIGRATIONS` | No | Set to `true` to stop migrating on boot (see Caveats). |
| `PORT` | No | Defaults to 80 in the image, which is what Vercel expects. |
| `APP_ENV`, `LOG_FORMAT`, `APP_TRUSTED_PROXY` | No | Set in the image to `production`, `json` and `true`. |

## Test locally

Requires Docker. The smoke test runs the image with its production settings against a throwaway `postgres:17` container, so no real database or secrets are used.

```bash
docker build -f Dockerfile.vercel -t rust-off-rails-on-vercel .
bash local-test/smoke-test.sh
```

Expected output:

```
PASS  health: database up, migrations applied (200)
PASS  health body is ok
PASS  home page (200)
PASS  home page rendered
PASS  compiled Tailwind CSS (/static/app.css?v=ca87c72f) (200)
PASS  security headers (200)
PASS  CSP and nosniff set
PASS  dev tools absent in production (404)
PASS  cross-site POST blocked (CSRF) (403)
PASS  same-origin POST accepted (303)
PASS  robots.txt (200)
PASS  JSON logs on stdout
PASS  clean SIGTERM shutdown (exit 0 in 120 ms)
All checks passed.
```

The CSS digest and shutdown time vary. The first build takes several minutes because it compiles about 300 Rust crates; the final image is about 110 MB.

## Caveats

- **Migrations.** The image migrates on every cold start, which is fine for a first deploy. sea-orm-migration takes no lock, so for a real app run `app db migrate` once per deploy (for example from CI against `DATABASE_URL`) and set `SKIP_MIGRATIONS=true`. `/up` returns 503 while migrations are pending.
- **No local disk.** Instances scale out and their file system is not persistent, so use Postgres in production, not the SQLite file the template uses in development (`storage/`). Keep user files in [Vercel Blob](https://vercel.com/docs/vercel-blob) or another object store.
- **Background jobs and realtime.** The base template has neither. The optional `jobs` part runs its production worker as a separate `app worker` process, which fits an always-on [Vercel Daemon](https://vercel.com/docs/daemons) built from the same image. The `realtime` part uses WebSockets (with SSE and long-poll fallbacks) and Postgres `LISTEN/NOTIFY` between nodes; [WebSockets on Vercel Functions](https://vercel.com/kb/guide/publish-and-subscribe-to-realtime-data-on-vercel) close at the function's maximum duration, so clients reconnect. Neither has been tested with this example.

## Learn more

- [Deploy Rust on Vercel with Docker](https://vercel.com/kb/guide/deploy-rust-on-vercel-with-docker)
- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [How Docker Compose concepts map to Vercel](https://vercel.com/kb/guide/docker-compose-concepts-on-vercel)
- [Rust off Rails app template](https://github.com/rust-off-rails/rustoffrails/tree/main/template)
