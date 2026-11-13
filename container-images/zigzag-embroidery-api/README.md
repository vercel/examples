---
name: ZigZag Embroidery API on Vercel
slug: zigzag-embroidery-api-container
description: Turn SVG artwork into machine embroidery files (PES, DST, EXP, JEF, VP3) with the open-source ZigZag engine, running on Vercel Functions as a container image.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/zigzag-embroidery-api
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/zigzag-embroidery-api&project-name=zigzag-embroidery-api&repository-name=zigzag-embroidery-api&env=API_KEY
publisher: Vercel
relatedTemplates:
  - container-images-demo
  - rust-axum
---

# ZigZag Embroidery API on Vercel

Run [ZigZag](https://github.com/simpsoka/zigzag), an open-source Rust embroidery digitizer, as an HTTP API on [Vercel Functions](https://vercel.com/docs/functions) with the [Container runtime](https://vercel.com/docs/functions/runtimes/container). Send an SVG, get back a stitched machine file (PES, DST, EXP, JEF or VP3) or a PNG preview of the stitches.

This example contains no ZigZag code. `Dockerfile.vercel` fetches ZigZag at a pinned release, compiles its `zigzag` command-line tool (default features only: no GUI, no Bluetooth, no system libraries), and ships it next to `server.py`, a small HTTP wrapper that uses only the Python standard library. Each request converts in its own temporary directory, so the service is stateless and scales across instances.

> This example pins ZigZag `v0.1.2` (commit `7fdb49f`). Change `ZIGZAG_TAG` and `ZIGZAG_COMMIT` in `Dockerfile.vercel` to upgrade.

## How to use

Deploy with the button, or from this folder:

```bash
vercel env add API_KEY   # optional, but recommended for a public deployment
vercel deploy --prod
```

Then call it:

```bash
curl https://<your-deployment>.vercel.app/healthz

# SVG -> Brother PES
curl -H "Authorization: Bearer $API_KEY" -H "content-type: image/svg+xml" \
  --data-binary @logo.svg -o logo.pes \
  "https://<your-deployment>.vercel.app/api/convert?format=pes"

# PNG preview of the stitches, and stitch stats plus digitizing checks
curl -H "Authorization: Bearer $API_KEY" --data-binary @logo.svg -o preview.png \
  "https://<your-deployment>.vercel.app/api/convert?format=png"
curl -H "Authorization: Bearer $API_KEY" --data-binary @logo.svg \
  "https://<your-deployment>.vercel.app/api/info"
```

| Route | What it does |
| --- | --- |
| `GET /healthz` | Returns `ok` |
| `GET /api/formats` | Output formats and ZigZag's fabric presets |
| `POST /api/convert?format=<fmt>` | Body: SVG. Returns the file. `fmt` is `pes`, `dst`, `exp`, `jef`, `vp3` or `png`. Optional `fabric=<preset>` and `hat=1` |
| `POST /api/info` | Body: SVG. Returns stitch stats and digitizing checks as text |

Stitch settings come from the SVG itself: ZigZag reads tokens in layer and object ids such as `fill`, `satin`, `w=3` or `a=45`. See [ZigZag's README](https://github.com/simpsoka/zigzag#illustrator-workflow).

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `API_KEY` | No | When set, `/api/*` requests need `Authorization: Bearer <API_KEY>`. Set it for any public deployment, since every conversion uses CPU. |
| `MAX_SVG_BYTES` | No | Largest SVG accepted, in bytes. Default `2000000`. |
| `PORT` | No | Defaults to 80 in the image, which is what Vercel expects. |

## Test locally

Requires Docker. The smoke test runs the image you built, converts `local-test/design.svg`, and checks the output files' headers. No external services are used.

```bash
docker build -f Dockerfile.vercel -t zigzag-on-vercel .
bash local-test/smoke-test.sh
```

Expected output:

```
sha256:9c6bb814195183cc36c1f27006131b3e4d8db0a61201905ee9c1862faf3f0883
PASS  health (200)
PASS  rejects missing API key (401)
PASS  lists formats (200)
PASS  SVG -> PES (200)
PASS  PES file header (#PES)
PASS  SVG -> DST (200)
PASS  DST file header (LA:)
PASS  SVG -> PNG preview (200)
PASS  PNG signature
PASS  design info and checks (200)
PASS  info reports stitch count
PASS  rejects unknown format (400)
PASS  rejects empty body (400)
PASS  default PORT 80 (200)
PASS  SIGTERM clean exit (code 0, 1s)
All checks passed.
```

The first build takes a few minutes because it compiles ZigZag and its Rust dependencies.

## Caveats

- **Desktop features are not included.** The visual editor, its built-in MCP server and sending designs to a Brother Skitch over Bluetooth are part of ZigZag's desktop app and are not available in this API.
- **CPU-bound work.** Large or dense designs take longer to stitch. Each CLI call is capped at 120 seconds by the wrapper, and requests are also bound by your [Function duration limit](https://vercel.com/docs/functions/limitations).
- **Fonts.** Outline text in your SVG before converting. ZigZag falls back to system fonts for live text, and the slim runtime image ships none.

## Learn more

- [Container runtime on Vercel Functions](https://vercel.com/docs/functions/runtimes/container)
- [Deploy Rust on Vercel with Docker](https://vercel.com/kb/guide/deploy-rust-on-vercel-with-docker)
- [ZigZag on GitHub](https://github.com/simpsoka/zigzag)
