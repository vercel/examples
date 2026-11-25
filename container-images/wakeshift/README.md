---
name: Wakeshift on Vercel
slug: wakeshift-container
description: Self-host Wakeshift, the open-source MCP Events server that wakes AI agents, on Vercel Functions as a container image with Postgres.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/wakeshift
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/wakeshift&project-name=wakeshift&repository-name=wakeshift&env=PORT,DATABASE_URL,WAKESHIFT_MIGRATE_DATABASE_URL,WAKESHIFT_PUBLIC_URL,WAKESHIFT_SECRET_KEY,WAKESHIFT_APPS,WAKESHIFT_MCP_EVENTS_PUSH
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# Wakeshift on Vercel

Run the [Wakeshift](https://github.com/wakeshift/server) server, an open-source implementation of [MCP Events](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/3415), on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/runtimes/container). Wakeshift lets an MCP server emit events (a build finished, a webhook arrived) to the AI agents that use it: clients that speak MCP Events get webhook, poll or push delivery, and agents that don't yet (Claude Code, Codex, Cursor and others) are woken through bridges. Postgres holds every subscription and delivery.

This example contains no Wakeshift code. `Dockerfile.vercel` fetches the server at a pinned commit, builds its console, compiles one static Go binary (plus the `/appkey` tool), and ships them on a distroless image as a non-root user (about 51 MB). The server already listens on `$PORT`, reads its configuration from environment variables, migrates its database at startup, and drains streams on `SIGTERM`, so it needs no code changes to run on Vercel.

> Wakeshift has no tagged release yet. This example pins commit `efa2025`; change `WAKESHIFT_COMMIT` in `Dockerfile.vercel` to upgrade.

## How to use

### 1. Create a Postgres database

Add Postgres 17 from the [Vercel Marketplace](https://vercel.com/docs/marketplace-storage) (for example Neon), or use any Postgres 17 you run. Wakeshift refuses to start as a role that is a superuser, has `BYPASSRLS`, or can switch to one, because row-level security isolates tenants. Create two ordinary roles, as the [self-hosting guide](https://github.com/wakeshift/server/blob/main/docs/self-hosting.md#postgres) describes:

```sql
CREATE ROLE wakeshift LOGIN PASSWORD '…' NOSUPERUSER NOBYPASSRLS CREATEROLE;
CREATE ROLE wakeshift_server LOGIN PASSWORD '…' NOSUPERUSER NOBYPASSRLS NOCREATEROLE NOCREATEDB;
CREATE DATABASE wakeshift OWNER wakeshift;
```

Use the `wakeshift` (owner) URL for `WAKESHIFT_MIGRATE_DATABASE_URL` and the `wakeshift_server` URL for `DATABASE_URL`.

### 2. Make an app key

Build the image once and run its `/appkey` tool (or `go run ./cmd/appkey -app my-app` in a clone of the server):

```bash
docker build -f Dockerfile.vercel -t wakeshift-on-vercel .
docker run --rm --entrypoint /appkey wakeshift-on-vercel -app my-app
```

It prints `WAKESHIFT_KEY=wst_…` (your MCP server's private key; keep it out of version control) and `WAKESHIFT_APPS=[…]` (the public half, for this server).

### 3. Deploy

Deploy with the button, or from this folder:

```bash
vercel env add PORT                            # 8370
vercel env add DATABASE_URL
vercel env add WAKESHIFT_MIGRATE_DATABASE_URL
vercel env add WAKESHIFT_PUBLIC_URL            # https://<your-project>.vercel.app
vercel env add WAKESHIFT_SECRET_KEY            # openssl rand -base64 48
vercel env add WAKESHIFT_APPS
vercel env add WAKESHIFT_MCP_EVENTS_PUSH       # 1
vercel deploy --prod
```

Then point your MCP server's [Wakeshift SDK](https://github.com/wakeshift/server#sdks-and-plugins) at it with `WAKESHIFT_CORE=https://<your-project>.vercel.app` and the `WAKESHIFT_KEY` from step 2.

```bash
curl https://<your-project>.vercel.app/health
```

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `PORT` | Yes | `8370`. The server runs as a non-root user, so it listens on an unprivileged port; Vercel routes to the port in this project variable (80 by default). |
| `DATABASE_URL` | Yes | Postgres 17, as a role that is not a superuser and has no `BYPASSRLS`. |
| `WAKESHIFT_MIGRATE_DATABASE_URL` | Recommended | The database owner's URL. It migrates at startup and grants the server role only reads and writes. Without it, the server runs as the owner. |
| `WAKESHIFT_PUBLIC_URL` | Yes | This deployment's `https` URL, no path. Links, cookies and the issuer plugins trust derive from it, so use your production domain and keep it stable. |
| `WAKESHIFT_SECRET_KEY` | Yes | At least 32 random bytes. Changing it signs everyone out and invalidates stream links. |
| `WAKESHIFT_APPS` | No | Apps to register at startup, from `/appkey`. Not needed if developers create apps in the console. |
| `WAKESHIFT_MCP_EVENTS_PUSH` | No | `1` turns on MCP Events push (`events/stream`), which is off by default on non-localhost hosts. |
| `WAKESHIFT_GITHUB_CLIENT_ID`, `WAKESHIFT_GITHUB_CLIENT_SECRET` | No | Console sign-in with a GitHub OAuth app (callback `$WAKESHIFT_PUBLIC_URL/auth/github/callback`). Google works the same way. |
| `WAKESHIFT_ALLOWED_SIGNUPS` | No | Emails and `@domains` allowed to create console accounts. |

## Test locally

Requires Docker, curl and Node.js 22.2 or later. The smoke test starts a throwaway Postgres 17 container with the two roles above, runs the image against it, and drives the app API with a standard-library client (`local-test/client.mjs`), so no real credentials are used.

```bash
docker build -f Dockerfile.vercel -t wakeshift-on-vercel .
bash local-test/smoke-test.sh
```

Expected output:

```
PASS  health on PORT=8080 (200)
PASS  console served (200)
PASS  app API rejects unsigned call (401)
PASS  signed app call (app smoke)
PASS  publish manifest (build.finished)
PASS  MCP Events poll subscription created
PASS  publish URL created
PASS  webhook POST to publish URL (202)
PASS  emit from the app API
PASS  poll delivers the webhook occurrence
PASS  poll delivers the emitted occurrence
PASS  health on image default port 8370 (200)
PASS  clean SIGTERM shutdown (exit 0 in 397 ms)
All checks passed.
```

The test registers an app, publishes a `build.finished` event, subscribes to it the way an MCP Events client does with `events/poll`, then sends one occurrence through a publish URL (as a GitHub or CI webhook would) and one through `emit`, and checks that the poll returns both.

## Caveats

- **Long-held requests.** Push streams (`events/stream`), stream links and long polls hold a request open for up to an hour. On Vercel each request ends at the function's [maximum duration](https://vercel.com/docs/functions/configuring-functions/duration), so clients reconnect with their cursor more often; Wakeshift replays what they missed. Set `WAKESHIFT_MAX_STREAMS` below what one instance should hold.
- **Background work.** The server's in-process runner (webhook delivery retries, reaping expired deliveries) only runs while an instance is up, and idle instances [scale down](https://vercel.com/docs/functions/runtimes/container#scale-in-behavior). Poll and push are request-driven and unaffected.
- **Agent installs.** The image carries no connector binaries, so out of the box only agents that need no install are woken (Claude Code through its Monitor, Cursor, Copilot CLI, Antigravity CLI and MCP Events clients). See [the connector and installs](https://github.com/wakeshift/server/blob/main/docs/self-hosting.md#the-connector-and-installs).
- **Credentials in URLs.** Publish URLs, stream links and invite codes are credentials in the URL path. Treat request logs accordingly, as the [self-hosting guide](https://github.com/wakeshift/server/blob/main/docs/self-hosting.md#keep-credentials-out-of-access-logs) explains.

## Learn more

- [Container Runtime on Vercel Functions](https://vercel.com/docs/functions/runtimes/container)
- [Deploy Go apps on Vercel using Docker](https://vercel.com/kb/guide/deploy-go-using-docker-vercel)
- [Wakeshift self-hosting guide](https://github.com/wakeshift/server/blob/main/docs/self-hosting.md)
- [Wakeshift HTTP API](https://wakeshift.ai/docs/http-api)
