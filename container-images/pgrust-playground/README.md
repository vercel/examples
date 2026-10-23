---
name: pgrust Playground on Vercel
slug: pgrust-playground-container
description: Run pgrust, a Postgres-compatible database written in Rust, with a web SQL client on Vercel Functions as a container image.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/pgrust-playground
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/pgrust-playground&project-name=pgrust-playground&repository-name=pgrust-playground&env=AUTH_USER,AUTH_PASS
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# pgrust Playground on Vercel

Run [pgrust](https://github.com/malisper/pgrust), a Rust rewrite of Postgres that is wire and SQL compatible with PostgreSQL 18, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images). The image pairs it with [pgweb](https://github.com/sosedoff/pgweb), a web SQL client, so you get a password-protected SQL playground in the browser, preloaded with sample data.

This example contains no pgrust or pgweb code. `Dockerfile.vercel` downloads both pinned releases, verifies their SHA-256 checksums, creates the database with pgrust's own `initdb`, and loads [`seed.sql`](./seed.sql) at build time. At boot, [`start.sh`](./start.sh) copies that database to `/tmp`, starts pgrust on a private Unix socket, and starts pgweb on `$PORT`.

> pgrust is beta software (this example pins `v0.4-beta`). Change `PGRUST_VERSION` and `PGRUST_SHA256` in `Dockerfile.vercel` to upgrade.

## How to use

Deploy with the button, or from this folder:

```bash
vercel env add AUTH_USER
vercel env add AUTH_PASS
vercel deploy --prod
```

Open the deployment URL and sign in with `AUTH_USER` and `AUTH_PASS`. Try:

```sql
select * from revenue_by_product;
select meta->>'channel' as channel, count(*) from orders group by 1;
```

pgweb also has a JSON API:

```bash
curl -u "$AUTH_USER:$AUTH_PASS" https://<your-deployment>.vercel.app/api/connection
curl -u "$AUTH_USER:$AUTH_PASS" --data-urlencode "query=select * from revenue_by_product" \
  https://<your-deployment>.vercel.app/api/query
```

To use your own data, edit `seed.sql` and redeploy.

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `AUTH_USER`, `AUTH_PASS` | Yes | HTTP basic auth for pgweb. The container refuses to start without them. |
| `PGWEB_READONLY` | No | Set to `1` to run pgweb in read-only mode. |
| `PORT` | No | Defaults to 80 in the image, which is what Vercel expects. |

## Test locally

Requires Docker. The smoke test starts the image with test credentials; it needs no network access beyond the build.

```bash
docker build -f Dockerfile.vercel -t pgrust-on-vercel .
./local-test/smoke-test.sh
```

Expected output:

```
PASS  serves on default PORT 80
PASS  rejects missing credentials (401)
PASS  rejects wrong password (401)
PASS  web UI (200)
PASS  connection info (200)
PASS  server is pgrust
PASS  lists seeded objects (200)
PASS  seed tables and view present
PASS  query seeded view (200)
PASS  aggregates over seeded rows
PASS  write (200)
PASS  read back the write
PASS  PGWEB_READONLY=1 blocks writes (400)
PASS  SIGTERM exits cleanly (code 0, 180 ms)
PASS  pgrust shut down cleanly
PASS  refuses to start without AUTH_USER/AUTH_PASS
All checks passed.
```

The image is about 300 MB and builds in under a minute, because it downloads release binaries instead of compiling pgrust.

## Caveats

- **It is a playground, not a database server.** Every instance boots from its own copy of the seeded database in `/tmp`. Writes stay on that instance and are lost when it scales in, and different instances do not see each other's writes. For durable Postgres, use a [Postgres provider from the Vercel Marketplace](https://vercel.com/docs/postgres).
- **HTTP only.** Vercel Functions serve HTTP, so pgrust is not reachable over the Postgres wire protocol from outside the container. Use the pgweb UI or its JSON API.
- **Root entrypoint.** `start.sh` runs as root so pgweb can bind port 80. pgrust itself runs as an unprivileged `pgrust` user.
- **Compatibility.** pgrust is beta and does not run every query shape yet. If a query is refused, the error comes from pgrust.
- **Licenses.** pgrust is AGPL-3.0 and pgweb is MIT. This example only downloads their releases; review the licenses before you modify or redistribute them.

## Learn more

- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [pgrust](https://github.com/malisper/pgrust)
- [pgweb](https://github.com/sosedoff/pgweb)
