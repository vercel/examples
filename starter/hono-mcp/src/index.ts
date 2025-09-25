import { Hono } from 'hono'
import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'

const app = new Hono()

// Create MCP handler
const handler = createMcpHandler(
  (server) => {
    server.tool(
      'add',
      'Add two numbers',
      {
        a: z.number().describe('First number'),
        b: z.number().describe('Second number'),
      },
      async ({ a, b }) => {
        const result = a + b
        return {
          content: [{ type: 'text', text: `${a} + ${b} = ${result}` }],
        }
      }
    )

    server.tool(
      'subtract',
      'Subtract two numbers',
      {
        a: z.number().describe('First number'),
        b: z.number().describe('Second number'),
      },
      async ({ a, b }) => {
        const result = a - b
        return {
          content: [{ type: 'text', text: `${a} - ${b} = ${result}` }],
        }
      }
    )

    server.tool(
      'multiply',
      'Multiply two numbers',
      {
        a: z.number().describe('First number'),
        b: z.number().describe('Second number'),
      },
      async ({ a, b }) => {
        const result = a * b
        return {
          content: [{ type: 'text', text: `${a} × ${b} = ${result}` }],
        }
      }
    )

    server.tool(
      'divide',
      'Divide two numbers',
      {
        a: z.number().describe('Dividend'),
        b: z.number().describe('Divisor (cannot be zero)'),
      },
      async ({ a, b }) => {
        if (b === 0) {
          return {
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
  },
  {},
  {
    basePath: '/',
    maxDuration: 60,
    verboseLogs: true,
  }
)

// Mount MCP handler on /mcp route (it handles transport internally)
app.all('/mcp/*', async (c) => {
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
