---
name: Zpup SVG API on Vercel
slug: zpup-svg-api
description: Turn small 3D scenes written as JSON into flat SVG pictures from any angle with Zpup, served by a Hono app on Vercel Functions and cached on the Vercel CDN.
framework:
  - Hono
type:
  - API
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/solutions/zpup-svg-api
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/zpup-svg-api&project-name=zpup-svg-api&repository-name=zpup-svg-api
publisher: Vercel
relatedTemplates:
  - hono-on-vercel
  - hono-mcp-remote-server
---

# Zpup SVG API on Vercel

An HTTP API for [Zpup](https://github.com/rxolve/zpup), an open-source library that turns a small 3D scene written as JSON into a flat SVG picture from any angle. Send a scene, get back a plain SVG with no JavaScript in it, ready for an `<img>` tag, an email, or a README. Because scenes are plain data, an AI model can write them too, and Zpup's validation errors say exactly where a scene is wrong and how to fix it.

The app is a single [Hono](https://vercel.com/docs/frameworks/backend/hono) file that Vercel deploys with zero configuration as a [Vercel Function](https://vercel.com/docs/functions) on [Fluid compute](https://vercel.com/docs/fluid-compute). It contains no Zpup code: it depends on the published `@zpup/core` package, pinned to `0.3.1`. `GET` endpoints take the scene in the URL and return `Cache-Control: s-maxage`, so the [Vercel CDN](https://vercel.com/docs/caching/cdn-cache) serves repeat requests for the same picture without running the function again.

## How to use

Deploy with the button, or from this folder:

```bash
pnpm install
vercel deploy --prod
```

No environment variables are needed.

### Endpoints

| Endpoint                                   | What it does                                                                                                            |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `GET /health`                              | Health check, with the Zpup version.                                                                                    |
| `POST /render`                             | Scene JSON in the body, SVG out. Query: `view=x,y,z` (degrees, replaces the scene's `rotate`), `precision`.             |
| `GET /render.svg?scene=<url-encoded JSON>` | Same as `POST /render`, cacheable on the CDN. Use it as an image URL.                                                   |
| `POST /spin`                               | Scene JSON in the body, an SVG that turns forever (no JavaScript). Query: `axis`, `duration`, `keyframes`, `direction`. |
| `GET /spin.svg?scene=<url-encoded JSON>`   | Same as `POST /spin`, cacheable on the CDN.                                                                             |
| `POST /check`                              | Validates a scene without drawing it. Returns `valid`, `issues` and `warnings`.                                         |

```bash
curl -X POST https://<your-deployment>.vercel.app/render \
  -H 'content-type: application/json' \
  -d '{"width":120,"height":120,"rotate":{"x":-20,"y":30},"children":[
        {"type":"dot","stroke":40,"color":"#e62"},
        {"type":"ellipse","diameter":70,"stroke":5,"color":"#636","rotate":{"x":90}}]}'
```

An invalid scene returns `400` with every problem, its path and a suggested fix:

```json
{"error":"Invalid scene or options.","issues":[{"path":"scene.children[0].colour","message":"scene.children[0].colour: unknown option \"colour\". Did you mean \"color\"? ...","hint":"Did you mean \"color\"?"}, ...]}
```

The scene format is documented in the [Zpup README](https://github.com/rxolve/zpup#readme).

### Limits

To keep one request from using a lot of CPU, the API accepts bodies up to 64 KB, `scene` query parameters up to 8 KB, at most 400 nodes per scene, and at most 120 spin keyframes. Change the constants at the top of `src/index.ts` to adjust them.

## Test locally

Requires Node.js 24 and pnpm. The smoke test serves the app with a small Node standard-library adapter (`local-test/serve.ts`) and checks the endpoints with `curl`. It needs no network access.

```bash
pnpm install
bash local-test/smoke-test.sh
```

Expected output:

```
PASS  health (200)
PASS  health reports zpup 0.3.1
PASS  POST /render (200)
PASS  returns image/svg+xml
PASS  SVG matches @zpup/core renderSvg byte for byte
PASS  GET /render.svg (img-friendly URL) (200)
PASS  GET is CDN-cacheable (s-maxage)
PASS  GET and POST return the same SVG
PASS  view override (200)
PASS  view=-60,30 draws a different angle
PASS  POST /spin (200)
PASS  spin SVG is animated
PASS  POST /check valid scene (200)
PASS  check says valid
PASS  invalid scene is rejected (400)
PASS  error names the bad option and suggests color
PASS  errors are not cached
PASS  not JSON is rejected (400)
PASS  too many keyframes is rejected (400)
PASS  body over 64 KB is rejected (413)
PASS  unknown path (404)
All checks passed.
```

To test the function as Vercel builds it, link the folder to a project, run `vercel build`, and point the smoke test at the output:

```bash
vercel link
vercel build
APP_ENTRY=.vercel/output/functions/index.func/src/index.js bash local-test/smoke-test.sh
```

For local development with the Vercel runtime, use `vercel dev`.

## Caveats

- **Zpup is pre-1.0.** Its API may change. This example pins `@zpup/core` to `0.3.1`; update the version in `package.json` and `ZPUP_VERSION` in `src/index.ts` together.
- **SVG only.** Zpup renders SVG strings. PNG output would need a rasterizer such as `@resvg/resvg-js`, which this example does not include.
- **No MCP endpoint.** Zpup's own MCP server (`@zpup/mcp`) runs over standard input and output and can write files to disk, so it is not exposed here. To give an AI model these tools over HTTP, wrap `@zpup/core` in a remote MCP server instead (see the related Hono MCP template).
- **Served SVG is user-supplied data.** Responses use `X-Content-Type-Options: nosniff` and a restrictive `Content-Security-Policy`. Zpup validates colors and shapes and has no text shape.

## Learn more

- [Zpup](https://github.com/rxolve/zpup)
- [Hono on Vercel](https://vercel.com/docs/frameworks/backend/hono)
- [Cache-Control headers on Vercel](https://vercel.com/docs/caching/cache-control-headers)
