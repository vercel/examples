# Browser agent with bash-tool in a Vercel Sandbox

A [Vercel AI SDK](https://ai-sdk.dev) agent that uses Vercel's [`bash-tool`](https://github.com/vercel-labs/bash-tool) to run the [`browse`](https://www.npmjs.com/package/browse) CLI inside a [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox) — an ephemeral Firecracker microVM. The `browse` CLI drives a real browser running on [Browserbase](https://www.browserbase.com), so the browser itself never runs in the microVM.

## How it works

```
┌──────────────────────────────┐        ┌──────────────────────────────┐     CDP/wss   ┌────────────────────────────┐
│  Host (your machine / CI)    │        │  Vercel Sandbox (microVM)    │  ──────────▶  │  Browserbase cloud browser │
│                              │        │  node24                      │               │                            │
│  ToolLoopAgent (AI SDK)      │ ─bash─▶ │  browse CLI runs here        │ ◀──────────── │  navigates / reads pages   │
│  reasoning + tool loop       │        │  (installed by sandbox.ts)   │   page data   │                            │
└──────────────────────────────┘        └──────────────────────────────┘               └────────────────────────────┘
```

- The **agent loop runs on the host**. `sandbox.ts` provisions the sandbox, installs the `browse` CLI inside it, builds a `bash` tool with `bash-tool` (`createBashTool({ sandbox })`), and runs a `ToolLoopAgent`.
- The **model is served through [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)**. A bare `provider/model` string (`anthropic/claude-sonnet-5`) resolves through the default Gateway provider in `ai@6`, authenticated by Vercel's OIDC token — so the same Vercel auth that powers the Sandbox also powers the model, and no `ANTHROPIC_API_KEY` is needed.
- Only the **`bash` tool executes inside the sandbox**. The model navigates the web by emitting `browse` commands, which `bash-tool` runs in the microVM.

The default task is a product-research example: on Amazon, search for the current top mechanical keyboards and, for the top 5 results, compare each product's title, price, star rating, and number of ratings — returning a comparison table with each product's URL. It is a genuinely browser-only task: Amazon search renders its results client-side and returns nothing useful to a plain HTTP fetch, so the agent has to drive a real browser. The agent plans its own steps — there are no site-specific instructions in the prompt. Override the goal with the `TASK` env var.

## Setup

The agent's model (`anthropic/claude-sonnet-5`) is served through [Vercel AI Gateway](https://vercel.com/docs/ai-gateway), so **one Vercel auth covers both the Sandbox and the model — there is no separate `ANTHROPIC_API_KEY`.**

You need:

- `BROWSERBASE_API_KEY` — the cloud browser ([browserbase.com/settings](https://www.browserbase.com/settings)). It is passed to the sandbox as a default environment variable (stored encrypted by Vercel and injected into the `browse` commands), so it is never written to a file in the sandbox.
- Vercel Sandbox credentials — `VERCEL_TOKEN` ([vercel.com/account/tokens](https://vercel.com/account/tokens)), `VERCEL_TEAM_ID`, and `VERCEL_PROJECT_ID` (from your Vercel project settings).
- Model auth via AI Gateway — pick one:
  - **OIDC (recommended, keyless):** link this directory to a Vercel project and pull its env. The `vercel` CLI writes a short-lived `VERCEL_OIDC_TOKEN` that the Gateway reads automatically — nothing else to manage:
    ```bash
    vercel link                # link to your Vercel project
    vercel env pull .env.local # writes VERCEL_OIDC_TOKEN
    ```
  - **AI Gateway API key:** create one at [vercel.com/dashboard/ai-gateway](https://vercel.com/dashboard/ai-gateway) and set `AI_GATEWAY_API_KEY` in `.env`. Use this if you prefer a long-lived key over OIDC.

```bash
npm i
cp .env.example .env       # fill in BROWSERBASE_API_KEY + Vercel Sandbox creds
vercel link                # OIDC path: link the project…
vercel env pull .env.local # …and pull VERCEL_OIDC_TOKEN (skip if using AI_GATEWAY_API_KEY)
npx tsx sandbox.ts
```

> AI Gateway requires the Vercel team to have a payment method / billing enabled to service model requests (free credits unlock once a card is on file). This is the only model-side prerequisite — there is no Anthropic account or key.

A successful run provisions a sandbox, prints each `browse` command the agent issues through the `bash` tool, and ends with a `===== FINAL ANSWER =====` summary.

The default uses a plain `--remote` Browserbase session, which works on any plan. Verified browsers (residential IP + automatic CAPTCHA solving) are a Scale-plan upgrade — see [browserbase.com/pricing](https://www.browserbase.com/pricing).
