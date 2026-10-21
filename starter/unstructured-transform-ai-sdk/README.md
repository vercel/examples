# Chat with your documents — Unstructured Transform MCP + AI SDK

A Next.js chat app that uses the [AI SDK](https://ai-sdk.dev) to connect a model to
[Unstructured's Transform MCP server](https://docs.unstructured.io/transform/overview).
Paste a public document URL and the model calls Transform MCP's tools to parse it —
PDFs, spreadsheets, scans, emails, and 70+ formats — into clean, structured Markdown,
with no parsing code of your own.

## Demo

Deployed without keys, the app runs in **preview mode**: the UI renders and explains how
to run it live. To actually chat, deploy your own copy (below) with your API keys.

## How to Use

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples). You'll be prompted for the two environment variables below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/starter/unstructured-transform-ai-sdk&env=ANTHROPIC_API_KEY,UNSTRUCTURED_API_KEY&envDescription=API%20keys%20for%20Claude%20and%20the%20Unstructured%20Transform%20MCP%20server&envLink=https://github.com/vercel/examples/blob/main/starter/unstructured-transform-ai-sdk/.env.example&project-name=unstructured-transform-ai-sdk&repository-name=unstructured-transform-ai-sdk)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/starter/unstructured-transform-ai-sdk unstructured-transform-ai-sdk
```

Then set your keys and run it:

```bash
cp .env.example .env.local   # fill in the two keys below
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste a public document URL.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | ✅ | Powers the chat model (Claude). Get one at [console.anthropic.com](https://console.anthropic.com/settings/keys). |
| `UNSTRUCTURED_API_KEY` | ✅ | Authenticates the Transform MCP server. Get one at [transform.unstructured.io](https://transform.unstructured.io). |
| `UNSTRUCTURED_MCP_URL` | — | Override the MCP endpoint. Defaults to `https://mcp.transform.unstructured.io`. |

## How it works

The route ([`app/api/chat/route.ts`](app/api/chat/route.ts)) connects to Transform MCP
over streamable HTTP with your Unstructured key as a bearer token ([`lib/mcp.ts`](lib/mcp.ts)),
fetches the server's tools with `mcp.tools()`, and hands them to `streamText`. The model
chains the calls it needs — start the transform, `wait` between status polls, fetch
results, then `downloadText` the parsed Markdown from the pre-signed URL — and streams
the answer back. `downloadText` is restricted to the Transform host to avoid SSRF.

Without keys, the app renders a preview and disables the chat, so a keyless deploy is a
clean UI preview rather than a runtime error.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [AI SDK](https://ai-sdk.dev) — `ai`, `@ai-sdk/react`, `@ai-sdk/anthropic`, `@ai-sdk/mcp`
- [Unstructured Transform MCP](https://docs.unstructured.io/transform/overview)
