import {
  Client,
  StreamableHTTPClientTransport,
} from '@modelcontextprotocol/client'

const origin =
  process.argv.slice(2).find((argument) => argument !== '--') ||
  'https://hono-mcp-demo.vercel.app'

async function main() {
  const client = new Client({
    name: 'hono-mcp-example-client',
    version: '1.0.0',
  })
  const transport = new StreamableHTTPClientTransport(
    new URL('/mcp', `${origin}/`)
  )

  await client.connect(transport)

  const { tools } = await client.listTools()
  console.log('Tools', tools)

  const result = await client.callTool({
    name: 'add',
    arguments: { a: 2, b: 3 },
  })
  console.log('Result', result)

  await client.close()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
