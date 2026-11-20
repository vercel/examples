---
name: hippomaps on Vercel
slug: hippomaps-container
description: Run hippomaps, an open-source OpenStreetMap map app with plain-words search, on Vercel Functions as a container image.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/hippomaps
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/hippomaps&project-name=hippomaps&repository-name=hippomaps&env=MAPS_KEY
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# hippomaps on Vercel

Run [hippomaps](https://github.com/cdutsov/hippomaps), an open-source map app built on OpenStreetMap, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/runtimes/container). A Go server serves the page (MapLibre, plain JavaScript, no build step) and relays search, directions and place details to the map services you configure.

This example contains no hippomaps code. `Dockerfile.vercel` fetches the `v1.4.1` release at a pinned commit, compiles the Go server (the web page is embedded in the binary), and ships it on Alpine (about 36 MB). The server is stateless by default and configures itself from environment variables. The only change it needs for Vercel is the port: hippomaps reads `LISTEN`, so the image maps Vercel's `PORT` (80 by default) onto it and serves the page at `/`.

> To upgrade, change `HIPPOMAPS_REF` and `HIPPOMAPS_COMMIT` in `Dockerfile.vercel`. The build checks that the tag still points at the pinned commit.

## How to use

Deploy with the button, or from this folder:

```bash
vercel env add MAPS_KEY
vercel deploy --prod
```

Then open `https://<your-deployment>.vercel.app/`. Health check:

```bash
curl https://<your-deployment>.vercel.app/healthz
```

## Environment variables

See [`.env.example`](./.env.example) and the [hippomaps settings](https://github.com/cdutsov/hippomaps#settings) for the full list.

| Variable | Required | Meaning |
| --- | --- | --- |
| `MAPS_KEY` | Yes | Key of the map tiles API (`TILES_URL`, `https://api.overpass.ch` by default). The page sends it to the browser, which loads tiles directly. |
| `SEARCH_UPSTREAM` | No | An [overpass-search](https://gitlab.com/cdutsov/overpass-search) server. hippomaps relays it under `/api/search`, forwarding the visitor's address. |
| `ROUTING_URL` | No | A [Valhalla](https://github.com/valhalla/valhalla) server for directions and reachable areas. Without it, directions are left out of the page. |
| `PUBLIC_URL` | No | The site's public address: enables the canonical link, `robots.txt` and `sitemap.xml`. |
| `PORT` | No | Vercel routes to 80 by default. If you set `PORT` in project settings, the image listens there. |
| `BASE_PATH` | No | `/` in this image (upstream default is `/labs/maps`). |

Every other service (transit, voice, traffic, elevation, donations) is optional: without its setting, hippomaps leaves that feature out.

## Test locally

Requires Docker and Python 3. The smoke test runs the image against a fake search server, so no real keys or map services are used.

```bash
docker build -f Dockerfile.vercel -t hippomaps-on-vercel .
bash local-test/smoke-test.sh
```

Expected output (the mock also prints an `UPSTREAM ...` line for each call it receives):

```
PASS  health on PORT=8080 (200)
PASS  map page at / (200)
PASS  page carries MAPS_KEY
PASS  page uses the relayed search
PASS  embedded script /static/app.js (200)
PASS  service worker /sw.js (200)
UPSTREAM GET /search q=cafes by the Limmat x-forwarded-for=203.0.113.7
PASS  search relayed to upstream (200)
PASS  search answer comes from upstream
PASS  visitor address forwarded
PASS  unknown search path refused (404)
PASS  directions off without ROUTING_URL (404)
PASS  health on default port 80 (200)
PASS  clean exit on SIGTERM (code 0, 0s)
All checks passed.
```

## Caveats

- **The map services run elsewhere.** hippomaps is the web app and relay. overpass-search, Valhalla and MOTIS each need their own OpenStreetMap or timetable data and are not part of this example. Point the environment variables at servers you run or have access to.
- **Per-instance state.** Vercel scales to many instances and the file system is not persistent. The per-visitor rate limits and the picture cache are in memory, per instance. Don't set `STATS_DIR` or `FEEDBACK_DIR`; there is no volume to keep their files. `GEOIP_DB` only works with a database file baked into the image.
- **Licence.** hippomaps is GPL-3.0. This example's files are MIT; the image it builds contains hippomaps under its own licence.

## Learn more

- [Container Runtime on Vercel Functions](https://vercel.com/docs/functions/runtimes/container)
- [Does Vercel support Docker deployments?](https://vercel.com/kb/guide/does-vercel-support-docker-deployments)
- [hippomaps on GitHub](https://github.com/cdutsov/hippomaps)
