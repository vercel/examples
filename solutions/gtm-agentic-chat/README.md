---
name: GTM Agentic Starter Kit
slug: gtm-agentic-chat
publisher: AmpUp
description: Open-source agentic chat for GTM teams over your live CRM, calls and notes. 10 ready-made agents, MCP connectors, your own LLM key.
framework: Next.js
type:
  - AI
  - SaaS
  - Starter
css: Tailwind
githubUrl: https://github.com/A79-ai/gtm-agentic-chat
demoUrl: https://chat.ampup.ai
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FA79-ai%2Fgtm-agentic-chat&project-name=gtm-agentic-chat&repository-name=gtm-agentic-chat&env=AMPUP_MCP_URL,AMPUP_MCP_API_KEY,ANTHROPIC_API_KEY&envDescription=Your%20AmpUp%20MCP%20endpoint%20%2B%20API%20key%20and%20an%20Anthropic%20API%20key&envLink=https%3A%2F%2Fgithub.com%2FA79-ai%2Fgtm-agentic-chat%2Fblob%2Fmain%2F.env.example&demo-title=GTM%20Agentic%20Starter%20Kit&demo-description=Self-deployable%20agentic%20chat%20over%20your%20CRM%2C%20calls%20and%20notes&demo-url=https%3A%2F%2Fchat.ampup.ai&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FA79-ai%2Fgtm-agentic-chat%2Fmain%2Fpublic%2Fbrand%2Fsocial-preview.png
relatedTemplates:
  - platforms-slate-supabase
  - cms-payload
---

# GTM Agentic Starter Kit

Self-deployable, open-source (MIT) agentic chat for go-to-market teams, over your own CRM, meetings/notetaker, and knowledge base. Pick an agent ("Deal Coach", "Outreach Writer", "Competitive Intel") and it works your live data. Powered by the [AmpUp](https://a79.ai) MCP server + the Vercel AI SDK.

The full source lives in [A79-ai/gtm-agentic-chat](https://github.com/A79-ai/gtm-agentic-chat); deploy it one-click to your own Vercel account, with your own data and LLM key.

## Demo

https://chat.ampup.ai

## How to Use

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FA79-ai%2Fgtm-agentic-chat&project-name=gtm-agentic-chat&repository-name=gtm-agentic-chat&env=AMPUP_MCP_URL,AMPUP_MCP_API_KEY,ANTHROPIC_API_KEY&envDescription=Your%20AmpUp%20MCP%20endpoint%20%2B%20API%20key%20and%20an%20Anthropic%20API%20key&envLink=https%3A%2F%2Fgithub.com%2FA79-ai%2Fgtm-agentic-chat%2Fblob%2Fmain%2F.env.example&demo-title=GTM%20Agentic%20Starter%20Kit&demo-description=Self-deployable%20agentic%20chat%20over%20your%20CRM%2C%20calls%20and%20notes&demo-url=https%3A%2F%2Fchat.ampup.ai&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FA79-ai%2Fgtm-agentic-chat%2Fmain%2Fpublic%2Fbrand%2Fsocial-preview.png)

### Clone and run

```bash
git clone https://github.com/A79-ai/gtm-agentic-chat
cd gtm-agentic-chat
cp .env.example .env.local   # set AMPUP_MCP_URL, AMPUP_MCP_API_KEY, ANTHROPIC_API_KEY
pnpm install
pnpm dev
```

## Environment Variables

See [.env.example](https://github.com/A79-ai/gtm-agentic-chat/blob/main/.env.example). Required: `AMPUP_MCP_URL`, `AMPUP_MCP_API_KEY`, and an LLM key (`ANTHROPIC_API_KEY`).
