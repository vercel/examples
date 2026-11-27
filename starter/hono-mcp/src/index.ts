import { Hono } from 'hono'
import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'

const app = new Hono()

// Create MCP handler
const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'add',
      {
        title: 'Add Numbers',
        description: 'Add two numbers',
        inputSchema: z
          .object({
            a: z.number().describe('First number'),
            b: z.number().describe('Second number'),
          })
          .strict(),
        outputSchema: z.object({ result: z.number() }).strict(),
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async ({ a, b }) => {
        const result = a + b
        return {
          content: [{ type: 'text', text: `${a} + ${b} = ${result}` }],
          structuredContent: { result },
        }
      }
    )

    server.registerTool(
      'subtract',
      {
        title: 'Subtract Numbers',
        description: 'Subtract one number from another',
        inputSchema: z
          .object({
            a: z.number().describe('Number to subtract from'),
            b: z.number().describe('Number to subtract'),
          })
          .strict(),
        outputSchema: z.object({ result: z.number() }).strict(),
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async ({ a, b }) => {
        const result = a - b
        return {
          content: [{ type: 'text', text: `${a} - ${b} = ${result}` }],
          structuredContent: { result },
        }
      }
    )

    server.registerTool(
      'multiply',
      {
        title: 'Multiply Numbers',
        description: 'Multiply two numbers',
        inputSchema: z
          .object({
            a: z.number().describe('First factor'),
            b: z.number().describe('Second factor'),
          })
          .strict(),
        outputSchema: z.object({ result: z.number() }).strict(),
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async ({ a, b }) => {
        const result = a * b
        return {
          content: [{ type: 'text', text: `${a} × ${b} = ${result}` }],
          structuredContent: { result },
        }
      }
    )

    server.registerTool(
      'divide',
      {
        title: 'Divide Numbers',
        description: 'Divide one number by another',
        inputSchema: z
          .object({
            a: z.number().describe('Dividend'),
            b: z.number().describe('Non-zero divisor'),
          })
          .strict(),
        outputSchema: z.object({ result: z.number() }).strict(),
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async ({ a, b }) => {
        if (b === 0) {
          return {
            isError: true,
            content: [
              { type: 'text', text: 'Error: Division by zero is not allowed' },
            ],
          }
        }
        const result = a / b
        return {
          content: [{ type: 'text', text: `${a} ÷ ${b} = ${result}` }],
          structuredContent: { result },
        }
      }
    )
  },
  {},
  {
    basePath: '/',
    verboseLogs: true,
  }
)

// Mount the stateless Streamable HTTP handler at its exact endpoint.
app.on(['GET', 'POST'], '/mcp', async (c) => {
  return await handler(c.req.raw)
})

// Keep the original welcome route
app.get('/', (c) => {
  return c.json({
    message: 'Hono MCP Server - Math Operations',
    endpoints: {
      mcp: '/mcp',
      description:
        'MCP server with math operation tools (add, subtract, multiply, divide)',
    },
    tools: ['add', 'subtract', 'multiply', 'divide'],
  })
})

export default app
