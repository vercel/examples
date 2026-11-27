---
name: Proton Calendar RO REST API on Vercel
slug: protoncalendar-ro-api-container
description: Run Proton Calendar RO REST API, an open-source FastAPI service for reading Proton Calendar events as JSON, on Vercel Functions as a container image.
framework:
  - FastAPI
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/protoncalendar-ro-api
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/protoncalendar-ro-api&project-name=protoncalendar-ro-api&repository-name=protoncalendar-ro-api&env=TIMEZONE,X_API_KEY,PROTON_CALENDAR_URL
publisher: Vercel
relatedTemplates:
  - container-images-demo
  - django-rest-framework
---

# Proton Calendar RO REST API on Vercel

Run [Proton Calendar RO REST API](https://github.com/xcalts/protoncalendar-ro-api), an open-source Python FastAPI service, on [Vercel Functions](https://vercel.com/docs/functions) using the [Container Runtime](https://vercel.com/docs/functions/runtimes/container). Proton Calendar has no public API; this service turns a Proton Calendar share link into a read-only JSON REST API with interactive Swagger UI (`/docs`) and ReDoc (`/redoc`).

This example contains no upstream API code. `Dockerfile.vercel` fetches release `0.6.0` of `protoncalendar-ro-api`, installs its pinned Python dependencies into a virtual environment, strips `pip`, and ships a slim runtime image (about 218 MB) running as a non-root user. Because upstream reads `UVICORN_PORT` rather than Vercel's `PORT` environment variable, `Dockerfile.vercel` starts Uvicorn with `--host 0.0.0.0 --port ${PORT:-80}` via `exec` so `SIGTERM` triggers a clean shutdown on scale-down.

> This example pins upstream release `0.6.0`. Change `PROTONCAL_VERSION` in `Dockerfile.vercel` to upgrade.

## How to use

Create a share link in Proton Calendar (`Settings -> Calendars -> Share -> Share with anyone`), generate an API key (`openssl rand -hex 32`), and deploy with the button or from this folder:

```bash
vercel env add TIMEZONE
vercel env add X_API_KEY
vercel env add PROTON_CALENDAR_URL
vercel deploy --prod
```

Then query health or any day's events (`DD-Mon-YYYY`):

```bash
curl https://<your-deployment>.vercel.app/health
curl -H "X-API-KEY: <your-api-key>" https://<your-deployment>.vercel.app/events/11-Dec-2026
```

Interactive OpenAPI documentation is served at `/docs` and `/redoc`.

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `TIMEZONE` | Yes | IANA time zone (for example `UTC` or `Europe/Rome`) used to define day boundaries and format event times. |
| `X_API_KEY` | Yes | Secret API key clients must pass in the `X-API-KEY` header (compared in constant time; never forwarded to Proton). |
| `PROTON_CALENDAR_URL` | Yes | Proton Calendar share link starting with `https://calendar.proton.me/api/calendar/v1/url/`. The app refuses to start with any other host or scheme. |
| `DEBUG` | No | Set to `true` to enable debug logging. Default: `false`. |
| `PORT` | No | Listening port inside the container. Defaults to `80`, which matches Vercel's default container port. |

## Test locally

Requires Docker, `openssl`, `curl`, and Python 3. The smoke test builds an isolated Docker bridge network and runs the image against a stdlib-only mock HTTPS server acting as `calendar.proton.me`, so no real Proton share link or API keys are used.

```bash
docker build -f Dockerfile.vercel -t protoncal-on-vercel .
bash ./local-test/smoke-test.sh
```

Expected output:

```
PASS  health (200)
PASS  rejects missing API key (401)
PASS  rejects invalid API key (401)
PASS  fetches day events (200)
PASS  events order, all-day, timed, and recurring expansion
PASS  Cache-Control: no-store header
PASS  empty day returns [] (200)
PASS  empty day payload is []
PASS  invalid date rejected (422)
PASS  Swagger UI (/docs) (200)
PASS  OpenAPI schema (200)
PASS  upstream never receives client X-API-KEY
PASS  default PORT=80 health (200)
PASS  clean SIGTERM shutdown (exit 0)
All checks passed.
```

## Caveats

- **Share link secrecy.** Your Proton Calendar share URL contains the decryption passphrase. Store `PROTON_CALENDAR_URL` only as a Vercel environment variable. Responses return `Cache-Control: no-store` so private calendar data is not cached by proxies, and upstream error handling never logs the URL.
- **No response caching.** Every `/events/{day}` call downloads and parses the `.ics` feed from `calendar.proton.me` (with a 30-second upstream timeout). Large calendars or high request volume will incur repeated upstream fetches.
- **Licensing.** This example wrapper is MIT-licensed; the upstream [protoncalendar-ro-api](https://github.com/xcalts/protoncalendar-ro-api) fetched at image build time is licensed under GPL-3.0-only.

## Learn more

- [Deploy Python apps on Vercel using Docker](https://vercel.com/kb/guide/vercel-docker-python-apps)
- [Container Runtime on Vercel Functions](https://vercel.com/docs/functions/runtimes/container)
- [Proton Calendar RO REST API](https://github.com/xcalts/protoncalendar-ro-api)
