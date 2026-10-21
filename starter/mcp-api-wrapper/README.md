# Run an MCP Server on Vercel

## Usage

Update `api/server.ts` with your tools, prompts, and resources following the [MCP TypeScript SDK v2 documentation](https://ts.sdk.modelcontextprotocol.io/v2/).

[There is also a Next.js version of this template](https://vercel.com/templates/next.js/model-context-protocol-mcp-with-next-js)

Connect MCP clients to:

```
https://your-deployment-url.vercel.app/mcp
```

The template serves the current MCP protocol and stateless 2025-era
Streamable HTTP clients from that single endpoint. The deprecated HTTP+SSE
transport is not supported, and Redis is not required.

## Notes for running on Vercel

- Requires Node.js 20 or later
- Make sure you have [Fluid compute](https://vercel.com/docs/functions/fluid-compute) enabled for efficient execution
- [Deploy the MCP template](https://vercel.com/templates/other/model-context-protocol-mcp-with-vercel-functions)

## Local dev

- Install dependencies with `pnpm install`
- Run `vercel dev` for local development
- Alternatively, integrate the system into the server framework of your choice.

## Sample Client

`scripts/test-client.mjs` lists the available tools and calls `roll_dice` over
Streamable HTTP.

```sh
pnpm test:client -- https://mcp-on-vercel.vercel.app
```
