---
name: Lean 4 with Lasm on Vercel
slug: lasm-container
description: Write a Hono API in Lean 4, prove properties of it, compile it to WebAssembly with Lasm, and run it on Vercel Functions as a container image.
framework:
  - Hono
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/lasm
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/lasm&project-name=lasm-on-vercel&repository-name=lasm-on-vercel
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# Lean 4 with Lasm on Vercel

Run a [Lean 4](https://lean-lang.org) web API on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images). [Lasm](https://github.com/Millillion/lasm) compiles ordinary Lean 4 programs ahead of time to WebAssembly and runs them on Node, so the request handlers are Lean functions mounted on [Hono](https://hono.dev).

Because it is Lean, you can prove properties of the code you deploy. `App.lean` proves that `clampLimit` always returns a page size between 1 and 100. The proofs are checked when Vercel builds the image, so a deployment with a broken proof fails to build instead of shipping.

The example ships no Lasm code. `Dockerfile.vercel` installs `@lasm/cli` at the version pinned in `package-lock.json` (0.3.5), which downloads Lean 4.35.0, compiles `Main.lean` and `App.lean`, and copies only `dist/` (the Wasm program, its launcher and production `node_modules`) onto `node:24-bookworm-slim`.

## Routes

| Route | Response |
| --- | --- |
| `GET /` | `{"message":"Hello from Lean on Vercel!"}` |
| `GET /hello/:name` | `{"message":"Hello, NAME, from Lean on Vercel!"}` |
| `GET /limit/:n` | `{"requested":"n","limit":<n clamped to 1..100>}` |
| `POST /echo` | `{"echo":<the JSON request body>}` |
| `GET /health` | `{"ok":true}` |

## How to use

Deploy with the button, or from this folder:

```bash
vercel deploy --prod
```

No environment variables are required. The first build downloads Lean and Lasm's build tools (a few hundred MB) and takes a few minutes.

## Environment variables

| Variable | Required | Meaning |
| --- | --- | --- |
| `PORT` | No | Defaults to `80` in the image, which is the port Vercel routes to. |
| `HOST` | No | Defaults to `0.0.0.0`. |

## Develop locally

Requires Node 24 or later. Lasm installs Lean for you.

```bash
npm install
PORT=3000 npm run dev
curl http://localhost:3000/hello/Ada
```

## Test locally

Requires Docker. The smoke test runs the exact image Vercel builds; the app calls no external APIs, so no mock server is needed.

```bash
docker build -f Dockerfile.vercel -t lasm-on-vercel .
./local-test/smoke-test.sh
```

Expected output (timings vary):

```
PASS  health (200)
PASS  root (200)
PASS  Lean handler with param (200)
PASS  proved clamp (upper) (200)
PASS  proved clamp (lower) (200)
PASS  proved clamp (in range) (200)
PASS  JSON echo (200)
PASS  unknown route (404)
PASS  SIGTERM exits cleanly (code 0, 131 ms)
PASS  default PORT=80
All checks passed.
```

## Caveats

- **Memory.** Lasm's Node apps need at least 512 MB of memory.
- **State.** Instances scale up and down with traffic and their file system is not durable. Keep data in an external database or cache, for example one from the [Vercel Marketplace](https://vercel.com/marketplace/category/storage).
- **Native target.** Lasm can also build straight to the Vercel Functions Node.js runtime with `lasm build Main.lean --target vercel` (Build Output API) instead of a container image. This example uses a container image so the image you test locally is the one Vercel runs.

## Learn more

- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [Deploy Node.js on Vercel with Docker](https://vercel.com/kb/guide/deploy-nodejs-on-vercel-with-docker)
- [Lasm documentation](https://github.com/Millillion/lasm#readme)
- [Lasm on Vercel Functions](https://github.com/Millillion/lasm/blob/main/docs/deploy/vercel.md)
