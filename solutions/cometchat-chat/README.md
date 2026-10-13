---
name: CometChat Chat Starter
slug: cometchat-chat
description: Add real-time chat to a Next.js app with one AI-agent prompt. CometChat skills pre-installed at .agents/skills/.
framework: Next.js
useCase:
  - SaaS
  - Realtime Apps
css: CSS
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fcometchat-chat&project-name=cometchat-chat&repository-name=cometchat-chat&demo-title=CometChat%20Chat%20Starter&demo-description=Add%20real-time%20chat%20to%20a%20Next.js%20app%20with%20one%20AI-agent%20prompt%20-%20CometChat%20skills%20pre-installed&demo-url=https%3A%2F%2Fcometchat-vercel-template.vercel.app&env=NEXT_PUBLIC_COMETCHAT_APP_ID,NEXT_PUBLIC_COMETCHAT_REGION,NEXT_PUBLIC_COMETCHAT_AUTH_KEY&envDescription=CometChat%20credentials%20-%20optional%20at%20deploy%20time%2C%20the%20%2Fcometchat%20skill%20fills%20them%20in%20later&envLink=https%3A%2F%2Fwww.cometchat.com%2Fdocs
demoUrl: https://cometchat-vercel-template.vercel.app
relatedTemplates:
  - slackbot
---

# CometChat Chat Starter

A blank Next.js (App Router) app with [CometChat](https://www.cometchat.com) AI-coding skills pre-installed at `.agents/skills/`. Deploy to Vercel, clone the resulting repo, open it in Claude Code / Cursor / any AI coding IDE, and ask "add chat to my app" — the agent walks you through signup, app creation, and writes a working chat integration. No CometChat account required up front.

## Demo

https://cometchat-vercel-template.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=examples-repo):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fcometchat-chat&project-name=cometchat-chat&repository-name=cometchat-chat&demo-title=CometChat%20Chat%20Starter&demo-description=Add%20real-time%20chat%20to%20a%20Next.js%20app%20with%20one%20AI-agent%20prompt%20-%20CometChat%20skills%20pre-installed&demo-url=https%3A%2F%2Fcometchat-vercel-template.vercel.app&env=NEXT_PUBLIC_COMETCHAT_APP_ID,NEXT_PUBLIC_COMETCHAT_REGION,NEXT_PUBLIC_COMETCHAT_AUTH_KEY&envDescription=CometChat%20credentials%20-%20optional%20at%20deploy%20time%2C%20the%20%2Fcometchat%20skill%20fills%20them%20in%20later&envLink=https%3A%2F%2Fwww.cometchat.com%2Fdocs)

The three `NEXT_PUBLIC_COMETCHAT_*` env vars are optional at deploy time — leave them blank, and the `/cometchat` skill fills them in when you run it from your AI agent.

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/cometchat-chat cometchat-chat
```

Next, install dependencies and run the dev server:

```bash
cd cometchat-chat
pnpm install
pnpm dev
```

## What's pre-installed

```
.agents/skills/
├── cometchat/                    Dispatcher — detects framework, gathers requirements, writes code
├── cometchat-core/               Init / login / provider / env vars / SSR safety
├── cometchat-components/         60+ component catalog with props and slot views
├── cometchat-placement/          Where to put chat (route, modal, drawer, widget)
├── cometchat-react-patterns/     React + Vite integration patterns
├── cometchat-nextjs-patterns/    Next.js App Router + Pages Router patterns
├── cometchat-react-router-patterns/
├── cometchat-astro-patterns/
├── cometchat-theming/            5 presets (Slack / WhatsApp / iMessage / Discord / Notion) + brand colors
├── cometchat-features/           40+ features — calls, polls, AI, reactions, file sharing
├── cometchat-customization/      Custom message bubbles, headers, composer actions
├── cometchat-production/         Server-minted auth tokens, user management
└── cometchat-troubleshooting/    Diagnostics — verify, drift, doctor
```

## How to use the skills

After deploying or cloning, open the project in an AI coding IDE that reads `.agents/skills/` (Cursor, Cline, Codex, GitHub Copilot, Windsurf, Replit Agent). Ask the agent:

```
add chat to my app
```

The agent reads the dispatcher skill, detects this is a Next.js App Router project, asks 4–5 setup questions (account, app name, region, intent, placement), and writes a working chat integration into `app/`.

**Claude Code users:** Claude Code reads `.claude/skills/` instead. After cloning, run once:

```bash
npx @cometchat/skills add
```

This copies the same skills into `.claude/skills/` so Claude Code picks them up.

## What you can build

- **Marketplace chat** (buyer ↔ seller drawer + inbox page)
- **SaaS productivity chat** (modal from navbar + full messages page)
- **Social / community** (full messenger with Chats / Calls / Users / Groups tabs)
- **Customer support** (floating widget bubble in the bottom-right)
- **Just messaging** (dedicated `/messages` route with two-pane layout)

The agent picks the placement based on what you say you're building.

## Source

- Skills source-of-truth: [github.com/cometchat/cometchat-skills](https://github.com/cometchat/cometchat-skills)
- UI Kit: [@cometchat/chat-uikit-react](https://www.npmjs.com/package/@cometchat/chat-uikit-react)
- Docs: [cometchat.com/docs](https://www.cometchat.com/docs)
