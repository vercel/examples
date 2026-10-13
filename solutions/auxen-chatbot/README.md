---
name: Auxen Dedicated LLM Chatbot
slug: auxen-chatbot
publisher: Auxen
description: Next.js chatbot wired to your own dedicated LLM endpoint on Auxen. Per-minute GPU billing, no per-token fees, OpenAI-compatible API.
framework: Next.js
useCase: AI
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fauxen-ai%2Fauxen-nextjs-starter&env=AUXEN_API_BASE,AUXEN_API_KEY&envDescription=Per-instance%20base%20URL%20and%20API%20key%20issued%20by%20the%20Auxen%20dashboard&envLink=https%3A%2F%2Fauxen.ai
demoUrl: https://auxen.ai
---

# Auxen Dedicated LLM Chatbot

A minimal Next.js chatbot wired to your own [Auxen](https://auxen.ai) dedicated LLM endpoint. Zero external SDK dependencies — just `fetch` against Auxen's OpenAI-compatible `/v1/chat/completions` API.

## What is Auxen

[Auxen](https://auxen.ai) hosts per-customer **dedicated** LLM endpoints (Llama 3.1/3.2, Qwen 2.5, Mistral, Gemma 2, Mixtral, Phi-3, Command R). Each instance is a dedicated GPU running one open-source model, billed per-minute of runtime — no per-token charges, no monthly minimums.

## Demo

The chatbot runs in your own browser against your own Auxen instance — provision one at [auxen.ai](https://auxen.ai) to try it.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fauxen-ai%2Fauxen-nextjs-starter&env=AUXEN_API_BASE,AUXEN_API_KEY&envDescription=Per-instance%20base%20URL%20and%20API%20key%20issued%20by%20the%20Auxen%20dashboard&envLink=https%3A%2F%2Fauxen.ai)

### Clone and Deploy

```bash
git clone https://github.com/auxen-ai/auxen-nextjs-starter.git
cd auxen-nextjs-starter
npm install
cp .env.example .env.local  # then fill in AUXEN_API_BASE and AUXEN_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting.

## Configuration

| Env var          | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| `AUXEN_API_BASE` | Per-instance base URL, e.g. `https://api.auxen.ai/v1/inst_xxx/v1` (from the dashboard) |
| `AUXEN_API_KEY`  | Per-instance API key prefixed `auxk_` (from the dashboard)                             |
| `AUXEN_MODEL`    | Optional — the model your instance is serving. Defaults to `llama-3.1-8b`.             |

## How it works

The Edge route handler at `/api/chat` proxies messages to your Auxen instance and streams the OpenAI Chat Completions SSE response back to the browser:

```ts
const upstream = await fetch(`${AUXEN_API_BASE}/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${AUXEN_API_KEY}`,
  },
  body: JSON.stringify({ model, messages, stream: true }),
});
return new Response(upstream.body, {
  headers: { "Content-Type": "text/event-stream" },
});
```

That's the whole integration. No AI SDK dependency — `fetch` + the browser's SSE parser handle everything.

## Pricing

Auxen bills per-minute of dedicated GPU runtime, not per token. See [auxen.ai/pricing](https://auxen.ai/pricing).

## Source

Canonical source repo: [github.com/auxen-ai/auxen-nextjs-starter](https://github.com/auxen-ai/auxen-nextjs-starter)
