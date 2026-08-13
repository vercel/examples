// Provisions a Vercel Sandbox (an ephemeral Firecracker microVM) with the
// Browserbase `browse` CLI available, and adapts it to `bash-tool`'s Sandbox
// interface so the agent's `bash` tool executes commands INSIDE the microVM.
//
// The `browse` CLI drives a real browser running on Browserbase, so the browser
// never runs in the microVM — only the CLI does.
import { Sandbox } from '@vercel/sandbox'
import type { Sandbox as BashToolSandbox } from 'bash-tool'

// Default sandbox env vars. Vercel stores them encrypted server-side and injects
// them into every command, so they reach the `browse` commands the bash tool
// runs — without ever being written to a committed file or echoed back.
//   BROWSERBASE_API_KEY — authenticates `browse` against Browserbase.
//   BROWSE_SESSION=agent — steers `browse` to run remotely and share one named
//   browser session across commands, so the agent never has to pass
//   --remote/--session flags itself.
function sandboxEnv(): Record<string, string> {
  const browserbaseApiKey = process.env.BROWSERBASE_API_KEY
  if (!browserbaseApiKey) {
    throw new Error('Missing required env var: BROWSERBASE_API_KEY')
  }
  return { BROWSERBASE_API_KEY: browserbaseApiKey, BROWSE_SESSION: 'agent' }
}

/**
 * Create a sandbox with `browse` available.
 *
 * Dual-mode:
 *  - If `BROWSE_VCR_IMAGE` is set, boot from that prebuilt image (the `browse`
 *    CLI is baked in — see the README "Template image" section). This skips the
 *    per-request npm install for a faster cold start.
 *  - Otherwise, boot the `node24` runtime and `npm install -g browse@latest`.
 */
export async function createBrowseSandbox(): Promise<Sandbox> {
  const env = sandboxEnv()
  const image = process.env.BROWSE_VCR_IMAGE

  if (image) {
    return Sandbox.create({ image, env, timeout: 600_000 })
  }

  const sandbox = await Sandbox.create({
    runtime: 'node24',
    env,
    timeout: 600_000,
  })

  const install = await sandbox.runCommand('npm', [
    'install',
    '-g',
    'browse@latest',
  ])
  if (install.exitCode !== 0) {
    await sandbox.stop()
    throw new Error(`browse install failed (exit ${install.exitCode})`)
  }

  return sandbox
}

async function streamToString(
  stream: NodeJS.ReadableStream
): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf-8')
}

/**
 * Adapt a `@vercel/sandbox` v2 instance to `bash-tool`'s Sandbox interface
 * (executeCommand / readFile / writeFiles). `bash-tool` ships a built-in
 * wrapper, but its duck-typing detection doesn't recognize `@vercel/sandbox` v2,
 * so we pass this small explicit adapter (documented in the bash-tool README).
 * `bash` executes IN the microVM; the agent loop stays on the host.
 */
export function toBashToolSandbox(sandbox: Sandbox): BashToolSandbox {
  return {
    async executeCommand(command: string) {
      const result = await sandbox.runCommand('bash', ['-c', command])
      const [stdout, stderr] = await Promise.all([
        result.stdout(),
        result.stderr(),
      ])
      return { stdout, stderr, exitCode: result.exitCode }
    },
    async readFile(filePath: string) {
      const stream = await sandbox.readFile({ path: filePath })
      if (stream === null) throw new Error(`File not found: ${filePath}`)
      return streamToString(stream)
    },
    async writeFiles(files) {
      await sandbox.writeFiles(
        files.map((f) => ({
          path: f.path,
          content: Buffer.isBuffer(f.content)
            ? f.content
            : Buffer.from(f.content),
        }))
      )
    },
  }
}
