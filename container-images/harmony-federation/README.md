---
name: Harmony Federation Backend on Vercel
slug: harmony-federation-container
description: Run the ActivityPub federation backend of Harmony, an open-source federated chat app, on Vercel Functions as a container image with Supabase.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/harmony-federation
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/harmony-federation&project-name=harmony-federation&repository-name=harmony-federation&env=SUPABASE_URL,SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,INSTANCE_DOMAIN
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# Harmony Federation Backend on Vercel

Run the federation backend of [Harmony](https://github.com/y4my4my4m/harmony), an open-source, Discord-style chat app that federates over ActivityPub, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/runtimes/container). The backend is an Express server that answers WebFinger, NodeInfo, actor, inbox and outbox requests, and reads its data from [Supabase](https://vercel.com/marketplace/supabase).

This example contains no Harmony code. `Dockerfile.vercel` fetches Harmony at a pinned release (`v1.9.3`), builds `federation-backend/` the same way upstream does, and runs it in `FEDERATION_MODE=server` on port 80, Vercel's default. The image also accepts the variable names the Supabase Marketplace integration sets (`SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`).

> To upgrade, change `HARMONY_COMMIT` in `Dockerfile.vercel`.

## How to use

1. Create a Supabase project, for example from the [Vercel Marketplace](https://vercel.com/marketplace/supabase), and apply Harmony's database migrations from [`db_schema/`](https://github.com/y4my4my4m/harmony/tree/master/db_schema) (see the [self-hosting docs](https://github.com/y4my4my4m/harmony/tree/master/docs/self-host)).
2. Deploy with the button, or from this folder:

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add INSTANCE_DOMAIN
vercel deploy --prod
```

3. Check it:

```bash
curl https://<your-deployment>.vercel.app/health
curl https://<your-deployment>.vercel.app/nodeinfo/2.1
```

The Harmony web app (Vue 3 + Vite) is a separate static build. Point it at this backend with `VITE_FEDERATION_URL`.

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Your Supabase project URL. |
| `SUPABASE_ANON_KEY` | Yes | Public key. Falls back to `SUPABASE_PUBLISHABLE_KEY` (set by the Marketplace integration). |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server key. Falls back to `SUPABASE_SECRET_KEY` (set by the Marketplace integration). |
| `INSTANCE_DOMAIN` | Yes | Public domain of the instance, without `https://`. Used in actor and WebFinger URLs. |
| `CORS_ORIGIN` | No | Browser origin of the Harmony web app. |
| `REDIS_URL` | No | Redis for cache, rate limits and queues. Without it the server logs a warning and runs without cache. |
| `PORT` | No | `80` in the image, which is what Vercel expects. |
| `FEDERATION_MODE` | No | `server` in the image (HTTP only). |

The server exits at startup if a required variable is missing.

## Test locally

Requires Docker and Python 3. The smoke test runs the image against a stdlib-only fake Supabase REST API, so no real project or keys are used.

```bash
docker build -f Dockerfile.vercel -t harmony-federation:local .
bash local-test/smoke-test.sh
```

Expected output:

```
PASS  health on default port 80 (200)
PASS  health reports database connected
PASS  health reports instance domain
PASS  webfinger finds local user (200)
PASS  webfinger self link points at actor
PASS  webfinger unknown user (404)
PASS  nodeinfo discovery (200)
PASS  nodeinfo 2.1 (200)
PASS  nodeinfo usage comes from the database
PASS  host-meta (200)
PASS  Marketplace SUPABASE_SECRET_KEY used as service role key
PASS  SIGTERM clean shutdown (exit 0, 163 ms)
All checks passed.
```

## Caveats

- **`/.well-known` routing.** Vercel reserves the `/.well-known` path and [does not rewrite it](https://vercel.com/docs/routing/rewrites). Federation discovery depends on `/.well-known/webfinger` and `/.well-known/nodeinfo`, so check those paths on your deployment before federating with other servers.
- **Queue worker.** Harmony processes inbound and outbound activities with a BullMQ worker (`FEDERATION_MODE=worker`), a long-running process that needs Redis. This example runs only the HTTP server. Run the worker somewhere that keeps a process alive.
- **Per-instance state.** Functions scale out and scale in, and the file system is not persistent. Upstream's logger also writes files under `logs/`; use the console output in Vercel logs.
- **Voice and video** use LiveKit, which stays an external service.

## Learn more

- [Container runtime on Vercel Functions](https://vercel.com/docs/functions/runtimes/container)
- [Services](https://vercel.com/docs/services)
- [Supabase on the Vercel Marketplace](https://vercel.com/marketplace/supabase)
- [Harmony federation docs](https://github.com/y4my4my4m/harmony/tree/master/docs/federation)
