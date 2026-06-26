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
- Only the **`bash` tool executes inside the sandbox**. The model navigates the web by emitting `browse` commands, which `bash-tool` runs in the microVM.

The default task is a deep-research example: pull the most recent 10-Q filing for Snowflake, Datadog, and MongoDB from SEC EDGAR and return a comparison of their quarterly revenue, growth, RPO, and top risk factor. The agent plans its own steps — there are no site-specific instructions in the prompt. Override the goal with the `TASK` env var.

## Setup

You need:

- `ANTHROPIC_API_KEY` — drives the agent ([console.anthropic.com](https://console.anthropic.com/settings/keys)).
- `BROWSERBASE_API_KEY` — the cloud browser ([browserbase.com/settings](https://www.browserbase.com/settings)). It is passed to the sandbox as a default environment variable (stored encrypted by Vercel and injected into the `browse` commands), so it is never written to a file in the sandbox.
- Vercel Sandbox credentials — `VERCEL_TOKEN` ([vercel.com/account/tokens](https://vercel.com/account/tokens)), `VERCEL_TEAM_ID`, and `VERCEL_PROJECT_ID` (from your Vercel project settings).

```bash
npm i
cp .env.example .env   # fill in the keys above
npx tsx sandbox.ts
```

A successful run provisions a sandbox, prints each `browse` command the agent issues through the `bash` tool, and ends with a `===== FINAL ANSWER =====` summary.

The default uses a plain `--remote` Browserbase session, which works on any plan. Verified browsers (residential IP + automatic CAPTCHA solving) are a Scale-plan upgrade — see [browserbase.com/pricing](https://www.browserbase.com/pricing).
