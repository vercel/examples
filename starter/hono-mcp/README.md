# Hono Remote MCP Server Example

This example demonstrates how to build a Model Context Protocol (MCP) server using [Hono](https://hono.dev/), a lightweight web framework, and deploy it to Vercel. The server exposes mathematical operation tools (add, subtract, multiply, divide) that can be consumed by MCP clients.

## Demo

To connect your MCP client to the server, use: [https://hono-mcp-demo.vercel.app/mcp](https://hono-mcp-demo.vercel.app/mcp)

You can also visit [https://hono-mcp-demo.vercel.app](https://hono-mcp-demo.vercel.app) in your browser.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). This example shows how to create an MCP server that exposes tools as HTTP endpoints.

## Features

- **Math Operations**: Four basic calculator tools (add, subtract, multiply, divide)
- **Current MCP Protocol**: Uses `mcp-handler` 2 and the MCP TypeScript SDK v2
- **Compatibility**: Serves MCP 2026-07-28 natively with stateless fallback for 2025-era Streamable HTTP clients
- **Type Safety**: Uses strict Zod 4 input and output schemas
- **Vercel Deployment**: Optimized for serverless deployment on Vercel

## Prerequisites

- Node.js 20 or later
- [Vercel CLI](https://vercel.com/docs/cli) installed globally

## Development

To develop locally:

```
npm install
vc dev
```

```
open http://localhost:3000
```

## Build

To build locally:

```
npm install
vc build
```

## Test with an MCP client

With the development server running, connect with the included SDK v2 client:

```
pnpm test:client -- http://localhost:3000
```

## Deployment

To deploy:

```
npm install
vc deploy
```

## API Endpoints

- **GET `/`** - Welcome endpoint with server information
- **GET/POST `/mcp`** - Stateless Streamable HTTP MCP endpoint

The deprecated HTTP+SSE transport is not supported. Redis is not required.

## Available Tools

The server exposes the following MCP tools:

- **add** - Add two numbers
- **subtract** - Subtract two numbers
- **multiply** - Multiply two numbers
- **divide** - Divide two numbers (with zero-division protection)

## Using the MCP Server

Once deployed, you can connect to this MCP server from any MCP-compatible client by pointing to the `/mcp` endpoint. The server handles the MCP protocol transport and tool execution automatically.
