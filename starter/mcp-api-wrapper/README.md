# Run an MCP Server on Vercel

## Usage

Update `api/server.ts` with your tools, prompts, and resources following the [MCP TypeScript SDK documentation](https://github.com/modelcontextprotocol/typescript-sdk/tree/main?tab=readme-ov-file#server).

[There is also a Next.js version of this template](https://vercel.com/templates/next.js/model-context-protocol-mcp-with-next-js)

## Notes for running on Vercel

- Requires a Redis attached to the project under `process.env.REDIS_URL`
- Make sure you have [Fluid compute](https://vercel.com/docs/functions/fluid-compute) enabled for efficient execution
- After enabling Fluid compute, open `vercel.json` and adjust max duration to 800 if you using a Vercel Pro or Enterprise account
- [Deploy the MCP template](https://vercel.com/templates/other/model-context-protocol-mcp-with-vercel-functions)

## Local dev

- Run `vercel dev` for local development
- Alternatively, integrate the system into the server framework of your choice.

## Sample Client

`script/test-client.mjs` contains a sample client to try invocations.

```sh
node scripts/test-client.mjs https://mcp-on-vercel.vercel.app
```
