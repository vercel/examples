---
name: BenchUp on Vercel
slug: benchup
description: Build BenchUp, an open-source Rust and WebGPU 3D modeler for woodworking, from a pinned release and serve it as a static site on Vercel.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/rust/benchup
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/rust/benchup&project-name=benchup&repository-name=benchup
publisher: Vercel
relatedTemplates:
  - rust-axum
---

# BenchUp on Vercel

Host your own copy of [BenchUp](https://github.com/BenchUp3D/editor), a free, open-source 3D modeling app for woodworking and furniture design (formerly KetchUp). BenchUp is written in Rust, compiles to WebAssembly, and renders with WebGPU, falling back to WebGL2. The browser build is a set of static files, so Vercel serves it from its CDN with no Functions and no server.

This example contains no BenchUp code. During the Vercel build, `build.sh` installs Rust with the `wasm32-unknown-unknown` target and a prebuilt [Trunk](https://trunkrs.dev) binary. It then downloads BenchUp at a pinned release and runs `trunk build --release --locked` into `public/`, which Vercel serves as static files.

> This example pins BenchUp `v0.6.6` and Trunk `0.22.0`, the Trunk version BenchUp's own browser build uses. Change `BENCHUP_REF` in `build.sh` to a newer tag or a commit SHA to upgrade.

## How to use

Deploy with the button, or from this folder:

```bash
vercel deploy --prod
```

`vercel.json` selects the **Other** framework preset, skips the install step, runs `bash build.sh` as the Build Command, and serves `public/`. Open the deployment URL to start modeling. Projects autosave in the visitor's browser, and **File → Save** downloads a portable `.bup` project.

## Environment variables

None are required.

| Variable | Required | Meaning |
| --- | --- | --- |
| `BENCHUP_REF` | No | Upstream tag or commit to build. Defaults to `v0.6.6`. |
| `TRUNK_VERSION` | No | Trunk release to download. Defaults to `0.22.0`. |

`build.sh` sets `BENCHUP_UPDATE_REPOSITORY=BenchUp3D/editor`, which BenchUp's build script reads, and builds without an account server (`BENCHUP_SERVER_URL` unset). The browser editor stores work locally and needs neither.

## Test locally

Requires Docker, Python 3 and curl. Vercel's build image is based on Amazon Linux 2023, so build inside that image, then smoke-test the output with a local static server:

```bash
docker run --rm -v "$PWD":/work -w /work public.ecr.aws/amazonlinux/amazonlinux:2023 bash build.sh
bash local-test/smoke-test.sh
```

Expected output for `v0.6.6` (the module size changes between releases):

```
PASS  index.html (200)
PASS  editor canvas in page
PASS  page references hashed JS loader
PASS  page references hashed WebAssembly module
PASS  JS loader (200)
PASS  loader wired to module
PASS  WebAssembly module (200)
PASS  module has WebAssembly magic bytes
INFO  module size: 17 MB
PASS  English message catalog (200)
PASS  catalog is valid JSON
PASS  logo (200)
PASS  web manifest (200)
PASS  missing path (404)
All checks passed.
```

To try the editor itself, keep the server running (`python3 -m http.server 4173 --directory public`) and open <http://localhost:4173> in a desktop browser with WebGPU or WebGL2.

## Caveats

- **Build time.** Every build compiles BenchUp in release mode from a cold Cargo cache. Builds must finish within Vercel's 45-minute limit. If yours runs close, use a larger build machine, or build locally and deploy with `vercel deploy --prebuilt`.
- **Desktop only.** BenchUp targets desktop browsers with a mouse and keyboard, and needs hardware-accelerated WebGPU or WebGL2. WebGPU requires a secure context, which Vercel deployments and `localhost` both provide.
- **Local data.** Autosave lives in each visitor's browser storage on each device. There is no cloud storage or account system in this release.
- **x86_64 builds.** `build.sh` downloads the x86_64 Linux Trunk binary used by Vercel's build image. On other platforms, install Trunk yourself (`cargo install --locked trunk`) before running the script.

## Learn more

- [BenchUp user documentation](https://github.com/BenchUp3D/editor/blob/main/docs/README.md)
- [Configuring a build on Vercel](https://vercel.com/docs/builds/configure-a-build)
- [Vercel build image](https://vercel.com/docs/builds/build-image)
