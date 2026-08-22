---
name: TokenLab Model Explorer
slug: tokenlab-model-explorer
description: Browse public AI models, compare pricing metadata, and generate OpenAI-compatible and native endpoint examples.
framework: Other
type: AI
css: None
publisher: TokenLab
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstarter%2Ftokenlab-model-explorer&project-name=tokenlab-model-explorer&repository-name=tokenlab-model-explorer
demoUrl: https://tokenlab-model-explorer.vercel.app/widget
---

# TokenLab Model Explorer

A deployable [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server and interactive widget for exploring TokenLab's public model catalog. It needs no API key for discovery: users can browse model IDs, compare public pricing metadata, and generate copyable examples for OpenAI-compatible and native endpoints.

## Demo

- Interactive widget: [tokenlab-model-explorer.vercel.app/widget](https://tokenlab-model-explorer.vercel.app/widget)
- Streamable HTTP MCP endpoint: `https://tokenlab-model-explorer.vercel.app/mcp`

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstarter%2Ftokenlab-model-explorer&project-name=tokenlab-model-explorer&repository-name=tokenlab-model-explorer)

The deployed explorer reads only public TokenLab discovery data by default. Set `TOKENLAB_API_BASE` only when pointing it at a compatible API base URL.

## Run locally

```bash
pnpm install
pnpm test
pnpm start
```

The server starts on `http://localhost:8000`:

- `GET /` returns service metadata.
- `GET /widget` opens the standalone interactive preview.
- `POST /mcp` serves the Streamable HTTP MCP endpoint.

## MCP tools

| Tool | Purpose |
| --- | --- |
| `open_tokenlab_model_explorer` | Browse public models by category or search query. |
| `compare_tokenlab_models` | Compare public pricing metadata for up to eight model IDs. |
| `generate_tokenlab_endpoint_example` | Generate a cURL example for Chat Completions, Responses, Anthropic Messages, or Gemini `generateContent`. |

## Environment

```bash
TOKENLAB_API_BASE=https://api.tokenlab.sh
PORT=8000
```

The generated request snippets use `$TOKENLAB_API_KEY`, but the explorer itself never reads or stores that key.
