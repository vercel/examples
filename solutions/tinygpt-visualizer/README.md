---
name: TinyGPT Visualizer on Vercel
slug: tinygpt-visualizer
description: Deploy TinyGPT Visualizer, an open-source tool that steps through a real GPT's forward and backward pass in the browser, as a static site on Vercel.
framework:
  - Svelte
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/solutions/tinygpt-visualizer
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/tinygpt-visualizer&project-name=tinygpt-visualizer&repository-name=tinygpt-visualizer
publisher: Vercel
relatedTemplates:
  - html-starter-with-analytics
---

# TinyGPT Visualizer on Vercel

Deploy [TinyGPT Visualizer](https://github.com/oshea00/tinygpt-viz) on Vercel. It lets you step through one forward and backward pass of a real, trained GPT (6 layers, 8 heads, 4,096-token vocabulary, about 5.8M parameters), see every number at every stage, and train it live. It includes attention views, a logit lens, interventions, LoRA and DPO fine-tuning, and guided lessons.

The model runs in the visitor's browser, on the GPU through WebGPU or on the CPU without it. So the whole app is a static site served from Vercel's CDN, with no functions, database, or secrets. The model weights load from Hugging Face in the browser.

This example contains no visualizer code. `build.sh` downloads the upstream project at a pinned commit, builds its Svelte + Vite UI in in-browser mode, and writes the site to `dist/`. Nothing in the upstream project needs to change.

> The upstream project has no tagged release. This example pins commit `7b681b1` and model revision `5c517c5`. Change `TINYGPT_COMMIT` and `MODEL_REVISION` in `build.sh` (or set them as environment variables) to upgrade.

## How to use

Deploy with the button, or from this folder:

```bash
vercel deploy --prod
```

Vercel runs `sh build.sh` and serves `dist/` (see [`vercel.json`](./vercel.json)). Open the deployment URL: the first visit downloads the model once and the browser keeps it. Add `?train=1` to the URL to enable live training. The first training step downloads the 124 MB training set.

The upstream project also has an optional Python server (PyTorch and a WebSocket bridge) for long training runs at full speed. It isn't needed for this deployment and isn't part of this example.

## Environment variables

All optional. They're read at build time and end up in the public JavaScript bundle, so never put secrets in them. See [`.env.example`](./.env.example).

| Variable         | Default                              | Meaning                                                                             |
| ---------------- | ------------------------------------ | ----------------------------------------------------------------------------------- |
| `TINYGPT_COMMIT` | `7b681b1…`                           | Upstream commit of `oshea00/tinygpt-viz` to build.                                  |
| `MODEL_REVISION` | `5c517c5…`                           | Hugging Face revision of the model export (`oshea00/tinygpt-viz`, `web/bpe-small`). |
| `VITE_MODEL_URL` | Hugging Face URL at `MODEL_REVISION` | Model base URL ending in `/`. Set it to host the model files somewhere else.        |

## Test locally

Requires Node.js 20.19+ (or 22.12+), `curl`, and Python 3. Build the site, then serve `dist/` and check it:

```bash
sh build.sh
bash local-test/smoke-test.sh
```

Expected output:

```
PASS  home page (200)
PASS  home page title
PASS  no analytics tag
PASS  all 4 page assets load (200)
PASS  model worker bundle (200)
PASS  guide page (200)
PASS  guide contents (docs/README.md) (200)
PASS  in-browser backend with model URL baked in
PASS  model.json reachable and valid
PASS  tokenizer.json reachable (200)
All checks passed.
```

The last two checks fetch the public model files from Hugging Face (no key needed). Set `OFFLINE=1` to skip them. To try the app itself, run `python3 local-test/serve.py` and open http://localhost:4173. The header should show `bpe-small · 6 layers × 8 heads … · connected`, and the next-token panel fills in for the sample prompt.

## Caveats

- **Model hosting.** The weights load from Hugging Face in the browser, not from your deployment. To serve them from Vercel too, have `build.sh` copy the exported model files into `dist/model/` and set `VITE_MODEL_URL=/model/`.
- **Browser support.** WebGPU works in Chrome, Edge, and Safari (and Firefox on Windows). Other browsers fall back to the CPU, which is slower, especially for training.
- **Analytics.** The upstream build adds a Google Analytics tag when `GA_MEASUREMENT_ID` is set. Leave it unset unless you want that.

## Learn more

- [TinyGPT Visualizer guide](https://github.com/oshea00/tinygpt-viz/blob/main/docs/README.md)
- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Configuring a build](https://vercel.com/docs/builds/configure-a-build)
