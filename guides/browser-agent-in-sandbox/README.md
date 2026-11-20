# Browser Research Agent in a Vercel Sandbox

A full-stack [Next.js](https://nextjs.org) app: an autonomous browser-research agent that drives the Browserbase [`browse`](https://www.npmjs.com/package/browse) CLI inside a [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox) and streams its steps to the UI live. The agent plans its own steps — it runs `browse` commands through a `bash` tool to navigate the web and answer a research question.

The `browse` CLI drives a real browser running on [Browserbase](https://www.browserbase.com), so the browser itself never runs in the sandbox — only the CLI does. That keeps the microVM cheap and the browser fully managed (stealth, CAPTCHA solving, proxies are all on the Browserbase side).

## Demo

[browser-agent-in-sandbox.vercel.app](https://browser-agent-in-sandbox.vercel.app)

Enter a research task and watch the agent stream its `browse` steps live, then render the final comparison table.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/guides/browser-agent-in-sandbox&project-name=browser-agent-in-sandbox&repository-name=browser-agent-in-sandbox)

## How it works

```
┌────────────────────────────┐        ┌────────────────────────────┐    CDP/wss   ┌────────────────────────────┐
│  Next.js app (your deploy)  │        │  Vercel Sandbox (microVM)  │  ─────────▶  │  Browserbase cloud browser │
│                            │        │  node24 (or VCR image)     │              │                            │
│  /api/chat — agent loop    │ ─bash─▶ │  `browse` CLI runs here    │ ◀─────────── │  navigates / reads pages   │
│  (AI SDK streamText)       │        │                            │   page data  │                            │
│         ▲ stream                    └────────────────────────────┘              └────────────────────────────┘
│         │
│  UI (useChat) renders each `browse` step + final answer
└────────────────────────────┘
```

- The **agent loop runs in the `/api/chat` route**. It provisions a sandbox, builds a `bash` tool with [`bash-tool`](https://github.com/vercel-labs/bash-tool) bound to that sandbox, and runs the AI SDK's `streamText` with `stopWhen: stepCountIs(40)`.
- The **`bash` tool executes inside the sandbox**. The model navigates the web by emitting `browse` commands, which run in the microVM.
- The **model is served through [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)**. A bare `provider/model` string (`anthropic/claude-sonnet-5`) resolves through the default Gateway provider in `ai@6`, authenticated by Vercel's OIDC token — so the same Vercel auth that powers the Sandbox also powers the model, and there's no separate `ANTHROPIC_API_KEY`.
- The **UI streams live**. `useChat` from `@ai-sdk/react` renders each `browse` tool call (with a compact running/done/error indicator) as it happens, and the final answer as Markdown (the comparison table).
- The **system prompt is built fresh per request** (`buildSystemPrompt()`, not a static constant). It tells the agent it's running inside a sandbox microVM with no local browser (so it never passes `--local`), injects today's date at request time so it never guesses or hardcodes one, and tells it to give its best final answer from whatever it's gathered if it's nearing the step limit.

The default task is a genuinely browser-only example: on Amazon, search for the current top mechanical keyboards and, for the top 5 results, compare each product's title, price, star rating, and number of ratings — returning a comparison table with each product's URL. Amazon renders results client-side and returns nothing useful to a plain HTTP fetch, so the agent has to drive a real browser.

## Setup

The agent's model is served through AI Gateway, so **one Vercel auth covers both the Sandbox and the model — there is no separate Anthropic key.**

You need:

- `BROWSERBASE_API_KEY` — the cloud browser ([browserbase.com/settings](https://www.browserbase.com/settings)). It is passed to the sandbox as an encrypted environment variable, so it never lands in a file inside the sandbox.
- Model + Sandbox auth via Vercel — pick one:
  - **OIDC (recommended, keyless):** link this directory to a Vercel project and pull its env. The `vercel` CLI writes a short-lived `VERCEL_OIDC_TOKEN` that both the Gateway and the Sandbox read automatically:
    ```bash
    vercel link                # link to your Vercel project
    vercel env pull .env.local # writes VERCEL_OIDC_TOKEN
    ```
    When deployed to Vercel, OIDC is injected automatically — nothing to set.
  - **AI Gateway API key:** create one at [vercel.com/dashboard/ai-gateway](https://vercel.com/dashboard/ai-gateway) and set `AI_GATEWAY_API_KEY`. (Sandbox auth still comes from OIDC / the Vercel deployment.)

```bash
pnpm install
cp .env.example .env.local   # add BROWSERBASE_API_KEY
vercel link                  # OIDC path: link the project…
vercel env pull .env.local   # …and pull VERCEL_OIDC_TOKEN
pnpm dev                     # http://localhost:3000
```

> AI Gateway requires the Vercel team to have billing enabled to service model requests (free credits unlock once a card is on file). This is the only model-side prerequisite — there is no Anthropic account or key.

The default uses a plain `--remote` Browserbase session, which works on any plan. Verified browsers (residential IP + automatic CAPTCHA solving) are a Scale-plan upgrade — see [browserbase.com/pricing](https://www.browserbase.com/pricing).

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `BROWSERBASE_API_KEY` | yes | Authenticates `browse` against Browserbase. |
| `VERCEL_OIDC_TOKEN` | yes (keyless path) | Written by `vercel env pull`; powers both the Gateway and the Sandbox. Injected automatically on Vercel. |
| `AI_GATEWAY_API_KEY` | optional | Long-lived alternative to OIDC for the model only. |
| `BROWSE_VCR_IMAGE` | optional | Prebuilt sandbox image with `browse` baked in, for faster cold starts (see below). |

## Template image (faster cold start)

By default the route boots a `node24` sandbox and runs `npm install -g browse@latest` per request. To skip that install, point `BROWSE_VCR_IMAGE` at a prebuilt image — the `Dockerfile` here builds one from the official [`ghcr.io/browserbase/browse`](https://github.com/browserbase/stagehand/pkgs/container/browse) image:

```dockerfile
FROM ghcr.io/browserbase/browse
WORKDIR /work
```

(Vercel Sandbox base images must live in VCR, so you build/mirror from the official image into your project's registry — the runtime doesn't pull `ghcr.io` directly.)

Build and push it to your project's [Vercel Container Registry](https://vercel.com/docs/vercel-sandbox/images) (VCR), then set `BROWSE_VCR_IMAGE`:

```bash
# Pull the project's OIDC token, then authenticate Docker to the Vercel
# Container Registry with it.
vercel env pull .env.local
printf '%s' "$VERCEL_OIDC_TOKEN" | docker login vcr.vercel.com --username oidc --password-stdin

# Build for the sandbox platform (linux/amd64) with zstd compression and push
# straight to your project's registry.
docker buildx build --platform linux/amd64 \
  --output "type=image,name=vcr.vercel.com/<team>/<project>/browse-cli:v1,push=true,oci-mediatypes=true,compression=zstd,compression-level=3,force-compression=true" \
  .

# Then set the env var (locally in .env.local, or in your Vercel project):
# BROWSE_VCR_IMAGE=vcr.vercel.com/<team>/<project>/browse-cli:v1
```

The image takes a moment to process after the push — `Sandbox.create` returns `image_not_ready` until it is Ready, after which the route boots from it.

When `BROWSE_VCR_IMAGE` is set, the route creates the sandbox from that image and skips the install step. When it's unset, it falls back to the runtime install — both paths set `BROWSERBASE_API_KEY` and `BROWSE_SESSION=agent` in the sandbox env so `browse` runs remote and shares one session flag-free.

## Project structure

```
ai/agent/
  constants.ts   # model id, default task, system prompt
  sandbox.ts     # dual-mode sandbox creation + bash-tool adapter
  run.ts         # agent loop (streamText + bash tool) → UI message stream
app/
  api/chat/route.ts  # POST endpoint useChat talks to
  page.tsx           # prompt box + live step stream + Markdown answer
  layout.tsx         # Geist fonts, theme
components/          # shadcn-style UI + chat rendering
scripts/smoke.ts     # headless end-to-end smoke against real cloud
Dockerfile           # prebuilt browse image for BROWSE_VCR_IMAGE
```

> Future direction: Vercel [`eve`](https://vercel.com/docs) (beta) is a purpose-built durable-agent framework to graduate to once it's GA — it would manage the agent's long-running lifecycle (provisioning, retries, durability) so the route wouldn't have to.
