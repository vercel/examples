---
name: AgentsKit Chat
slug: agentskit-chat
description: A credential-free, streaming React chat starter built with the headless AgentsKit Chat framework.
framework:
  - React
type:
  - AI
  - Starter
css:
  - CSS
githubUrl: https://github.com/vercel/examples/tree/main/starter/agentskit-chat
demoUrl: https://agentskit-chat-example.vercel.app
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/starter/agentskit-chat&project-name=agentskit-chat&repository-name=agentskit-chat
publisher: AgentsKit
relatedTemplates:
  - next-chat
---

# AgentsKit Chat

A credential-free React starter for [`@agentskit/chat`](https://github.com/AgentsKit-io/agentskit-chat). It demonstrates streaming, cancellation, session state, and accessible headless rendering without requiring an API key.

The included local adapter returns deterministic streamed text, so the starter works immediately. Replace the adapter in `src/App.tsx` with an OpenAI, Anthropic, Gemini, Ollama, or custom AgentsKit adapter when connecting a model.

## Demo

https://agentskit-chat-example.vercel.app

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/starter/agentskit-chat&project-name=agentskit-chat&repository-name=agentskit-chat)

## Local Development

```bash
pnpm install
pnpm dev
```
