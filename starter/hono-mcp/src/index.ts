import { Hono } from 'hono'
import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'

const app = new Hono()

// Create MCP handler
const handler = createMcpHandler((server) => {
  server.registerTool(
    'add',
    {
      title: 'Add',
      description: 'Add two numbers',
      inputSchema: z
        .object({
          a: z.number().describe('First number'),
          b: z.number().describe('Second number'),
        })
        .strict(),
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
      }
    }
  )

  server.registerTool(
    'subtract',
    {
      title: 'Subtract',
      description: 'Subtract two numbers',
      inputSchema: z
        .object({
          a: z.number().describe('First number'),
          b: z.number().describe('Second number'),
        })
        .strict(),
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
      }
    }
  )

  server.registerTool(
    'multiply',
    {
      title: 'Multiply',
      description: 'Multiply two numbers',
      inputSchema: z
        .object({
          a: z.number().describe('First number'),
          b: z.number().describe('Second number'),
        })
        .strict(),
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
      }
    }
  )

  server.registerTool(
    'divide',
    {
      title: 'Divide',
      description: 'Divide two numbers',
      inputSchema: z
        .object({
          a: z.number().describe('Dividend'),
          b: z.number().describe('Divisor (cannot be zero)'),
        })
        .strict(),
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
      }
    }
  )
})

// Mount the single Streamable HTTP endpoint.
app.all('/mcp', async (c) => {
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
