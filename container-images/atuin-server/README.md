---
name: Atuin Sync Server on Vercel
slug: atuin-server-container
description: Self-host the Atuin sync server for shell history and agent sessions on Vercel Functions as a container image, backed by Postgres.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/atuin-server
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/atuin-server&project-name=atuin-server&repository-name=atuin-server&env=ATUIN_DB_URI
publisher: Vercel
relatedTemplates:
  - container-images-demo
  - rust-axum
---

# Atuin Sync Server on Vercel

Run your own [Atuin](https://github.com/atuinsh/atuin) sync server on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/runtimes/container). Atuin keeps your shell history, and since 18.24 your coding agent sessions (Atuin Threads), end-to-end encrypted and in sync across every machine. The server only ever stores ciphertext.

This example contains no Atuin code. `Dockerfile.vercel` downloads the official `atuin-server` release binary at a pinned tag, verifies its published SHA-256 checksum, and ships it on Debian slim (about 150 MB). The server is a stateless HTTP API, so all state lives in Postgres and Vercel can scale it to zero and back.

> This example pins Atuin `v18.24.6`. Change `ATUIN_VERSION` in `Dockerfile.vercel` to upgrade.

## How to use

Atuin needs a Postgres database. Add one from the [Vercel Marketplace](https://vercel.com/docs/marketplace-storage) (for example Neon), which injects `DATABASE_URL`, or bring your own and set `ATUIN_DB_URI`. From this folder:

```bash
vercel link
vercel install neon                       # or: vercel env add ATUIN_DB_URI
vercel env add ATUIN_OPEN_REGISTRATION    # value: true, only while you sign up
vercel deploy --prod
```

Point your Atuin client at the deployment in `~/.config/atuin/config.toml`:

```toml
sync_address = "https://<your-deployment>.vercel.app"
```

Then register on your first machine, and log in with the same key everywhere else:

```bash
atuin register -u <username> -e <email>
atuin key                                  # save this, it decrypts your data
atuin sync

# on another machine
atuin login -u <username>
atuin sync
```

Once your accounts exist, remove `ATUIN_OPEN_REGISTRATION` and redeploy so nobody else can sign up.

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `DATABASE_URL` or `ATUIN_DB_URI` | Yes | Postgres connection string. `ATUIN_DB_URI` wins when both are set. Migrations run on startup. |
| `ATUIN_OPEN_REGISTRATION` | No | `true` lets new users register. Off by default. |
| `PORT` | No | Defaults to 80, which is what Vercel expects. The image maps it to Atuin's `ATUIN_PORT`. |
| `RUST_LOG` | No | `atuin_server=info` by default in the image. |

Any other [Atuin server setting](https://github.com/atuinsh/atuin/blob/main/docs/docs/self-hosting/server-setup.md) can be set as an `ATUIN_*` environment variable.

## Test locally

Requires Docker, curl and Python 3. The smoke test starts a throwaway Postgres container and runs the image against it, so no real database or credentials are used.

```bash
docker build -f Dockerfile.vercel -t atuin-server-on-vercel .
bash local-test/smoke-test.sh
```

Expected output (timings vary):

```
PASS  listens on $PORT, migrates DATABASE_URL
PASS  health (200)
PASS  server info (200)
PASS  server info reports a version
PASS  register user (200)
PASS  duplicate username rejected (400)
PASS  wrong password rejected (401)
PASS  login (200)
PASS  rejects missing token (400)
PASS  rejects invalid token (403)
PASS  whoami (200)
PASS  whoami returns the user
PASS  upload encrypted record (200)
PASS  record index (200)
PASS  index lists the host
PASS  download record (200)
PASS  ciphertext round-trips unchanged
PASS  SIGTERM exits cleanly (exit 0, 178 ms)
PASS  new instance listens on default port 80
PASS  registration closed by default (400)
PASS  server says registration is closed
PASS  login on new instance (200)
PASS  data survives the restart (200)
PASS  record is still there
All checks passed.
```

The second half of the test stops the container with `SIGTERM` and starts a fresh one on the default port with registration closed, to show that a new instance picks up existing accounts and records from Postgres.

## Caveats

- **Request size.** Vercel Functions accept request bodies up to [4.5 MB](https://vercel.com/docs/functions/limitations). Atuin's own `max_record_size` defaults to 1 GiB. Normal sync batches are small, but very large records (for example, long agent sessions) could be rejected with `413`.
- **Database connections.** Each instance opens its own connection pool. Use your provider's pooled connection string.
- **No local state.** Don't use SQLite (`sqlite://...`): the file system isn't persistent and every instance would have its own database.
- **Metrics.** Atuin's optional Prometheus endpoint runs on a second port, which Vercel doesn't route. Keep it disabled (the default).

## Learn more

- [Container Runtime on Vercel Functions](https://vercel.com/docs/functions/runtimes/container)
- [Running Docker on Vercel](https://vercel.com/kb/guide/docker)
- [Atuin server setup](https://github.com/atuinsh/atuin/blob/main/docs/docs/self-hosting/server-setup.md)
