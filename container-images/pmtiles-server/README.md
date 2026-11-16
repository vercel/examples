---
name: PMTiles Map Tile Server on Vercel
slug: pmtiles-server-container
description: Serve self-hosted Protomaps map tiles from PMTiles archives in Vercel Blob, with go-pmtiles running on Vercel Functions as a container image.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/pmtiles-server
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/pmtiles-server&project-name=pmtiles-server&repository-name=pmtiles-server&env=PMTILES_BUCKET
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# PMTiles Map Tile Server on Vercel

Run the [`pmtiles serve`](https://docs.protomaps.com/deploy/server) tile server from [go-pmtiles](https://github.com/protomaps/go-pmtiles) on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/runtimes/container). It turns a single [PMTiles](https://docs.protomaps.com/pmtiles/) archive in object storage into standard `/{z}/{x}/{y}` tile URLs and TileJSON for MapLibre, Leaflet or OpenLayers.

This example contains no tile server code. `Dockerfile.vercel` fetches go-pmtiles at the pinned `v1.31.2` release, checks the commit, compiles a static binary, and ships it on Alpine. The server is stateless: it reads archives from an HTTPS bucket with HTTP Range requests, so a public [Vercel Blob](https://vercel.com/docs/vercel-blob) store works as the bucket and every function instance can serve every tile.

> Change `PMTILES_VERSION` and `PMTILES_COMMIT` in `Dockerfile.vercel` to upgrade.

## How to use

1. Get a `.pmtiles` archive. Extract the area you need from a [Protomaps daily build](https://maps.protomaps.com/builds/) with `pmtiles extract`, or convert your own MBTiles with `pmtiles convert`.
2. Upload it to a public Vercel Blob store (or any HTTPS host that supports Range requests), for example as `tiles/world.pmtiles`.
3. Deploy with the button, or from this folder:

```bash
vercel env add PMTILES_BUCKET   # e.g. https://<store-id>.public.blob.vercel-storage.com/tiles
vercel deploy --prod
```

The archive name becomes the path. For `tiles/world.pmtiles`:

```bash
curl https://<your-deployment>.vercel.app/world.json          # TileJSON
curl https://<your-deployment>.vercel.app/world/metadata      # archive metadata
curl -o tile.mvt https://<your-deployment>.vercel.app/world/0/0/0.mvt
```

Point MapLibre at the TileJSON URL as a vector source. Set `PMTILES_PUBLIC_URL` to your deployment URL so TileJSON lists absolute tile URLs.

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `PMTILES_BUCKET` | Yes | HTTPS base URL of the folder that holds your `.pmtiles` files, without a trailing slash. |
| `PMTILES_PUBLIC_URL` | No | Public URL of the deployment, used for the tile URLs in TileJSON. |
| `PMTILES_CORS` | No | Allowed CORS origins, comma-separated. The image defaults to `*`. |
| `PMTILES_CACHE_MB` | No | In-memory cache for archive headers and directories, per instance. Defaults to `64`. |
| `PORT` | No | Defaults to 80 in the image, which is what Vercel expects. |

`vercel.json` adds a `Vercel-CDN-Cache-Control` header so Vercel's CDN caches tiles and TileJSON for a day and serves stale responses while it revalidates. Tune it to how often you replace archives, or use a new archive name for each update.

## Test locally

Requires Docker and Python 3. The smoke test runs the image against a fake bucket that builds a tiny five-tile PNG archive in memory, so no real data or cloud storage is used.

```bash
docker build -f Dockerfile.vercel -t pmtiles-on-vercel .
bash local-test/smoke-test.sh
```

Expected output (the Range request count and shutdown time can vary):

```
PASS  health (204)
PASS  TileJSON (200)
PASS  TileJSON uses the public URL
PASS  metadata (200)
PASS  tile 0/0/0 (200)
PASS  tile content-type image/png
PASS  tile 0/0/0 bytes match the archive
PASS  tile 1/1/0 (200)
PASS  tile 1/1/0 bytes match the archive
PASS  tile 1/0/1 (200)
PASS  tile 1/0/1 bytes match the archive
PASS  conditional request (If-None-Match) (304)
PASS  zoom outside the archive (404)
PASS  unknown archive (404)
PASS  CORS request (200)
PASS  CORS header (*)
PASS  archive read with HTTP Range requests (10 requests)
PASS  stops on SIGTERM (102 ms)
All checks passed.
```

## Caveats

- **Read-only.** The server only reads archives. Upload or replace them in your bucket; nothing is written to the function's file system.
- **Per-instance cache.** Each instance keeps its own header and directory cache. Vercel's CDN cache in front of the function is what keeps repeat tile requests off the function.
- **Bucket requests.** Every cache miss is a Range request to the bucket, which counts toward the bucket's data transfer. Keep archives in a region close to your functions.
- **Shutdown.** `pmtiles serve` has no graceful-shutdown handler. On `SIGTERM` it exits immediately (exit code 2) without draining in-flight requests, which are short tile reads.
- **Metrics.** The optional Prometheus `/metrics` listener (`--admin-port`) is not enabled, because Vercel routes traffic to a single port.

## Learn more

- [Container runtime on Vercel Functions](https://vercel.com/docs/functions/runtimes/container)
- [Deploy Go using Docker on Vercel](https://vercel.com/kb/guide/deploy-go-using-docker-vercel)
- [Vercel Blob range requests](https://vercel.com/docs/vercel-blob/examples)
- [PMTiles concepts](https://docs.protomaps.com/pmtiles/) and [pmtiles CLI](https://docs.protomaps.com/pmtiles/cli)
