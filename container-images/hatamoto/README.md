---
name: Hatamoto on Vercel
slug: hatamoto-container
description: Run Hatamoto, an open-source Go CMS with a visual builder, MCP server and plugin sandbox, on Vercel Functions as a container image with Postgres.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/hatamoto
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/hatamoto&project-name=hatamoto&repository-name=hatamoto&env=DATABASE_URL,HATAMOTO_SECRET,HATAMOTO_SETUP_CODE
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# Hatamoto on Vercel

Run [Hatamoto](https://github.com/Zen-Labs-Corp/hatamoto), an open-source CMS written in Go, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/runtimes/container). One binary serves the site, the admin, the JSON API and an MCP server for AI agents. Content, themes, plugins and sessions live in Postgres.

This example contains no Hatamoto code. `Dockerfile.vercel` fetches Hatamoto v1.4.6 at its pinned commit, builds the static Go binary the same way as the upstream image, and ships it on Debian slim with the Postgres client tools that in-app backups use (about 87 MB compressed). Hatamoto already configures itself from environment variables. The image adds three settings for Vercel:

- It runs `hatamoto serve` instead of the upstream default `hatamoto supervise`. The supervisor installs new releases onto local disk, but Vercel deployments are immutable, so auto-updates are off (`HATAMOTO_UPDATES=off`). To upgrade, change the version in `Dockerfile.vercel` and redeploy.
- Hatamoto listens on `API_PORT`, so the start command sets it from `$PORT`. Vercel's default is 80.
- Install stats are off (`HATAMOTO_TELEMETRY=off`). Each new instance starts with an empty disk and would otherwise count as a new install.

## How to use

1. Create the project and add a Postgres database from the [Vercel Marketplace](https://vercel.com/docs/marketplace-storage), such as Neon. The integration sets `DATABASE_URL`.
2. Add the secrets. Use the same `HATAMOTO_SECRET` in every environment that shares a database.
3. Deploy.

```bash
vercel link
vercel install neon
openssl rand -hex 32 | vercel env add HATAMOTO_SECRET production
vercel env add HATAMOTO_SETUP_CODE production
vercel env add HATAMOTO_ADMIN_PATH production   # for example /my-admin
vercel deploy --prod
```

Open `https://<your-deployment>.vercel.app<HATAMOTO_ADMIN_PATH>/setup` and enter `HATAMOTO_SETUP_CODE` to create the owner account. Migrations run automatically when an instance starts.

For media uploads, add an S3-compatible bucket (see the table below). Without one, uploaded files only exist on the instance that received them.

## Environment variables

See [`.env.example`](./.env.example) and the [Hatamoto configuration reference](https://github.com/Zen-Labs-Corp/hatamoto/blob/main/docs/site/operate/configuration-reference.md).

| Variable | Required | Meaning |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection string. A Marketplace Postgres integration sets it. |
| `DATABASE_DIRECT_URL` | No | Direct, unpooled connection for migrations and backups when `DATABASE_URL` goes through a transaction pooler. |
| `HATAMOTO_SECRET` | Yes | At least 32 characters, shared by every instance. Without it each instance generates its own on its own disk. |
| `HATAMOTO_SETUP_CODE` | Yes, for first run | The code the setup wizard asks for. 12+ characters and not a repeated pattern. Without it each instance logs a different random code. |
| `HATAMOTO_ADMIN_PATH` | Recommended | Pins the private admin address, such as `/my-admin`. |
| `PUBLIC_BASE_URL` | Recommended | Your public origin, used in canonical links, sitemaps, `llms.txt` and emails. |
| `DATABASE_MIN_CONNECTIONS` | Recommended: `0` | Lets idle instances release their database connections. |
| `MEDIA_MAX_SIZE_MB` | Recommended: `4` | Vercel Functions accept request bodies up to 4.5 MB. Hatamoto's default is 10. |
| `MEDIA_STORAGE`, `HATAMOTO_MEDIA_S3_*` | For uploads | `MEDIA_STORAGE=s3` plus endpoint, region, bucket, prefix and keys for any S3-compatible bucket. Hatamoto still serves files from `/media`. |
| `PORT` | No | Vercel's routing port, 80 by default. The image passes it to Hatamoto as `API_PORT`. |
| `PG_MAJOR` (build arg) | No | Postgres client major for in-app `pg_dump` backups. It must match your server. Defaults to 17. |

## Test locally

Requires Docker. The smoke test starts a throwaway Postgres 17 and a fake S3 bucket (a stdlib-only Python server in `local-test/mock_s3.py`), runs the image with the same variables as on Vercel, and walks through first-run setup. No real credentials are used.

```bash
docker build -f Dockerfile.vercel -t hatamoto-on-vercel .
bash local-test/smoke-test.sh
```

Expected output:

```
PASS  health on default PORT 80 (200)
PASS  ready (database connected) (200)
PASS  public home page (200)
PASS  admin redirects signed-out users (303)
PASS  setup wizard (200)
PASS  setup rejects a wrong code (422)
PASS  setup creates the owner (303)
PASS  owner is signed in (admin answers 200)
PASS  media upload (200)
PASS  upload stored in the S3 bucket
PASS  media served from the bucket (200)
PASS  served bytes match the upload
PASS  clean SIGTERM shutdown (exit 0 in 1s)
PASS  new instance listens on PORT=3000 (200)
PASS  setup wizard stays closed (404)
PASS  owner session survives the new instance
PASS  media still served (200)
All checks passed.
```

The shutdown time can vary by a second. The last four checks stop the first container and start a new one against the same database and bucket. A new Vercel instance starts the same way, with nothing left on the previous instance's disk.

## Caveats

- **Background jobs.** Hatamoto's in-process scheduler (scheduled publishing, webhook delivery, comment notifications, housekeeping) runs only while an instance is up. Functions scale down after 5 minutes without traffic in production, so a post scheduled for a quiet hour goes out with the next request. If you need prompt jobs, run the same image as a [Vercel Daemon](https://vercel.com/docs/daemons) (beta, production only) and set `HATAMOTO_WORKER=off` on the web service. This example does not include or test that setup.
- **Local disk.** The file system is not persistent. Use S3 for media and Hatamoto's off-site backup target for backups. The plugin compile cache under `/data` is rebuilt on demand.
- **Per-instance state.** Each instance keeps its own page cache. Page and menu edits reach other instances within about 3 seconds. Settings and theme changes wait for `HATAMOTO_PAGE_CACHE_TTL` (5 minutes by default).
- **Client IPs.** Hatamoto only trusts `X-Forwarded-For` from addresses listed in `HATAMOTO_TRUSTED_PROXIES`. This example leaves it unset, so rate limits may see the proxy address instead of the visitor's.

## Learn more

- [Container Runtime on Vercel Functions](https://vercel.com/docs/functions/runtimes/container)
- [Running Docker on Vercel](https://vercel.com/kb/guide/docker)
- [Hatamoto documentation](https://hatamoto.dev/docs)
- [Hatamoto: run several servers on one site](https://github.com/Zen-Labs-Corp/hatamoto/blob/main/docs/SCALING.md)
