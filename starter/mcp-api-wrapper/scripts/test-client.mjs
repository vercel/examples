import {
  Client,
  StreamableHTTPClientTransport,
} from '@modelcontextprotocol/client'

const origin =
  process.argv.slice(2).find((argument) => argument !== '--') ||
  'https://mcp-on-vercel.vercel.app'

async function main() {
  const client = new Client({
    name: 'mcp-on-vercel-example-client',
    version: '1.0.0',
  })
  const transport = new StreamableHTTPClientTransport(
    new URL('/mcp', `${origin}/`)
  )

  await client.connect(transport)

  console.log('Connected', client.getServerCapabilities())

  const { tools } = await client.listTools()
  console.log('Tools', tools)

  const result = await client.callTool({
    name: 'roll_dice',
    arguments: { sides: 6 },
  })
  console.log('Result', result)

  await client.close()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
