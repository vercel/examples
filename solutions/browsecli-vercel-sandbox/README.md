# Browser agent in a Vercel Sandbox

Run an AI agent inside a [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox) — an ephemeral Firecracker microVM — whose only tool is the [`browse`](https://www.npmjs.com/package/browse) CLI. The agent reasons with the [Vercel AI SDK](https://sdk.vercel.ai), and every action it takes is a `browse` command that drives a real browser running on [Browserbase](https://www.browserbase.com). The browser itself never runs in the microVM.

## How it works

```
┌─────────────────────────────┐      CDP over wss      ┌────────────────────────────┐
│  Vercel Sandbox (microVM)   │  ───────────────────▶  │  Browserbase cloud browser │
│  node24                     │                        │                            │
│  AI SDK agent loop          │ ◀───────────────────── │  navigates / reads pages   │
│  tool = `browse` CLI        │    page data           │                            │
└─────────────────────────────┘                        └────────────────────────────┘
```

- `sandbox.ts` (runs locally) provisions the sandbox, installs the `browse` CLI plus the AI SDK inside it, and starts the agent loop. It streams the agent's output back to your terminal.
- `agent.mjs` (runs inside the sandbox) is a single `generateText` call from the AI SDK. Its only tool shells out to `browse <args>`. The model navigates the web by emitting `browse` commands.

The default task asks the agent to find a discussion on Hacker News and summarize the debate from the top comments. Override it with the `TASK` env var.

## Setup

You need:

- `ANTHROPIC_API_KEY` — drives the agent ([console.anthropic.com](https://console.anthropic.com/settings/keys)).
- `BROWSERBASE_API_KEY` — the cloud browser ([browserbase.com/settings](https://www.browserbase.com/settings)).
- Vercel Sandbox credentials — `VERCEL_TOKEN` ([vercel.com/account/tokens](https://vercel.com/account/tokens)), `VERCEL_TEAM_ID`, and `VERCEL_PROJECT_ID` (from your Vercel project settings).

```bash
npm i
cp .env.example .env   # fill in the keys above
npx tsx sandbox.ts
```

A successful run provisions a sandbox, prints each `browse` command the agent issues, and ends with a `===== FINAL ANSWER =====` summary.

The default uses a plain `--remote` Browserbase session, which works on any plan. Verified browsers (residential IP + automatic CAPTCHA solving) are a Scale-plan upgrade — see [browserbase.com/pricing](https://www.browserbase.com/pricing).
