---
name: zeroauthy on Vercel
slug: zeroauthy-container
description: Run zeroauthy, an open-source Auth0-compatible identity server written in Go, on Vercel Functions as a container image with Postgres.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/zeroauthy
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/zeroauthy&project-name=zeroauthy&repository-name=zeroauthy&env=ZEROAUTHY_STORAGE__DSN,ZEROAUTHY_SECURITY__MASTER_KEY,ZEROAUTHY_SERVER__SYSTEM_HOST
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# zeroauthy on Vercel

Run [zeroauthy](https://github.com/occupysaas/zeroauthy), an open-source, self-hostable identity server that speaks the Auth0 Authentication and Management APIs, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images). Point an existing Auth0 SDK at a zeroauthy tenant domain: OIDC discovery, JWKS, hosted login, authorization code with PKCE, client credentials, refresh tokens and an admin console.

This example contains no zeroauthy code. `Dockerfile.vercel` fetches zeroauthy at a pinned commit, compiles one static Go binary (the admin console is embedded), and ships it on a distroless image (about 66 MB). All state lives in [Postgres](https://vercel.com/docs/postgres), so every function instance serves the same tenants, keys and users.

> zeroauthy has no tagged release yet. This example pins commit `5d1c30c`; change `ZEROAUTHY_COMMIT` in `Dockerfile.vercel` to upgrade.

## How it maps to Vercel

- **HTTP server:** zeroauthy listens on plain HTTP port 80 (`ZEROAUTHY_SERVER__LISTEN=:80` in the image), the port Vercel sends traffic to by default. Vercel terminates TLS; zeroauthy always advertises `https://<host>/` as the issuer.
- **Storage:** Postgres from the [Vercel Marketplace](https://vercel.com/docs/marketplace-storage), for example Neon. Migrations run at startup (`ZEROAUTHY_STORAGE__AUTO_MIGRATE=true`).
- **Tenants by host name:** each tenant is selected by the `Host` header. The admin console lives on a separate host (`ZEROAUTHY_SERVER__SYSTEM_HOST`), so add two domains to the project: one for the console and one per tenant.

## How to use

1. Add a Postgres database to the project, for example with `vercel install neon`, and copy its connection string.
2. Add a second domain to the project for the admin console, for example `my-zeroauthy-admin.vercel.app`.
3. Set the environment variables and deploy:

```bash
vercel env add ZEROAUTHY_STORAGE__DSN          # the Postgres connection string
vercel env add ZEROAUTHY_SECURITY__MASTER_KEY  # openssl rand -base64 32
vercel env add ZEROAUTHY_SERVER__SYSTEM_HOST   # my-zeroauthy-admin.vercel.app
vercel deploy --prod
```

4. Create the first console operator. Run the same image locally against the same database and master key; it prints a one-time setup link (valid for one hour) for the console host:

```bash
docker build -f Dockerfile.vercel -t zeroauthy-on-vercel .
docker run --rm \
  -e ZEROAUTHY_STORAGE__DSN -e ZEROAUTHY_SECURITY__MASTER_KEY -e ZEROAUTHY_SERVER__SYSTEM_HOST \
  zeroauthy-on-vercel admin create --email you@example.com
```

5. Sign in at `https://<console-host>/admin/`, create a tenant, and give it one of the project's domains. Then:

```bash
curl https://<tenant-domain>/.well-known/openid-configuration
```

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `ZEROAUTHY_STORAGE__DSN` | Yes | Postgres connection string (`postgres://` or `postgresql://`). The database needs a UTF-8 `LC_CTYPE`. |
| `ZEROAUTHY_SECURITY__MASTER_KEY` | Yes | 32-byte base64 key that envelope-encrypts signing keys and client secrets. Every instance must use the same value. |
| `ZEROAUTHY_SERVER__SYSTEM_HOST` | Yes | Host name of the admin console. Must not be a tenant domain. |
| `ZEROAUTHY_SEED` | No | Path to a declarative seed file. The image sets `ZEROAUTHY_SEED_MODE=create_only`, so console edits survive restarts. |
| `ZEROAUTHY_EMAIL__DRIVER` | No | `log` by default (emails are logged, not sent). Set `smtp` and the `ZEROAUTHY_EMAIL__SMTP__*` settings to deliver email. |

Every other setting in zeroauthy's [configuration](https://github.com/occupysaas/zeroauthy#configuration) can be set as a `ZEROAUTHY_*` variable, with `__` between levels.

## Test locally

Requires Docker and Python 3. The smoke test starts a throwaway Postgres container, runs the image the way Vercel does (port 80, no TLS, `Host` header selects the tenant), and uses only the test credentials in [`local-test/seed.yaml`](./local-test/seed.yaml).

```bash
docker build -f Dockerfile.vercel -t zeroauthy-on-vercel .
./local-test/smoke-test.sh
```

Expected output:

```
PASS  OIDC discovery on port 80 (200)
PASS  issuer is https://auth.example.test/ behind the proxy
PASS  JWKS (200)
PASS  unknown host is refused (404)
PASS  client_credentials token (200)
PASS  access token verifies against JWKS
PASS  wrong client secret (401)
PASS  password-realm login (user stored in PostgreSQL) (200)
PASS  ID token verifies against JWKS
PASS  wrong password is rejected (400)
PASS  admin console on the system host (200)
PASS  admin create prints a setup link
PASS  SIGTERM exits cleanly (code 0, 0s)
PASS  new instance: JWKS (200)
PASS  new instance: earlier token still verifies
PASS  new instance: client_credentials token (200)
All checks passed.
```

The last three checks stop the container and start a new one against the same database, the way Vercel replaces instances: keys, clients and users survive because they live in Postgres.

## Caveats

- **Background jobs.** zeroauthy runs its job workers (Management API jobs such as user import and export) and its event and log stream delivery inside the server process, polling the shared database. On Vercel they only run while an instance is up serving traffic. For steady processing, run a second copy of the image as a [Vercel Daemon](https://vercel.com/docs/daemons); `ZEROAUTHY_JOBS__WORKERS=0` turns Management API workers off on a process. This example does not include a daemon.
- **Actions and custom database scripts.** These need Node.js 22.13+ in the image (and npm on build nodes). The distroless image has no Node.js, so they are unavailable; base the runtime stage on a Node.js image to enable them.
- **First operator.** The `ZEROAUTHY_BOOTSTRAP__ADMIN_EMAIL` shortcut writes its setup link to a file on the instance, which you cannot read on Vercel. Use `admin create` as shown above.
- **Custom domains and certificates.** zeroauthy's own ACME and custom-domain proxy are not needed; add domains to the Vercel project instead.
- **Server-Sent Events.** The Events API streams over SSE, so connections end at the function's [maximum duration](https://vercel.com/docs/functions/configuring-functions/duration) and clients must resume.
- **Not verified here:** a real Vercel deployment, Neon specifically, SMTP delivery and browser login flows with Auth0 SDKs.

## Learn more

- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [Running Docker on Vercel](https://vercel.com/kb/guide/docker)
- [zeroauthy compatibility matrix](https://github.com/occupysaas/zeroauthy/blob/main/docs/compat/matrix.md)
