# Hono Remote MCP Server Example

This example demonstrates how to build a Model Context Protocol (MCP) server using [Hono](https://hono.dev/), a lightweight web framework, and deploy it to Vercel. The server exposes mathematical operation tools (add, subtract, multiply, divide) that can be consumed by MCP clients.

## Demo

To connect your MCP client to the server, use: [https://hono-mcp-demo.vercel.app/mcp](https://hono-mcp-demo.vercel.app/mcp)

You can also visit [https://hono-mcp-demo.vercel.app](https://hono-mcp-demo.vercel.app) in your browser.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). This example shows how to create an MCP server that exposes tools as HTTP endpoints.

## Features

- **Math Operations**: Four basic calculator tools (add, subtract, multiply, divide)
- **MCP Handler**: Uses `mcp-handler` library for easy MCP server creation
- **Type Safety**: Built with TypeScript and Zod for runtime validation
- **Vercel Deployment**: Optimized for serverless deployment on Vercel

## Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) installed globally
- Node.js 20 or later

## Development

Run commands from this example directory, not from the repository root:

```bash
cd starter/hono-mcp
npm install
vercel dev
```

When the Vercel CLI asks for the project root, keep the default current
directory (`starter/hono-mcp`). Do not point the project root at `src`; `src`
contains the Hono entrypoint, but the package metadata and lockfile live one
level above it.

```bash
open http://localhost:3000
```

## Build

To build locally:

```bash
npm install
vercel build
```

## Deployment

To deploy:

```bash
npm install
vercel deploy
```

## API Endpoints

- **GET `/`** - Welcome endpoint with server information
- **POST `/mcp/*`** - MCP protocol endpoint for tool execution

## Available Tools

The server exposes the following MCP tools:

- **add** - Add two numbers
- **subtract** - Subtract two numbers
- **multiply** - Multiply two numbers
- **divide** - Divide two numbers (with zero-division protection)

## Using the MCP Server

Once deployed, you can connect to this MCP server from any MCP-compatible client by pointing to the `/mcp` endpoint. The server handles the MCP protocol transport and tool execution automatically.
