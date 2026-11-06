import { createMCPClient } from '@ai-sdk/mcp';

const DEFAULT_MCP_URL = 'https://mcp.transform.unstructured.io';

/**
 * Creates an MCP client connected to Unstructured's Transform MCP server over
 * streamable HTTP. The Unstructured API key is passed as a Bearer token.
 *
 * Remember to call `client.close()` when the request is finished.
 */
export async function createTransformMCPClient() {
  const apiKey = process.env.UNSTRUCTURED_API_KEY;
  if (!apiKey) {
    throw new Error(
      'UNSTRUCTURED_API_KEY is not set. Add it to your environment (see .env.example).',
    );
  }

  return createMCPClient({
    transport: {
      type: 'http',
      url: process.env.UNSTRUCTURED_MCP_URL ?? DEFAULT_MCP_URL,
      headers: { Authorization: `Bearer ${apiKey}` },
    },
  });
}
