# BrowseCLI in a Vercel Sandbox

Run the **BrowseCLI** inside a [**Vercel Sandbox**](https://vercel.com/docs/vercel-sandbox) — an ephemeral Firecracker microVM (NOT a serverless function) — to reach **any** website through a **Verified Browserbase browser**: residential IP, no datacenter-IP blocking, and automatic CAPTCHA / challenge solving.

## What it is

A Vercel Sandbox is great at running an **agent loop**, but a vanilla Firecracker microVM can't browse the real web reliably — it has a datacenter IP (instantly blocked), no anti-bot fingerprint hardening, and no CAPTCHA solving.

So we keep the browser **out** of the sandbox. The sandbox runs the [`browse`](https://github.com/browserbase/stagehand/tree/main/packages/cli) CLI, which connects out over CDP to a **Verified Browserbase browser** that:

- uses a **residential / verified IP** — no datacenter-IP blocking
- runs in **Verified browser mode** — passes bot-detection fingerprinting
- **auto-solves CAPTCHAs / challenges** server-side

```
┌─────────────────────────────┐      CDP over wss      ┌────────────────────────────┐
│  Vercel Sandbox (microVM)   │  ───────────────────▶  │  Browserbase Verified      │
│  node24 + `browse` CLI      │                        │  browser (residential IP,  │
│  your agent loop            │ ◀───────────────────── │  stealth, CAPTCHA solve)   │
└─────────────────────────────┘    page data / refs    └────────────────────────────┘
```

The browser lives on Browserbase, so protected sites actually load — instead of running Chrome inside the sandbox, where a datacenter IP and bot walls block real sites.

## Files

| File | Purpose |
| --- | --- |
| `sandbox.ts` | **Primary, runnable artifact.** Standalone script: `Sandbox.create({ runtime: 'node24' })` → `npm i -g browse` → upload + run the demo with Browserbase creds, streaming stdout. |
| `app/api/run/route.ts` | Optional Next.js (App Router) `POST /api/run` variant. |
| `browsecli-demo.sh` | The load-bearing demo: create a Verified session (`--proxies --verified --solve-captchas`), open a Cloudflare-protected page over CDP, assert real content. |
| `package.json` / `tsconfig.json` | Deps (`@vercel/sandbox`) + TS config. |
| `.env.example` | Required env vars. |

> **Note:** Verified browsers/sessions (residential IP + automatic CAPTCHA solving) require a Browserbase **Scale** plan — see https://www.browserbase.com/pricing and https://www.browserbase.com/verified. On lower plans, drop `--verified` (you'll get Basic stealth).

## How to run

1. Get a Browserbase API key at [browserbase.com/settings](https://www.browserbase.com/settings).
2. Get a Vercel token at [vercel.com/account/tokens](https://vercel.com/account/tokens), plus your team + project IDs.
3. Configure env and run the standalone script:

```bash
pnpm i
cp .env.example .env   # fill in Browserbase + Vercel creds
npx tsx sandbox.ts
```

Expected tail:

```
[browsecli-demo] page title : nowsecure.nl
[browsecli-demo] RESULT: ✅ PASS — reached real content through the protected site from inside the sandbox
✓ Done — BrowseCLI reached real content from inside the Vercel Sandbox.
```

Override the target with `TARGET_URL=https://… npx tsx sandbox.ts`.

### Next.js variant

Deploy this folder as a Next.js app and call:

```bash
curl -X POST https://<your-deployment>/api/run \
  -H 'content-type: application/json' \
  -d '{"targetUrl":"https://nowsecure.nl"}'
```

Set `BROWSERBASE_API_KEY` as a Vercel project env var. Vercel Sandbox auth (`VERCEL_TOKEN` / `VERCEL_TEAM_ID` / `VERCEL_PROJECT_ID`) resolves automatically when the route runs on Vercel.

## Why Browserbase

Running Chrome **inside** the sandbox gets a datacenter IP, no stealth fingerprint, and no CAPTCHA solving, so it gets walled on real sites. This example instead runs the browser **on Browserbase** (residential/verified IP, stealth, server-side CAPTCHA solve) and only runs the lightweight `browse` CLI in the microVM. Net result: the sandbox can actually reach protected, bot-defended sites.
