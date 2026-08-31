// Headless smoke test for the agent path. Exercises the SAME `runBrowserAgent`
// logic the /api/chat route uses, against real cloud, and prints the streamed
// `browse` tool calls + final answer.
//
// Usage (from the project root, after `vercel env pull .env.local`):
//   set -a; source .env.local; set +a
//   BROWSERBASE_API_KEY=... pnpm smoke
//
// (`pnpm smoke` runs tsx with `--conditions=import`: this package is CJS-scoped
// and `bash-tool` is ESM-only, so a plain `tsx scripts/smoke.ts` cannot resolve it.)
import { runBrowserAgent } from '../ai/agent/run'
import { DEFAULT_TASK } from '../ai/agent/constants'

const task = process.env.TASK || DEFAULT_TASK

async function main() {
  console.log('› Task:', task)
  console.log('› Mode:', process.env.BROWSE_VCR_IMAGE ? 'VCR image' : 'runtime install')
  const response = await runBrowserAgent({ prompt: task })

  if (!response.body) throw new Error('No response body')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let finalText = ''

  // Parse the SSE UI-message stream just enough to surface bash calls + text.
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const json = line.slice(6).trim()
      if (!json || json === '[DONE]') continue
      let evt: Record<string, unknown>
      try {
        evt = JSON.parse(json)
      } catch {
        continue
      }
      if (evt.type === 'tool-input-available' && evt.toolName === 'bash') {
        const input = evt.input as { command?: string }
        console.log('-> bash:', input?.command)
      }
      if (evt.type === 'text-delta' && typeof evt.delta === 'string') {
        finalText += evt.delta
      }
    }
  }

  console.log('\n===== FINAL ANSWER =====\n' + (finalText || '(empty)'))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
