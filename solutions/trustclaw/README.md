---
name: TrustClaw
slug: trustclaw
publisher: Composio
description: 24/7 AI assistant with 1000+ tools via OAuth + sandboxed execution. OpenClaw's ideas, rebuilt from scratch for security.
framework: Next.js
type:
  - Multi tenant-apps
  - Cron
css: Tailwind
githubUrl: https://github.com/vercel/examples/tree/main/solutions/trustclaw
demoUrl: https://trustclaw.vercel.app
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Ftrustclaw&project-name=trustclaw&repository-name=trustclaw&env=BETTER_AUTH_SECRET,COMPOSIO_API_KEY,CRON_SECRET&envDescription=Generate%20BETTER_AUTH_SECRET%20and%20CRON_SECRET%20with%3A%20openssl%20rand%20-base64%2032.%20Get%20a%20free%20COMPOSIO_API_KEY%20at%20https%3A%2F%2Fdashboard.composio.dev%2Flogin%3Fflow%3Ddeveloper&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Ftrustclaw%23environment-variables&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22neon%22%2C%22productSlug%22%3A%22neon%22%2C%22protocol%22%3A%22storage%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22upstash%22%2C%22productSlug%22%3A%22upstash-kv%22%2C%22protocol%22%3A%22storage%22%7D%5D&skippable-integrations=1
relatedTemplates:
  - slackbot
  - cron
  - ai-chatgpt
---

# TrustClaw

**Your AI that does things while you sleep. _Securely._**

A 24/7 personal AI assistant with 1000+ tools via **OAuth** and **sandboxed execution**. Built on the ideas behind OpenClaw, rebuilt from scratch for security. Talks to you on the web or Telegram, remembers what matters, and handles recurring work on autopilot.

## Demo

https://trustclaw.vercel.app

## How to Use

### Option 1: Smart CLI (recommended)

```bash
npx @composio/trustclaw deploy
```

Handles the entire deploy:

- Forks (or publishes) the repo to your GitHub
- Creates a Vercel project linked to it
- Provisions Postgres + pgvector via Vercel Marketplace (and optionally Upstash Redis)
- Auto-generates `BETTER_AUTH_SECRET` and `CRON_SECRET`
- Prompts you for a free [Composio API key](https://dashboard.composio.dev/login?flow=developer)
- Runs the Prisma schema sync against your fresh database
- Triggers the production deploy and opens the URL in your browser
- Optionally walks you through Telegram bot setup
- Tunes config (cron schedule, function timeouts) for your Vercel plan

**Prerequisites:** [Vercel](https://vercel.com) + [GitHub](https://github.com) accounts, plus a free [Composio API key](https://dashboard.composio.dev/login?flow=developer).

### Option 2: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Ftrustclaw&project-name=trustclaw&repository-name=trustclaw&env=BETTER_AUTH_SECRET,COMPOSIO_API_KEY,CRON_SECRET&envDescription=Generate%20BETTER_AUTH_SECRET%20and%20CRON_SECRET%20with%3A%20openssl%20rand%20-base64%2032.%20Get%20a%20free%20COMPOSIO_API_KEY%20at%20https%3A%2F%2Fdashboard.composio.dev%2Flogin%3Fflow%3Ddeveloper&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Ftrustclaw%23environment-variables&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22neon%22%2C%22productSlug%22%3A%22neon%22%2C%22protocol%22%3A%22storage%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22upstash%22%2C%22productSlug%22%3A%22upstash-kv%22%2C%22protocol%22%3A%22storage%22%7D%5D&skippable-integrations=1)

The Vercel deploy flow will:

1. Prompt you to install **Neon Postgres** (required) and **Upstash Redis** (optional - skippable). Both auto-inject their connection strings (`DATABASE_URL`, `REDIS_URL`) into your project on install.
2. Prompt you for the three secrets: `BETTER_AUTH_SECRET`, `COMPOSIO_API_KEY`, `CRON_SECRET`.

After the first deploy, you'll need to run the Prisma schema sync once against your new Neon database. The smart CLI in Option 1 handles this automatically; for the deploy button path, see [Environment variables](#environment-variables) and [Option 3](#option-3-clone-and-deploy) for the migration step.

### Option 3: Clone and Deploy

```bash
git clone https://github.com/vercel/examples.git
cd examples/solutions/trustclaw
pnpm install
cp .env.example .env       # fill in DATABASE_URL, BETTER_AUTH_SECRET, COMPOSIO_API_KEY, CRON_SECRET
pnpm prisma db push        # apply schema (Postgres + pgvector required)
pnpm dev                   # http://localhost:3000
```

## Features

|                              |                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| 🔐 **OAuth Only**            | Connects through OAuth. No passwords stored or shared.                                |
| ⚡ **Zero Setup**            | Sign up, chat, done. No API keys or config files.                                     |
| 💤 **Works While You Sleep** | Schedule tasks and let your agent handle them on autopilot.                           |
| ☁️ **Sandboxed Execution**   | Every action runs in an isolated cloud environment that's gone when the task is done. |

### What it can do

- Chat with Claude in a Next.js dashboard or via a Telegram bot
- Long-term memory backed by Postgres + pgvector
- 3-layer context management (pruning, memory flush, summarization compaction) so conversations can run indefinitely
- 1000+ Composio tool integrations (Gmail, GitHub, Slack, Notion, Linear, Calendar, Drive, Stripe, HubSpot, …)
- Cron-scheduled agent runs for recurring tasks
- Username/password login via Better Auth

## Security model

|                    | TrustClaw                      | Vanilla local agents         |
| ------------------ | ------------------------------ | ---------------------------- |
| **Setup**          | Seconds                        | Hours of config              |
| **Credentials**    | Encrypted, managed by Composio | Plaintext in local config    |
| **Code Execution** | Remote sandbox                 | On your local machine        |
| **Integrations**   | OAuth, 1000+ apps              | Manual API key setup per app |
| **Skill Security** | Managed tool surface           | Unvetted public registry     |
| **Audit Trails**   | Full action log                | None                         |
| **Revocation**     | One click                      | Find and delete config files |

The design choices:

- **No raw API keys handed to the agent** - Composio brokers OAuth for every tool
- **No code runs on your machine** - every tool call executes in an isolated remote environment
- **No long-lived shell access** - destructive prompt injection from a scraped email can't `rm -rf` your laptop because the agent doesn't have a shell on your laptop

## Architecture

```
┌──────────────┐    ┌──────────────────────────────────────────┐
│  Web (Next)  │───▶│             Next.js App                  │
│   Telegram   │───▶│  ┌────────────────────────────────────┐  │
│     Cron     │───▶│  │  tRPC API + agent runtime          │  │
└──────────────┘    │  │  (prepareAgentRun → ToolLoopAgent) │  │
                    │  └─────────┬──────────────────────────┘  │
                    │            │                              │
                    │   ┌────────┼─────────┬──────────┐        │
                    │   ▼        ▼         ▼          ▼        │
                    │ Postgres  Redis  AI Gateway  Composio    │
                    │ (pgvector)      (LLM + emb.)             │
                    └──────────────────────────────────────────┘
```

### Tech stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- [tRPC](https://trpc.io) for all backend logic
- [Better Auth](https://www.better-auth.com/) (username/password)
- [Prisma](https://prisma.io) + Postgres + [pgvector](https://github.com/pgvector/pgvector)
- [Vercel AI SDK](https://sdk.vercel.ai) + AI Gateway (LLM + embeddings)
- [Composio SDK](https://composio.dev) for tool integrations
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- Redis (resumable streams, optional)

## Environment variables

| Variable                               | Purpose                                | How it's set                             |
| -------------------------------------- | -------------------------------------- | ---------------------------------------- |
| `DATABASE_URL`                         | Postgres + pgvector connection string  | Auto-injected by the Neon integration    |
| `REDIS_URL` _(optional)_               | Resumable streams + abort flags        | Auto-injected by the Upstash integration |
| `BETTER_AUTH_SECRET`                   | Session signing key (32+ random bytes) | You provide during deploy                |
| `COMPOSIO_API_KEY`                     | Composio tool integrations             | You provide during deploy                |
| `CRON_SECRET`                          | Auth for `/api/cron/*` routes          | You provide during deploy                |
| `TELEGRAM_BOT_TOKEN` _(optional)_      | Telegram bot                           | Add later via Vercel project settings    |
| `TELEGRAM_BOT_USERNAME` _(optional)_   | Telegram bot                           | Add later via Vercel project settings    |
| `TELEGRAM_WEBHOOK_SECRET` _(optional)_ | Telegram webhook auth                  | Add later via Vercel project settings    |

LLM and embedding calls route through Vercel AI Gateway - **no Anthropic or OpenAI API keys required.**

## License

MIT

Built on top of [Composio](https://composio.dev). Inspired by [OpenClaw](https://github.com/openclaw/openclaw), rebuilt for security. Canonical source: [ComposioHQ/trustclaw](https://github.com/ComposioHQ/trustclaw).
