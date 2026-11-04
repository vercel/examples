---
name: Kairos on Vercel
slug: kairos-container
description: Run Kairos, an open-source real-time fraud and risk decisioning platform, on Vercel Functions as a container image with Postgres.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/kairos
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/kairos&project-name=kairos&repository-name=kairos&env=DATABASE_URL,GRAYSON_API_KEY
publisher: Vercel
relatedTemplates:
  - container-images-demo
  - vercel-with-neon-postgres
---

# Kairos on Vercel

Run [Kairos](https://github.com/finic-ai/kairos), an open-source real-time fraud and risk decisioning platform, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images). Send it sign-ups, logins, orders and payouts; one call returns approve, step up, review or block, with a risk score and the reasons. It serves its API, its MCP server and its web console from one Node.js process, and keeps all state in Postgres.

This example contains no Kairos code. `Dockerfile.vercel` fetches Kairos at a pinned commit, builds it with its own `pnpm build:standalone` script, and ships the single-file server on `node:22-slim`. Kairos already reads `PORT` and its configuration from environment variables, so it needs no changes to run on Vercel.

> Kairos has no tagged release yet. This example pins commit `e8fb857`; change `KAIROS_COMMIT` in `Dockerfile.vercel` to upgrade.

## How to use

You need a Postgres database and a Grayson API key from [portal.finic.ai/keys](https://portal.finic.ai/keys). Kairos calls Grayson, Finic's decision model, for every decision.

1. Add a Postgres database from the [Vercel Marketplace](https://vercel.com/marketplace/neon), for example Neon, and connect it to the project so `DATABASE_URL` is set. Use the pooled connection string: each instance holds up to 10 connections.
2. Add the key and deploy:

```bash
vercel env add GRAYSON_API_KEY
vercel deploy --prod
```

3. Open the deployment and create the first account: the first account owns the server. Then set `KAIROS_SIGNUP=invite` and redeploy so that nobody else can sign up without an invite.
4. In the console, create a secret key (`ksk_...`) under **Settings › API keys** and call the API:

```bash
curl -X PUT https://<your-deployment>.vercel.app/v1/actions/withdrawal \
  -H "Authorization: Bearer ksk_..." -H "content-type: application/json" \
  -d '{"subject":"user","hold":"Should this withdrawal be held because the account shows signs of fraud or takeover?"}'

curl https://<your-deployment>.vercel.app/v1/decide \
  -H "Authorization: Bearer ksk_..." -H "content-type: application/json" \
  -d '{"action":"withdrawal","entities":{"user":"user_42","device":"dev_9"},"properties":{"usd":900}}'
```

The container applies pending database migrations when it starts (`KAIROS_MIGRATE_ON_START=1`). Migrations are safe to repeat, and a lock in the database makes concurrent starts wait for each other.

## Environment variables

See [`.env.example`](./.env.example) and the [Kairos configuration reference](https://github.com/finic-ai/kairos/blob/main/docs/deployment/configuration.md).

| Variable | Required | Meaning |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection string. Set by a Marketplace Postgres integration; add `?sslmode=require` if your provider needs it. |
| `GRAYSON_API_KEY` | Yes | Key for Finic's Grayson decision model. |
| `KAIROS_SIGNUP` | No | `invite` so that new accounts need an invite link. Set it after you create the first account. |
| `KAIROS_ENCRYPTION_KEY` | For webhooks | 32 bytes (`openssl rand -base64 32`). Encrypts webhook signing secrets. Never change it once set. |
| `CRON_SECRET` | No | Opens `GET /internal/jobs/drain` to a scheduler, for retries of failed webhook deliveries. At least 16 characters. |
| `PORT` | No | Defaults to 80 in the image, which is what Vercel expects. |

The image also sets `KAIROS_TRUST_PROXY=1`, because every request reaches the function through Vercel's proxy, and `KAIROS_MIGRATE_ON_START=1`.

## Test locally

Requires Docker, Python 3, `curl` and `openssl`. The smoke test starts a real Postgres 17 and a stdlib-only fake of the Grayson API on a private Docker network, so no real keys are used. The fake answers on `https://api.finic.ai` inside that network with a throwaway self-signed certificate, which only the test container trusts.

```bash
docker build -f Dockerfile.vercel -t kairos-on-vercel .
./local-test/smoke-test.sh
```

Expected output:

```
PASS  health on default PORT 80 (200)
PASS  console served (200)
PASS  rejects missing API key (401)
PASS  sign up, first account (200)
PASS  create secret API key (200)
PASS  define action (200)
PASS  track event (202)
PASS  decide via mock model (200, decision=approve)
PASS  model call carried GRAYSON_API_KEY
PASS  decision stored in Postgres (200)
PASS  clean SIGTERM shutdown (exit 0 in 142 ms)
All checks passed.
```

## Caveats

- **Background jobs.** Kairos runs webhook deliveries, automatic decisions and workflow runs in the same process. Vercel scales idle instances down (after 5 minutes in production), so a job that fails is retried only while an instance is running, or when a scheduler calls `GET /internal/jobs/drain` with `Authorization: Bearer $CRON_SECRET`. Call it from any scheduler, as described in [Kairos on Vercel](https://github.com/finic-ai/kairos/blob/main/docs/deployment/self-hosting.md#vercel).
- **Preview deployments.** Every new instance applies migrations to its `DATABASE_URL`. Give previews their own database, or a Neon branch, so a preview never changes the production schema.
- **Request time.** A decision waits up to 10 seconds for the model, with two retries.
- **Alternative.** Kairos also ships its own non-container Vercel build (static console plus one Node.js function, with Vercel Cron for retries) when you deploy the upstream repository directly.

## Learn more

- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [Postgres on the Vercel Marketplace](https://vercel.com/docs/postgres)
- [Kairos documentation](https://kairos.finic.ai/docs)
